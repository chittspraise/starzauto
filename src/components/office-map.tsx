import { OFFICE_MAP_EMBED_URL, SITE_NAME } from "@/lib/site";

/** Google map with a pin on the office. */
export function OfficeMap({ className = "" }: { className?: string }) {
  return (
    <iframe
      src={OFFICE_MAP_EMBED_URL}
      title={`Map showing the ${SITE_NAME} office`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className={`block aspect-[4/3] min-h-64 w-full rounded-xl border border-neutral-200 bg-neutral-100 ${className}`}
    />
  );
}
