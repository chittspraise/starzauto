import Link from "next/link";
import { Suspense } from "react";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { listAllCars } from "@/lib/cars";
import { countOpenEnquiries } from "@/lib/enquiries";
import { carTitle, formatMileage, formatPrice } from "@/lib/format";
import { removeCar } from "../actions";
import { DeleteButton } from "./delete-button";

export default function AdminCarsPage() {
  return (
    <Suspense fallback={<p className="text-neutral-500">Loading…</p>}>
      <CarsTable />
    </Suspense>
  );
}

async function CarsTable() {
  await requireAdmin();
  const cars = listAllCars();
  const openEnquiries = countOpenEnquiries();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Your cars</h1>
          <p className="text-sm text-neutral-600">
            {cars.length} listed ·{" "}
            <Link href="/admin/enquiries" className="text-red-600 hover:underline">
              {openEnquiries} open {openEnquiries === 1 ? "enquiry" : "enquiries"}
            </Link>
          </p>
        </div>
        <Link href="/admin/cars/new" className="btn">
          + Add car
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Car</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Mileage</th>
              <th className="px-4 py-3">Photos</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-4 py-3 font-medium">
                  <Link href={`/cars/${car.id}`} className="hover:text-red-600">
                    {carTitle(car)}
                  </Link>
                  {car.featured && <span className="ml-2 text-red-600" title="Featured">★</span>}
                </td>
                <td className="px-4 py-3">{formatPrice(car.price)}</td>
                <td className="px-4 py-3">{formatMileage(car.mileage)}</td>
                <td className="px-4 py-3">{car.images.length}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={car.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/cars/${car.id}/edit`} className="font-semibold text-red-600 hover:underline">
                      Edit
                    </Link>
                    <DeleteButton action={removeCar.bind(null, car.id)} label={carTitle(car)} />
                  </div>
                </td>
              </tr>
            ))}
            {cars.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No cars yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
