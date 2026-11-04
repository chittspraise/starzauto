import { PHONE_DISPLAY, PHONE_LINK } from "@/lib/site";

/** Tap-to-call button for direct phone calls. */
export function CallButton() {
  return (
    <a
      href={PHONE_LINK}
      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-neutral-900 px-4 py-2 font-semibold text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
      </svg>
      Call {PHONE_DISPLAY}
    </a>
  );
}
