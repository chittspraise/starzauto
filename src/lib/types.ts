export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"] as const;
export const TRANSMISSIONS = ["Automatic", "Manual"] as const;
export const BODY_TYPES = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Pickup",
  "Coupe",
  "Convertible",
  "Van",
  "Wagon",
] as const;
export const CAR_STATUSES = ["available", "reserved", "sold"] as const;

export type FuelType = (typeof FUEL_TYPES)[number];
export type Transmission = (typeof TRANSMISSIONS)[number];
export type BodyType = (typeof BODY_TYPES)[number];
export type CarStatus = (typeof CAR_STATUSES)[number];

export type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  bodyType: BodyType;
  color: string;
  description: string;
  images: string[];
  // Optional listing details (empty string / null / false when not given).
  variant: string; // trim, e.g. "XD Proactive"
  auctionGrade: string; // e.g. "4"
  chassisNumber: string; // e.g. "CZ0609117"
  engineCc: number | null; // e.g. 2180
  mileageGenuine: boolean; // mileage verified as genuine
  location: string; // where the car currently is, e.g. "Japan"
  priceDestination: string; // price is delivered to, e.g. "Beitbridge"
  priceNote: string; // e.g. "inclusive of port clearance, inspection and delivery"

  featured: boolean;
  status: CarStatus;
  createdAt: string;
};

export type CarInput = Omit<Car, "id" | "createdAt">;

export const SORT_OPTIONS = {
  newest: "Newest listings",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "year-desc": "Year: newest first",
  "mileage-asc": "Mileage: lowest first",
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;

export type CarFilters = {
  q?: string;
  make?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  sort?: SortOption;
};

export type Enquiry = {
  id: number;
  carId: number | null;
  carTitle: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  testDrive: boolean;
  createdAt: string;
  handled: boolean;
};
