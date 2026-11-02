import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { CarGrid, CarGridSkeleton } from "@/components/car-card";
import { getMakes, searchCars } from "@/lib/cars";
import { parseFilters } from "@/lib/filters";
import {
  BODY_TYPES,
  FUEL_TYPES,
  SORT_OPTIONS,
  TRANSMISSIONS,
  type CarFilters,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "Browse cars",
};

export default function CarsPage(props: PageProps<"/cars">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Browse our cars</h1>
      <Suspense fallback={<CarGridSkeleton />}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: Pick<PageProps<"/cars">, "searchParams">) {
  const filters = parseFilters(await searchParams);
  const [cars, makes] = await Promise.all([searchCars(filters), getMakes()]);

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* key resets the uncontrolled inputs when the URL changes */}
      <FilterForm key={JSON.stringify(filters)} filters={filters} makes={makes} />
      <div>
        <p className="mb-4 text-sm text-neutral-600">
          {cars.length} {cars.length === 1 ? "car" : "cars"} found
        </p>
        {cars.length > 0 ? (
          <CarGrid cars={cars} />
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center">
            <p className="font-medium">No cars match your search.</p>
            <Link href="/cars" className="mt-2 inline-block text-sm text-red-600 hover:underline">
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Select({
  name,
  label,
  value,
  options,
}: {
  name: keyof CarFilters;
  label: string;
  value?: string;
  options: readonly string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <select id={name} name={name} defaultValue={value ?? ""} className="input">
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function NumberInput({
  name,
  placeholder,
  value,
  step,
}: {
  name: keyof CarFilters;
  placeholder: string;
  value?: number;
  step?: number;
}) {
  return (
    <input
      name={name}
      type="number"
      min={0}
      step={step}
      placeholder={placeholder}
      defaultValue={value}
      aria-label={placeholder}
      className="input"
    />
  );
}

function FilterForm({ filters, makes }: { filters: CarFilters; makes: string[] }) {
  return (
    <Form action="/cars" className="flex flex-col gap-4 self-start rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div>
        <label htmlFor="q" className="label">
          Search
        </label>
        <input id="q" name="q" defaultValue={filters.q} placeholder="e.g. Corolla" className="input" />
      </div>
      <Select name="make" label="Make" value={filters.make} options={makes} />
      <Select name="bodyType" label="Body type" value={filters.bodyType} options={BODY_TYPES} />
      <Select name="fuelType" label="Fuel" value={filters.fuelType} options={FUEL_TYPES} />
      <Select
        name="transmission"
        label="Transmission"
        value={filters.transmission}
        options={TRANSMISSIONS}
      />
      <fieldset>
        <legend className="label">Price</legend>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput name="minPrice" placeholder="Min" value={filters.minPrice} step={500} />
          <NumberInput name="maxPrice" placeholder="Max" value={filters.maxPrice} step={500} />
        </div>
      </fieldset>
      <fieldset>
        <legend className="label">Year</legend>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput name="minYear" placeholder="From" value={filters.minYear} />
          <NumberInput name="maxYear" placeholder="To" value={filters.maxYear} />
        </div>
      </fieldset>
      <div>
        <label htmlFor="maxMileage" className="label">
          Max mileage
        </label>
        <input
          id="maxMileage"
          name="maxMileage"
          type="number"
          min={0}
          step={5000}
          defaultValue={filters.maxMileage}
          className="input"
        />
      </div>
      <div>
        <label htmlFor="sort" className="label">
          Sort by
        </label>
        <select id="sort" name="sort" defaultValue={filters.sort ?? "newest"} className="input">
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button className="btn flex-1">Apply</button>
        <Link href="/cars" className="btn-secondary">
          Reset
        </Link>
      </div>
    </Form>
  );
}
