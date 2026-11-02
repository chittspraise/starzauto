import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { CarForm } from "../../car-form";

export default function NewCarPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Add a car</h1>
      <Suspense fallback={<p className="text-neutral-500">Loading…</p>}>
        <AuthorizedForm />
      </Suspense>
    </>
  );
}

async function AuthorizedForm() {
  await requireAdmin();
  return <CarForm />;
}
