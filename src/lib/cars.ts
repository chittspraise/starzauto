import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { adminClient, check, publicClient } from "./supabase";
import type { Car, CarFilters, CarInput, SortOption } from "./types";

export const CARS_TAG = "cars";

type CarRow = {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: Car["fuelType"];
  transmission: Car["transmission"];
  body_type: Car["bodyType"];
  color: string;
  description: string;
  images: string[];
  featured: boolean;
  status: Car["status"];
  variant: string;
  auction_grade: string;
  chassis_number: string;
  engine_cc: number | null;
  mileage_genuine: boolean;
  location: string;
  price_destination: string;
  price_note: string;
  created_at: string;
};

function toCar(row: CarRow): Car {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    price: row.price,
    mileage: row.mileage,
    fuelType: row.fuel_type,
    transmission: row.transmission,
    bodyType: row.body_type,
    color: row.color,
    description: row.description,
    images: row.images,
    featured: row.featured,
    status: row.status,
    variant: row.variant,
    auctionGrade: row.auction_grade,
    chassisNumber: row.chassis_number,
    engineCc: row.engine_cc,
    mileageGenuine: row.mileage_genuine,
    location: row.location,
    priceDestination: row.price_destination,
    priceNote: row.price_note,
    createdAt: row.created_at,
  };
}

function toRow(car: CarInput): Omit<CarRow, "id" | "created_at"> {
  return {
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    fuel_type: car.fuelType,
    transmission: car.transmission,
    body_type: car.bodyType,
    color: car.color,
    description: car.description,
    images: car.images,
    featured: car.featured,
    status: car.status,
    variant: car.variant,
    auction_grade: car.auctionGrade,
    chassis_number: car.chassisNumber,
    engine_cc: car.engineCc,
    mileage_genuine: car.mileageGenuine,
    location: car.location,
    price_destination: car.priceDestination,
    price_note: car.priceNote,
  };
}

const ORDER_BY: Record<SortOption, [column: string, ascending: boolean][]> = {
  newest: [["created_at", false], ["id", false]],
  "price-asc": [["price", true]],
  "price-desc": [["price", false]],
  "year-desc": [["year", false]],
  "mileage-asc": [["mileage", true]],
};

/** Keeps search text safe to embed in a PostgREST `or` filter. */
function searchTerm(q: string) {
  return q.replace(/[^\p{L}\p{N}\s.\-/]/gu, " ").trim().replace(/\s+/g, " ");
}

// ---- Public, cached reads (invalidated with updateTag(CARS_TAG)) ----

export async function searchCars(filters: CarFilters): Promise<Car[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CARS_TAG);

  let query = publicClient().from("cars").select("*").neq("status", "sold");

  const q = filters.q ? searchTerm(filters.q) : "";
  if (q) {
    const like = `"%${q}%"`;
    query = query.or(
      ["make", "model", "variant", "chassis_number", "description"]
        .map((column) => `${column}.ilike.${like}`)
        .join(","),
    );
  }
  if (filters.make) query = query.eq("make", filters.make);
  if (filters.bodyType) query = query.eq("body_type", filters.bodyType);
  if (filters.fuelType) query = query.eq("fuel_type", filters.fuelType);
  if (filters.transmission) query = query.eq("transmission", filters.transmission);
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.minYear !== undefined) query = query.gte("year", filters.minYear);
  if (filters.maxYear !== undefined) query = query.lte("year", filters.maxYear);
  if (filters.maxMileage !== undefined) query = query.lte("mileage", filters.maxMileage);

  for (const [column, ascending] of ORDER_BY[filters.sort ?? "newest"]) {
    query = query.order(column, { ascending });
  }
  return (check(await query) as CarRow[]).map(toCar);
}

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CARS_TAG);
  const rows = check(
    await publicClient()
      .from("cars")
      .select("*")
      .eq("featured", true)
      .neq("status", "sold")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit),
  ) as CarRow[];
  return rows.map(toCar);
}

export async function getCar(id: number): Promise<Car | null> {
  "use cache";
  cacheLife("max");
  cacheTag(CARS_TAG);
  const row = check(
    await publicClient().from("cars").select("*").eq("id", id).maybeSingle(),
  ) as CarRow | null;
  return row ? toCar(row) : null;
}

export async function getMakes(): Promise<string[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CARS_TAG);
  const rows = check(
    await publicClient().from("cars").select("make").neq("status", "sold").order("make"),
  ) as { make: string }[];
  return [...new Set(rows.map((r) => r.make))];
}

// ---- Admin reads and writes (uncached, service role) ----

export async function listAllCars(): Promise<Car[]> {
  const rows = check(
    await adminClient()
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ) as CarRow[];
  return rows.map(toCar);
}

export async function findCar(id: number): Promise<Car | null> {
  const row = check(
    await adminClient().from("cars").select("*").eq("id", id).maybeSingle(),
  ) as CarRow | null;
  return row ? toCar(row) : null;
}

export async function insertCar(car: CarInput): Promise<number> {
  const row = check(
    await adminClient().from("cars").insert(toRow(car)).select("id").single(),
  ) as { id: number };
  return row.id;
}

export async function updateCar(id: number, car: CarInput) {
  check(await adminClient().from("cars").update(toRow(car)).eq("id", id));
}

export async function deleteCar(id: number) {
  check(await adminClient().from("cars").delete().eq("id", id));
}
