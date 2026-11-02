"use server";

import { z } from "zod";
import { findCar } from "@/lib/cars";
import { insertEnquiry } from "@/lib/enquiries";
import { carTitle } from "@/lib/format";

export type EnquiryState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<"name" | "email" | "phone" | "message", string[]>>;
};

const schema = z.object({
  carId: z.preprocess((v) => (v ? v : undefined), z.coerce.number().int().positive().optional()),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email").max(200),
  phone: z.string().trim().max(40).default(""),
  message: z.string().trim().min(5, "Please write a short message").max(2000),
  testDrive: z.preprocess((v) => v === "on", z.boolean()),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0).optional(),
});

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const parsed = schema.safeParse({
    carId: formData.get("carId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    message: formData.get("message"),
    testDrive: formData.get("testDrive"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { ok: true, message: "Thanks! We'll be in touch soon." };
    }
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const { carId, name, email, phone, message, testDrive } = parsed.data;
  const car = carId ? findCar(carId) : null;
  insertEnquiry({
    carId: car?.id ?? null,
    carTitle: car ? carTitle(car) : null,
    name,
    email,
    phone,
    message,
    testDrive,
  });

  return { ok: true, message: "Thanks! We've received your enquiry and will be in touch soon." };
}
