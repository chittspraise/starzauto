import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { listEnquiries } from "@/lib/enquiries";
import { markEnquiry } from "../../actions";

export default function EnquiriesPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Enquiries</h1>
      <Suspense fallback={<p className="text-neutral-500">Loading…</p>}>
        <EnquiryList />
      </Suspense>
    </>
  );
}

async function EnquiryList() {
  await requireAdmin();
  const enquiries = listEnquiries();

  if (enquiries.length === 0) {
    return <p className="text-neutral-500">No enquiries yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {enquiries.map((e) => (
        <li
          key={e.id}
          className={`rounded-xl border bg-white p-5 shadow-sm ${e.handled ? "border-neutral-200 opacity-60" : "border-red-300"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">
                {e.name}
                {e.testDrive && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                    Test drive
                  </span>
                )}
              </p>
              <p className="text-sm text-neutral-600">
                <a href={`mailto:${e.email}`} className="hover:underline">
                  {e.email}
                </a>
                {e.phone && (
                  <>
                    {" · "}
                    <a href={`tel:${e.phone}`} className="hover:underline">
                      {e.phone}
                    </a>
                  </>
                )}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {e.createdAt} UTC ·{" "}
                {e.carId ? (
                  <Link href={`/cars/${e.carId}`} className="hover:underline">
                    {e.carTitle}
                  </Link>
                ) : (
                  (e.carTitle ?? "General enquiry")
                )}
              </p>
            </div>
            <form action={markEnquiry.bind(null, e.id, !e.handled)}>
              <button className="btn-secondary">{e.handled ? "Reopen" : "Mark handled"}</button>
            </form>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-neutral-800">{e.message}</p>
        </li>
      ))}
    </ul>
  );
}
