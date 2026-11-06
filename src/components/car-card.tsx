import Link from "next/link";
import { carTitle, formatEngine, formatMileage, formatPrice } from "@/lib/format";
import type { Car } from "@/lib/types";
import { CarImage } from "./car-image";
import { StatusBadge } from "./status-badge";

export function CarCard({ car }: { car: Car }) {
  const title = carTitle(car);
  // On phones (two cards per row) only the first three chips are shown.
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
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
        {car.status !== "available" && (
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
            <StatusBadge status={car.status} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2.5 sm:gap-3 sm:p-4">
        <div>
          <h3 className="text-sm leading-snug font-semibold text-neutral-900 group-hover:text-red-600 sm:text-base">
            {title}
          </h3>
          <p className="text-xs text-neutral-500 sm:text-sm">
            {[car.bodyType, car.color].filter(Boolean).join(" · ")}
          </p>
        </div>
        <ul className="flex flex-wrap gap-1 text-[11px] text-neutral-600 sm:gap-2 sm:text-xs">
          {chips.map((chip, i) => (
            <li
              key={chip}
              className={`rounded-full bg-neutral-100 px-2 py-0.5 sm:px-2.5 sm:py-1 ${i >= 3 ? "hidden sm:block" : ""}`}
            >
              {chip}
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <p className="text-base font-bold text-neutral-900 sm:text-xl">
            {formatPrice(car.price)}
            {car.priceDestination && (
              <span className="block text-xs font-medium text-neutral-500 sm:inline sm:text-sm"> to {car.priceDestination}</span>
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
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}

export function CarGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-xl bg-neutral-200 sm:h-80" />
      ))}
    </div>
  );
}
