"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";

const initialState: EnquiryState = { ok: false };

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.length ? <p className="mt-1 text-xs text-red-600">{errors[0]}</p> : null;
}

export function EnquiryForm({ carId, defaultMessage }: { carId?: number; defaultMessage?: string }) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);

  if (state.ok) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900" role="status">
        <p className="font-semibold">Enquiry sent</p>
        <p className="mt-1 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {carId && <input type="hidden" name="carId" value={carId} />}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div>
        <label htmlFor="name" className="label">
          Name
        </label>
        <input id="name" name="name" required autoComplete="name" className="input" />
        <FieldError errors={state.errors?.name} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
          <FieldError errors={state.errors?.email} />
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Phone <span className="font-normal text-neutral-400">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="input" />
          <FieldError errors={state.errors?.phone} />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          defaultValue={defaultMessage}
          className="input"
        />
        <FieldError errors={state.errors?.message} />
      </div>
      {carId && (
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" name="testDrive" className="size-4 accent-red-600" />
          I&apos;d like to book a test drive
        </label>
      )}
      <button className="btn" disabled={pending}>
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
