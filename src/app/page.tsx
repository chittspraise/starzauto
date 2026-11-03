import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { CarGrid } from "@/components/car-card";
import { getFeaturedCars, getMakes } from "@/lib/cars";
import { BODY_TYPES } from "@/lib/types";
import { SITE_NAME } from "@/lib/site";

export default async function HomePage() {
  const [featured, makes] = await Promise.all([getFeaturedCars(), getMakes()]);

  return (
    <>
      <section className="bg-black bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.25),transparent_60%)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h1 className="max-w-2xl text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
                Find your next car at <span className="text-red-600">{SITE_NAME}</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-neutral-300">
                Hand-picked, inspected used cars at honest prices. Browse our stock and book a test
                drive today.
              </p>
            </div>
            <Image
              src="/logo.jpg"
              alt=""
              width={720}
              height={698}
              priority
              className="hidden w-80 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.35)] md:block"
            />
          </div>

          <Form
            action="/cars"
            className="mt-8 grid gap-3 rounded-xl bg-white p-4 text-neutral-900 shadow-lg sm:grid-cols-4"
          >
            <select name="make" className="input" aria-label="Make" defaultValue="">
              <option value="">Any make</option>
              {makes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <select name="bodyType" className="input" aria-label="Body type" defaultValue="">
              <option value="">Any body type</option>
              {BODY_TYPES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <input
              name="maxPrice"
              type="number"
              min={0}
              step={500}
              placeholder="Max price"
              className="input"
              aria-label="Max price"
            />
            <button className="btn">Search cars</button>
          </Form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Featured cars</h2>
          <Link href="/cars" className="text-sm font-semibold text-red-600 hover:underline">
            View all stock →
          </Link>
        </div>
        {featured.length > 0 ? (
          <CarGrid cars={featured} />
        ) : (
          <p className="text-neutral-500">New stock arriving soon.</p>
        )}
      </section>

      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          {[
            ["Inspected & serviced", "Every car is checked by our mechanics before it goes on sale."],
            ["Transparent pricing", "No hidden fees. The price you see is the price you pay."],
            ["Test drives welcome", "Request a test drive online and we'll get back to you fast."],
          ].map(([title, text]) => (
            <div key={title}>
              <h3 className="font-semibold">
                <span className="text-red-600">★</span> {title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
