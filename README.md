# Starz Auto

Car-selling website built with Next.js 16, TypeScript, Tailwind CSS and SQLite (Node's built-in `node:sqlite`).

## Features

- **Home page** with quick search and featured cars
- **Browse cars** (`/cars`) with search, filters (make, body, fuel, transmission, price, year, mileage) and sorting
- **Car detail pages** with photo gallery, specs and an enquiry / test-drive form
- **Contact page** for general enquiries
- **Dealer admin** (`/admin`): add, edit and delete cars, upload photos, mark cars reserved/sold/featured, and manage enquiries

## Getting started

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and SESSION_SECRET
npm run dev                  # http://localhost:3000
```

The database (`data/starzauto.db`) and uploaded photos (`data/uploads/`) are created on first run, with a few sample cars you can delete from the admin.

## Configuration

- Currency, locale and distance unit: `src/lib/format.ts`
- Showroom address and hours: `src/app/contact/page.tsx`
- Fuel, body type and transmission options: `src/lib/types.ts`

## Deploying

Data is stored on the server's disk, so deploy to a host with a persistent disk (a VPS, Railway or Render with a volume, etc.), not a serverless platform like Vercel. Back up the `data/` folder. Serve the site over HTTPS, because the admin login cookie is marked secure in production.

## Project layout

```
src/
  app/            pages, Server Actions, /uploads route
    admin/        login + dashboard (cars, enquiries)
    cars/         listing and detail pages
  components/     shared UI (car cards, gallery, enquiry form)
  lib/            database, queries, auth, validation, formatting
```
