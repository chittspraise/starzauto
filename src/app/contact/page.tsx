import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { OfficeMap } from "@/components/office-map";
import { CallButton } from "@/components/call-button";
import {
  EMAIL,
  OFFICE_ADDRESS,
  OFFICE_MAP_URL,
  PHONE_DISPLAY,
  PHONE_LINK,
  SITE_NAME,
  TRADING_HOURS,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">Contact {SITE_NAME}</h1>
        <p className="mt-3 text-neutral-600">
          Looking for a particular car, want to sell your car, or have a question about financing?
          Send us a message and we&apos;ll get back to you.
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="font-semibold">Phone</dt>
            <dd>
              <a href={PHONE_LINK} className="text-neutral-600 hover:text-red-600">
                {PHONE_DISPLAY}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Email</dt>
            <dd>
              <a href={`mailto:${EMAIL}`} className="text-neutral-600 hover:text-red-600">
                {EMAIL}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Office</dt>
            <dd className="text-neutral-600">
              {OFFICE_ADDRESS}
              <br />
              <a
                href={OFFICE_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-red-600 hover:underline"
              >
                Get directions ↗
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Trading hours</dt>
            <dd className="text-neutral-600">
              <table>
                <tbody>
                  {TRADING_HOURS.map(([days, hours]) => (
                    <tr key={days}>
                      <td className="pr-4">{days}</td>
                      <td>{hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Sell or trade in</dt>
            <dd className="text-neutral-600">
              Get a free valuation – we buy outright or trade in against anything on our floor.
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex max-w-xs flex-col gap-3">
          <WhatsAppButton message={`Hi ${SITE_NAME}, I have a question.`} />
          <CallButton />
        </div>
        <OfficeMap className="mt-6" />
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <EnquiryForm />
      </div>
    </div>
  );
}
