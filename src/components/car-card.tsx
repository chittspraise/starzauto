import Link from "next/link";
import { carTitle, formatEngine, formatMileage, formatPrice } from "@/lib/format";
import type { Car } from "@/lib/types";
import { CarImage } from "./car-image";
import { StatusBadge } from "./status-badge";

export function CarCard({ car }: { car: Car }) {
  const title = carTitle(car);
  const chips = [
    formatMileage(car.mileage, car.mileageGenuine),
    car.fuelType,
    car.transmission,
    car.engineCc ? formatEngine(car.engineCc) : null,
    car.auctionGrade ? `Grade ${car.auctionGrade}` : null,
    car.location ? `📍 ${car.location}` : null,
  ].filter((chip): chip is string => Boolean(chip));
  return (
    <Link
      href={`/cars/${car.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <CarImage
          image={car.images[0]}
          alt={title}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {car.status !== "available" && (
          <div className="absolute left-3 top-3">
            <StatusBadge status={car.status} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold text-neutral-900 group-hover:text-red-600">{title}</h3>
          <p className="text-sm text-neutral-500">
            {[car.bodyType, car.color].filter(Boolean).join(" · ")}
          </p>
        </div>
        <ul className="flex flex-wrap gap-2 text-xs text-neutral-600">
          {chips.map((chip) => (
            <li key={chip} className="rounded-full bg-neutral-100 px-2.5 py-1">
              {chip}
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <p className="text-xl font-bold text-neutral-900">
            {formatPrice(car.price)}
            {car.priceDestination && (
              <span className="text-sm font-medium text-neutral-500"> to {car.priceDestination}</span>
            )}
          </p>
          {car.priceNote && <p className="text-xs text-neutral-500">{car.priceNote}</p>}
        </div>
      </div>
    </Link>
  );
}

export function CarGrid({ cars }: { cars: Car[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}

export function CarGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-80 animate-pulse rounded-xl bg-neutral-200" />
      ))}
    </div>
  );
}
