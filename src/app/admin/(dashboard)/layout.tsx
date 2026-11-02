import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: "Dealer admin",
  robots: { index: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <nav className="flex gap-5 text-sm font-semibold">
          <Link href="/admin" className="hover:text-red-600">
            Cars
          </Link>
          <Link href="/admin/enquiries" className="hover:text-red-600">
            Enquiries
          </Link>
          <Link href="/" className="text-neutral-500 hover:text-neutral-900">
            View site ↗
          </Link>
        </nav>
        <form action={logout}>
          <button className="text-sm text-neutral-500 hover:text-neutral-900">Log out</button>
        </form>
      </div>
      {children}
    </div>
  );
}
