import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Contact us",
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">Contact Starz Auto</h1>
        <p className="mt-3 text-neutral-600">
          Looking for a particular car, want to sell your car, or have a question about financing?
          Send us a message and we&apos;ll get back to you.
        </p>
        {/* Replace with your real dealership details */}
        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="font-semibold">Showroom</dt>
            <dd className="text-neutral-600">123 Main Road, Your City</dd>
          </div>
          <div>
            <dt className="font-semibold">Opening hours</dt>
            <dd className="text-neutral-600">Mon–Sat, 8:00 – 17:00</dd>
          </div>
        </dl>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <EnquiryForm />
      </div>
    </div>
  );
}
