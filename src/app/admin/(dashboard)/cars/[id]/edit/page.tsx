import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { findCar } from "@/lib/cars";
import { carTitle } from "@/lib/format";
import { CarForm } from "../../../car-form";

export default function EditCarPage(props: PageProps<"/admin/cars/[id]/edit">) {
  return (
    <Suspense fallback={<p className="text-neutral-500">Loading…</p>}>
      <EditCar params={props.params} />
    </Suspense>
  );
}

async function EditCar({ params }: Pick<PageProps<"/admin/cars/[id]/edit">, "params">) {
  await requireAdmin();
  const car = findCar(Number((await params).id));
  if (!car) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Edit {carTitle(car)}</h1>
      <CarForm car={car} />
    </>
  );
}
