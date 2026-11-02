import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Starz Auto — Quality used cars",
    template: "%s | Starz Auto",
  },
  description: "Browse quality used cars at Starz Auto. Search by make, price, year and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-20 border-b-2 border-red-600 bg-black text-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
            <Link href="/" aria-label="Starz Auto home" className="flex shrink-0 items-center gap-3">
              <Image
                src="/logo.jpg"
                alt=""
                width={720}
                height={698}
                priority
                className="h-14 w-auto rounded"
              />
              <span className="hidden text-xl font-extrabold italic tracking-tight sm:inline">
                <span className="text-red-600">STARZ</span> AUTO
              </span>
            </Link>
            <div className="flex items-center gap-5 text-sm font-semibold uppercase tracking-wide">
              <Link href="/cars" className="hover:text-red-500">
                Browse cars
              </Link>
              <Link href="/contact" className="hover:text-red-500">
                Contact
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t-2 border-red-600 bg-black">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-neutral-400 sm:flex-row sm:justify-between">
            <p>© Starz Auto. Quality used cars.</p>
            <Link href="/admin" className="hover:text-white">
              Dealer login
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
