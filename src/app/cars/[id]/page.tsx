import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/enquiry-form";
import { Gallery } from "@/components/gallery";
import { StatusBadge } from "@/components/status-badge";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CallButton } from "@/components/call-button";
import { getCar } from "@/lib/cars";
import { SITE_NAME } from "@/lib/site";
import { carTitle, formatEngine, formatMileage, formatPrice } from "@/lib/format";

async function loadCar(params: Promise<{ id: string }>) {
  const { id } = await params;
  const carId = Number(id);
  return Number.isInteger(carId) && carId > 0 ? getCar(carId) : null;
}

export async function generateMetadata(props: PageProps<"/cars/[id]">): Promise<Metadata> {
  const car = await loadCar(props.params);
  if (!car) return { title: "Car not found" };
  return {
    title: carTitle(car),
    description: `${carTitle(car)} for ${formatPrice(car.price)} — ${formatMileage(car.mileage)}, ${car.fuelType}, ${car.transmission}.`,
  };
}

export default function CarPage(props: PageProps<"/cars/[id]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/cars" className="text-sm text-neutral-600 hover:text-neutral-900">
        ← Back to all cars
      </Link>
      <Suspense fallback={<div className="mt-6 h-96 animate-pulse rounded-xl bg-neutral-200" />}>
        <CarDetails params={props.params} />
      </Suspense>
    </div>
  );
}

async function CarDetails({ params }: Pick<PageProps<"/cars/[id]">, "params">) {
  const car = await loadCar(params);
  if (!car) notFound();
  const title = carTitle(car);

  const allSpecs: [string, string | null][] = [
    ["Year", String(car.year)],
    ["Mileage", formatMileage(car.mileage, car.mileageGenuine)],
    ["Fuel", car.fuelType],
    ["Transmission", car.transmission],
    ["Engine", car.engineCc ? formatEngine(car.engineCc) : null],
    ["Body type", car.bodyType],
    ["Colour", car.color || "—"],
    ["Auction grade", car.auctionGrade || null],
    ["Chassis no.", car.chassisNumber || null],
    ["Location", car.location || null],
  ];
  const specs = allSpecs.filter((spec): spec is [string, string] => spec[1] !== null);

  return (
    <div className="mt-4 grid gap-8 lg:grid-cols-[3fr_2fr]">
      <div className="flex flex-col gap-6">
        <Gallery images={car.images} alt={title} />
        <section>
          <h2 className="mb-2 text-lg font-semibold">About this car</h2>
          <p className="whitespace-pre-line text-neutral-700">
            {car.description || "Contact us for more details about this car."}
          </p>
        </section>
      </div>

      <aside className="flex flex-col gap-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold">{title}</h1>
            <StatusBadge status={car.status} />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-neutral-900">
            {formatPrice(car.price)}
            {car.priceDestination && (
              <span className="text-base font-medium text-neutral-500"> to {car.priceDestination}</span>
            )}
          </p>
          {car.priceNote && <p className="mt-1 text-sm text-neutral-600">Price {car.priceNote}</p>}
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-neutral-500">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          {car.status === "sold" ? (
            <p className="text-neutral-700">
              This car has been sold.{" "}
              <Link href="/cars" className="font-semibold text-red-600 hover:underline">
                See similar cars
              </Link>
            </p>
          ) : (
            <>
              <h2 className="mb-4 text-lg font-semibold">Interested in this car?</h2>
              <div className="flex flex-col gap-3">
                <WhatsAppButton
                  message={`Hi ${SITE_NAME}, I'm interested in the ${title} (Ref #${car.id}) listed at ${formatPrice(car.price)}. Is it still available?`}
                />
                <CallButton />
              </div>
              <p className="my-4 text-center text-xs uppercase tracking-wide text-neutral-400">
                or send us a message
              </p>
              <EnquiryForm
                carId={car.id}
                defaultMessage={`Hi, I'm interested in the ${title}. Is it still available?`}
              />
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
