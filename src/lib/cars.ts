import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { SQLInputValue } from "node:sqlite";
import { getDb } from "./db";
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
  images: string;
  featured: number;
  status: Car["status"];
  variant: string;
  auction_grade: string;
  chassis_number: string;
  engine_cc: number | null;
  mileage_genuine: number;
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
    images: JSON.parse(row.images) as string[],
    featured: row.featured === 1,
    status: row.status,
    variant: row.variant,
    auctionGrade: row.auction_grade,
    chassisNumber: row.chassis_number,
    engineCc: row.engine_cc,
    mileageGenuine: row.mileage_genuine === 1,
    location: row.location,
    priceDestination: row.price_destination,
    priceNote: row.price_note,
    createdAt: row.created_at,
  };
}

const ORDER_BY: Record<SortOption, string> = {
  newest: "created_at DESC, id DESC",
  "price-asc": "price ASC",
  "price-desc": "price DESC",
  "year-desc": "year DESC",
  "mileage-asc": "mileage ASC",
};

// ---- Public, cached reads (invalidated with updateTag(CARS_TAG)) ----

export async function searchCars(filters: CarFilters): Promise<Car[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CARS_TAG);

  const where: string[] = ["status != 'sold'"];
  const params: SQLInputValue[] = [];

  if (filters.q) {
    where.push(
      "(make LIKE ? OR model LIKE ? OR variant LIKE ? OR chassis_number LIKE ? OR description LIKE ?)",
    );
    const like = `%${filters.q}%`;
    params.push(like, like, like, like, like);
  }
  const equals = [
    ["make", filters.make],
    ["body_type", filters.bodyType],
    ["fuel_type", filters.fuelType],
    ["transmission", filters.transmission],
  ] as const;
  for (const [column, value] of equals) {
    if (value) {
      where.push(`${column} = ?`);
      params.push(value);
    }
  }
  const ranges = [
    ["price >= ?", filters.minPrice],
    ["price <= ?", filters.maxPrice],
    ["year >= ?", filters.minYear],
    ["year <= ?", filters.maxYear],
    ["mileage <= ?", filters.maxMileage],
  ] as const;
  for (const [clause, value] of ranges) {
    if (value !== undefined) {
      where.push(clause);
      params.push(value);
    }
  }

  const orderBy = ORDER_BY[filters.sort ?? "newest"];
  const rows = getDb()
    .prepare(`SELECT * FROM cars WHERE ${where.join(" AND ")} ORDER BY ${orderBy}`)
    .all(...params) as CarRow[];
  return rows.map(toCar);
}

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CARS_TAG);
  const rows = getDb()
    .prepare(
      "SELECT * FROM cars WHERE featured = 1 AND status != 'sold' ORDER BY created_at DESC, id DESC LIMIT ?",
    )
    .all(limit) as CarRow[];
  return rows.map(toCar);
}

export async function getCar(id: number): Promise<Car | null> {
  "use cache";
  cacheLife("max");
  cacheTag(CARS_TAG);
  const row = getDb().prepare("SELECT * FROM cars WHERE id = ?").get(id) as
    | CarRow
    | undefined;
  return row ? toCar(row) : null;
}

export async function getMakes(): Promise<string[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CARS_TAG);
  const rows = getDb()
    .prepare("SELECT DISTINCT make FROM cars WHERE status != 'sold' ORDER BY make")
    .all() as { make: string }[];
  return rows.map((r) => r.make);
}

// ---- Admin reads and writes (uncached) ----

export function listAllCars(): Car[] {
  const rows = getDb()
    .prepare("SELECT * FROM cars ORDER BY created_at DESC, id DESC")
    .all() as CarRow[];
  return rows.map(toCar);
}

export function findCar(id: number): Car | null {
  const row = getDb().prepare("SELECT * FROM cars WHERE id = ?").get(id) as
    | CarRow
    | undefined;
  return row ? toCar(row) : null;
}

function columns(car: CarInput): SQLInputValue[] {
  return [
    car.make,
    car.model,
    car.year,
    car.price,
    car.mileage,
    car.fuelType,
    car.transmission,
    car.bodyType,
    car.color,
    car.description,
    JSON.stringify(car.images),
    car.featured ? 1 : 0,
    car.status,
    car.variant,
    car.auctionGrade,
    car.chassisNumber,
    car.engineCc,
    car.mileageGenuine ? 1 : 0,
    car.location,
    car.priceDestination,
    car.priceNote,
  ];
}

export function insertCar(car: CarInput): number {
  const result = getDb()
    .prepare(
      `INSERT INTO cars (make, model, year, price, mileage, fuel_type, transmission, body_type, color, description, images, featured, status,
         variant, auction_grade, chassis_number, engine_cc, mileage_genuine, location, price_destination, price_note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(...columns(car));
  return Number(result.lastInsertRowid);
}

export function updateCar(id: number, car: CarInput) {
  getDb()
    .prepare(
      `UPDATE cars SET make = ?, model = ?, year = ?, price = ?, mileage = ?, fuel_type = ?, transmission = ?,
       body_type = ?, color = ?, description = ?, images = ?, featured = ?, status = ?,
       variant = ?, auction_grade = ?, chassis_number = ?, engine_cc = ?, mileage_genuine = ?, location = ?,
       price_destination = ?, price_note = ? WHERE id = ?`,
    )
    .run(...columns(car), id);
}

export function deleteCar(id: number) {
  getDb().prepare("DELETE FROM cars WHERE id = ?").run(id);
}
