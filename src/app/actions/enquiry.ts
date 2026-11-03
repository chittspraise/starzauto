"use server";

import { after } from "next/server";
import { z } from "zod";
import { getCar } from "@/lib/cars";
import { insertEnquiry } from "@/lib/enquiries";
import { carTitle, formatPrice } from "@/lib/format";
import { SITE_NAME } from "@/lib/site";
import { notifyDealer, whatsappLink } from "@/lib/whatsapp";

export type EnquiryState = {
  ok: boolean;
  message?: string;
  whatsappUrl?: string;
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
  const car = carId ? await getCar(carId) : null;
  await insertEnquiry({
    carId: car?.id ?? null,
    carTitle: car ? carTitle(car) : null,
    name,
    email,
    phone,
    message,
    testDrive,
  });

  const details = [
    car ? `Car: ${carTitle(car)} (Ref #${car.id}) – ${formatPrice(car.price)}` : "General enquiry",
    `Name: ${name}`,
    phone ? `Phone: ${phone}` : false,
    `Email: ${email}`,
    testDrive && "Wants a test drive: yes",
    "",
    message,
  ]
    .filter((line) => line !== false)
    .join("\n");

  // Ping the dealer on WhatsApp after the visitor gets their response (if CallMeBot is set up).
  after(() => notifyDealer(`🚗 New ${SITE_NAME} enquiry\n${details}`));

  return {
    ok: true,
    message: "Thanks! We've received your enquiry and will be in touch soon.",
    // Lets the visitor send the same enquiry to the dealer's WhatsApp in one tap.
    whatsappUrl:
      whatsappLink(`Hi ${SITE_NAME}, I just sent an enquiry on your website:\n\n${details}`) ?? undefined,
  };
}
