"use client";

import { useState } from "react";

/**
 * On phones the filter form is folded behind a button so the cars show first.
 * From the lg breakpoint up it is always visible as a sidebar.
 */
export function FilterToggle({
  activeCount,
  children,
}: {
  activeCount: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="self-start">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="btn-secondary w-full justify-between lg:hidden"
      >
        <span>
          Filters &amp; sort
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
              {activeCount}
            </span>
          )}
        </span>
        <span aria-hidden>{open ? "▲" : "▼"}</span>
      </button>
      <div className={`${open ? "mt-3 block" : "hidden"} lg:mt-0 lg:block`}>{children}</div>
    </div>
  );
}
