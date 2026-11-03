# StarzAutoZW

Car-selling website built with Next.js 16, TypeScript, Tailwind CSS and Supabase (Postgres database + Storage for car photos).

## Features

- **Home page** with quick search and featured cars
- **Browse cars** (`/cars`) with search, filters (make, body, fuel, transmission, price, year, mileage) and sorting
- **Car detail pages** with photo gallery, specs and an enquiry / test-drive form
- **Optional import details** per car: variant, auction grade, chassis number, engine cc, genuine mileage, location, and a delivered-to price with a note (e.g. "$9,635 to Beitbridge, inclusive of port clearance…")
- **Contact page** for general enquiries
- **Dealer admin** (`/admin`): add, edit and delete cars, upload photos, mark cars reserved/sold/featured, and manage enquiries

## Getting started

1. Create a Supabase project, open **SQL Editor** and run
   `supabase/migrations/20261103000000_initial_schema.sql`
   (optionally followed by `supabase/seed.sql` for example cars).
2. Configure and run:

```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD, SESSION_SECRET and the Supabase keys
npm run dev                  # http://localhost:3000
```

Supabase keys are under Project Settings → API. `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security and is only used server-side by the admin — never expose it to the browser.

## Configuration

- Business name: `src/lib/site.ts`
- Currency, locale and distance unit: `src/lib/format.ts`
- Showroom address and hours: `src/app/contact/page.tsx`
- Fuel, body type and transmission options: `src/lib/types.ts` (keep in sync with the `check` constraints in the schema)

## WhatsApp

- `WHATSAPP_NUMBER` (country code, digits only) shows **Chat on WhatsApp** buttons on car pages and the contact page, with a pre-filled message naming the car.
- `CALLMEBOT_API_KEY` sends each website enquiry to that number as a WhatsApp message via [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/). To get a key, follow the activation steps on that page from the dealer's phone. Alerts are best-effort; enquiries are always saved in the admin.

## Data access

- The public site uses the **anon** key: Row Level Security only lets it read cars and insert enquiries.
- The admin uses the **service_role** key after checking the admin login cookie.
- Car photos live in the public `car-photos` storage bucket; `cars.images` stores their object paths (first is the cover).

## Deploying

All data is in Supabase, so the app can run on any Node host, including Vercel. Set the same environment variables there, and serve over HTTPS because the admin login cookie is marked secure in production.

## Project layout

```
src/
  app/            pages and Server Actions
    admin/        login + dashboard (cars, enquiries)
    cars/         listing and detail pages
  components/     shared UI (car cards, gallery, enquiry form)
  lib/            Supabase clients, queries, auth, uploads, formatting
supabase/
  migrations/     database schema
  seed.sql        optional example cars
```
