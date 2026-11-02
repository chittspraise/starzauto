import { z } from "zod";
import { SORT_OPTIONS, type CarFilters, type SortOption } from "./types";

type SearchParams = Record<string, string | string[] | undefined>;

const optionalNumber = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : v),
  z.coerce.number().int().nonnegative().optional().catch(undefined),
);
const optionalText = z.preprocess(
  (v) => (typeof v === "string" && v.trim() !== "" ? v.trim().slice(0, 100) : undefined),
  z.string().optional(),
);

const filterSchema = z.object({
  q: optionalText,
  make: optionalText,
  bodyType: optionalText,
  fuelType: optionalText,
  transmission: optionalText,
  minPrice: optionalNumber,
  maxPrice: optionalNumber,
  minYear: optionalNumber,
  maxYear: optionalNumber,
  maxMileage: optionalNumber,
  sort: z
    .string()
    .refine((s): s is SortOption => s in SORT_OPTIONS)
    .optional()
    .catch(undefined),
});

export function parseFilters(searchParams: SearchParams): CarFilters {
  const flat = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  const parsed = filterSchema.parse(flat);
  // Drop undefined keys so equivalent searches share a cache entry.
  return Object.fromEntries(
    Object.entries(parsed).filter(([, v]) => v !== undefined),
  ) as CarFilters;
}
