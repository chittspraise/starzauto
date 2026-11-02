"use client";

import Link from "next/link";
import { useActionState } from "react";
import { imageUrl } from "@/lib/format";
import {
  BODY_TYPES,
  CAR_STATUSES,
  FUEL_TYPES,
  TRANSMISSIONS,
  type Car,
} from "@/lib/types";
import { saveCar, type CarFormState } from "../actions";

type Props = { car?: Car };

export function CarForm({ car }: Props) {
  const [state, formAction, pending] = useActionState(
    saveCar.bind(null, car?.id ?? null),
    {} as CarFormState,
  );
  const errors = state.fieldErrors ?? {};

  const field = (name: keyof Car, label: string, input: React.ReactNode) => (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      {input}
      {errors[name]?.[0] && <p className="mt-1 text-xs text-red-600">{errors[name][0]}</p>}
    </div>
  );

  const select = (name: keyof Car, options: readonly string[], value?: string) => (
    <select id={name} name={name} defaultValue={value} className="input">
      {options.map((o) => (
        <option key={o} value={o}>
          {o.charAt(0).toUpperCase() + o.slice(1)}
        </option>
      ))}
    </select>
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        {field("make", "Make", <input id="make" name="make" required defaultValue={car?.make} className="input" placeholder="Toyota" />)}
        {field("model", "Model", <input id="model" name="model" required defaultValue={car?.model} className="input" placeholder="Corolla" />)}
        {field("year", "Year", <input id="year" name="year" type="number" required min={1950} defaultValue={car?.year} className="input" />)}
        {field("price", "Price", <input id="price" name="price" type="number" required min={0} step={1} defaultValue={car?.price} className="input" />)}
        {field("mileage", "Mileage", <input id="mileage" name="mileage" type="number" required min={0} defaultValue={car?.mileage} className="input" />)}
        {field("color", "Colour", <input id="color" name="color" defaultValue={car?.color} className="input" />)}
        {field("fuelType", "Fuel", select("fuelType", FUEL_TYPES, car?.fuelType))}
        {field("transmission", "Transmission", select("transmission", TRANSMISSIONS, car?.transmission))}
        {field("bodyType", "Body type", select("bodyType", BODY_TYPES, car?.bodyType))}
        {field("status", "Status", select("status", CAR_STATUSES, car?.status))}
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-neutral-700">
          <input type="checkbox" name="featured" defaultChecked={car?.featured} className="size-4 accent-red-600" />
          Feature on home page
        </label>
        <div className="sm:col-span-2 lg:col-span-3">
          {field(
            "description",
            "Description",
            <textarea id="description" name="description" rows={5} defaultValue={car?.description} className="input" />,
          )}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Extra details</h2>
        <p className="mb-4 text-xs text-neutral-500">Optional — leave blank and they won&apos;t be shown on the listing.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {field("variant", "Variant / trim", <input id="variant" name="variant" defaultValue={car?.variant} className="input" placeholder="XD Proactive" />)}
          {field("engineCc", "Engine size (cc)", <input id="engineCc" name="engineCc" type="number" min={0} defaultValue={car?.engineCc ?? ""} className="input" placeholder="2180" />)}
          {field("auctionGrade", "Auction grade", <input id="auctionGrade" name="auctionGrade" defaultValue={car?.auctionGrade} className="input" placeholder="4" />)}
          {field("chassisNumber", "Chassis number", <input id="chassisNumber" name="chassisNumber" defaultValue={car?.chassisNumber} className="input" placeholder="CZ0609117" />)}
          {field("location", "Location", <input id="location" name="location" defaultValue={car?.location} className="input" placeholder="Japan" />)}
          {field("priceDestination", "Price delivered to", <input id="priceDestination" name="priceDestination" defaultValue={car?.priceDestination} className="input" placeholder="Beitbridge" />)}
          <div className="sm:col-span-2">
            {field("priceNote", "Price note", <input id="priceNote" name="priceNote" defaultValue={car?.priceNote} className="input" placeholder="inclusive of port clearance, inspection and delivery" />)}
          </div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-neutral-700">
            <input type="checkbox" name="mileageGenuine" defaultChecked={car?.mileageGenuine} className="size-4 accent-red-600" />
            Mileage is genuine
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Photos</h2>
        {car && car.images.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {car.images.map((image) => (
              <label key={image} className="flex flex-col gap-1 text-xs text-neutral-600">
                {/* eslint-disable-next-line @next/next/no-img-element -- small admin thumbnails */}
                <img src={imageUrl(image)} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
                <span className="flex items-center gap-1">
                  <input type="checkbox" name="keepImages" value={image} defaultChecked className="accent-red-600" />
                  Keep
                </span>
              </label>
            ))}
          </div>
        )}
        <input
          type="file"
          name="photos"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="block text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:font-semibold"
        />
        <p className="mt-2 text-xs text-neutral-500">
          JPG, PNG or WebP, up to 5MB each. The first photo is used as the cover image.
        </p>
      </div>

      {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      <div className="flex gap-3">
        <button className="btn" disabled={pending}>
          {pending ? "Saving…" : car ? "Save changes" : "Add car"}
        </button>
        <Link href="/admin" className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
