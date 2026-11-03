import type { Car } from "./types";

// Change these to match your market.
export const CURRENCY = "USD";
export const LOCALE = "en-US";
export const DISTANCE_UNIT = "km";

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat(LOCALE);

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

export function formatMileage(value: number, genuine = false) {
  return `${numberFormatter.format(value)} ${DISTANCE_UNIT}${genuine ? " (Genuine)" : ""}`;
}

export function formatEngine(cc: number) {
  return `${numberFormatter.format(cc)}cc`;
}

export function carTitle(car: Pick<Car, "year" | "make" | "model"> & { variant?: string }) {
  return [car.year, car.make, car.model, car.variant].filter(Boolean).join(" ");
}

/** Public URL of a photo in the Supabase 'car-photos' storage bucket. */
export function imageUrl(name: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-photos/${encodeURIComponent(name)}`;
}
