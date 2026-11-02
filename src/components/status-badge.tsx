import type { CarStatus } from "@/lib/types";

const STYLES: Record<CarStatus, string> = {
  available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-red-100 text-red-800",
  sold: "bg-neutral-800 text-white",
};

export function StatusBadge({ status }: { status: CarStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
