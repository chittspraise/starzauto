"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { CARS_TAG, deleteCar, findCar, insertCar, updateCar } from "@/lib/cars";
import { setEnquiryHandled } from "@/lib/enquiries";
import { BODY_TYPES, CAR_STATUSES, FUEL_TYPES, TRANSMISSIONS } from "@/lib/types";
import { deletePhotos, MAX_PHOTOS, savePhotos, validatePhotos } from "@/lib/uploads";

// ---- Auth ----

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Incorrect password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---- Cars ----

export type CarFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const carSchema = z.object({
  make: z.string().trim().min(1, "Required").max(60),
  model: z.string().trim().min(1, "Required").max(60),
  year: z.coerce
    .number()
    .int()
    .min(1950)
    .refine((y) => y <= new Date().getFullYear() + 1, "Year is in the future"),
  price: z.coerce.number().int().min(0, "Must be 0 or more"),
  mileage: z.coerce.number().int().min(0, "Must be 0 or more"),
  fuelType: z.enum(FUEL_TYPES),
  transmission: z.enum(TRANSMISSIONS),
  bodyType: z.enum(BODY_TYPES),
  color: z.string().trim().max(40).default(""),
  description: z.string().trim().max(5000).default(""),
  status: z.enum(CAR_STATUSES),
  featured: z.preprocess((v) => v === "on", z.boolean()),
  // Optional listing details
  variant: z.string().trim().max(60).default(""),
  auctionGrade: z.string().trim().max(10).default(""),
  chassisNumber: z.string().trim().max(40).default(""),
  engineCc: z.preprocess(
    (v) => (v === "" || v === undefined ? null : v),
    z.coerce.number().int().min(0, "Must be 0 or more").max(20000).nullable(),
  ),
  mileageGenuine: z.preprocess((v) => v === "on", z.boolean()),
  location: z.string().trim().max(60).default(""),
  priceDestination: z.string().trim().max(60).default(""),
  priceNote: z.string().trim().max(200).default(""),
});

export async function saveCar(
  carId: number | null,
  _prev: CarFormState,
  formData: FormData,
): Promise<CarFormState> {
  await requireAdmin();

  const existing = carId ? findCar(carId) : null;
  if (carId && !existing) return { error: "This car no longer exists." };

  const parsed = carSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const photos = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const photoError = validatePhotos(photos);
  if (photoError) return { error: photoError };

  // Only keep images that actually belong to this car.
  const keep = new Set(formData.getAll("keepImages").map(String));
  const keptImages = (existing?.images ?? []).filter((img) => keep.has(img));
  const removedImages = (existing?.images ?? []).filter((img) => !keep.has(img));

  if (keptImages.length + photos.length > MAX_PHOTOS) {
    return { error: `A car can have at most ${MAX_PHOTOS} photos.` };
  }

  const newImages = await savePhotos(photos);
  const car = { ...parsed.data, images: [...keptImages, ...newImages] };

  if (carId) {
    updateCar(carId, car);
  } else {
    insertCar(car);
  }
  await deletePhotos(removedImages);

  updateTag(CARS_TAG);
  redirect("/admin");
}

export async function removeCar(carId: number) {
  await requireAdmin();
  const car = findCar(carId);
  if (car) {
    deleteCar(carId);
    await deletePhotos(car.images);
    updateTag(CARS_TAG);
  }
  redirect("/admin");
}

// ---- Enquiries ----

export async function markEnquiry(enquiryId: number, handled: boolean) {
  await requireAdmin();
  setEnquiryHandled(enquiryId, handled);
  redirect("/admin/enquiries");
}
