-- Starz Auto: initial database schema for Supabase (Postgres).
--
-- Run once in the Supabase dashboard → SQL Editor, or with `supabase db push`.
--
-- Access model:
--   * The public website (anon key) can read cars and submit enquiries — nothing else.
--   * The admin area runs on the server with the service_role key, which bypasses
--     Row Level Security, so it can add/edit/delete cars and read enquiries.
--     Never expose the service_role key to the browser.

-- ---------------------------------------------------------------------------
-- Cars
-- ---------------------------------------------------------------------------

create table public.cars (
  id                bigint generated always as identity primary key,

  -- Required basics
  make              text        not null check (char_length(make) between 1 and 60),
  model             text        not null check (char_length(model) between 1 and 60),
  year              integer     not null check (year between 1950 and 2100),
  price             integer     not null check (price >= 0),
  mileage           integer     not null check (mileage >= 0),
  fuel_type         text        not null check (fuel_type in ('Petrol', 'Diesel', 'Hybrid', 'Electric')),
  transmission      text        not null check (transmission in ('Automatic', 'Manual')),
  body_type         text        not null check (body_type in
                      ('Sedan', 'Hatchback', 'SUV', 'Pickup', 'Coupe', 'Convertible', 'Van', 'Wagon')),
  color             text        not null default '' check (char_length(color) <= 40),
  description       text        not null default '' check (char_length(description) <= 5000),

  -- Optional import/listing details (empty string / null / false when not given)
  variant           text        not null default '' check (char_length(variant) <= 60),          -- e.g. 'XD Proactive'
  auction_grade     text        not null default '' check (char_length(auction_grade) <= 10),    -- e.g. '4'
  chassis_number    text        not null default '' check (char_length(chassis_number) <= 40),   -- e.g. 'CZ0609117'
  engine_cc         integer              check (engine_cc between 0 and 20000),                  -- e.g. 2180
  mileage_genuine   boolean     not null default false,
  location          text        not null default '' check (char_length(location) <= 60),         -- e.g. 'Japan'
  price_destination text        not null default '' check (char_length(price_destination) <= 60),-- e.g. 'Beitbridge'
  price_note        text        not null default '' check (char_length(price_note) <= 200),

  -- Photos: object paths in the 'car-photos' storage bucket. First one is the cover.
  images            text[]      not null default '{}' check (cardinality(images) <= 12),

  featured          boolean     not null default false,
  status            text        not null default 'available' check (status in ('available', 'reserved', 'sold')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.cars is 'Vehicles listed for sale.';
comment on column public.cars.images is 'Paths inside the car-photos storage bucket; first is the cover photo.';
comment on column public.cars.price_destination is 'Place the price is delivered to, shown as "$9,635 to Beitbridge".';

-- Listing pages filter out sold cars and sort by these columns.
create index cars_status_created_idx on public.cars (status, created_at desc);
create index cars_featured_idx       on public.cars (created_at desc) where featured and status <> 'sold';
create index cars_make_idx           on public.cars (make);
create index cars_price_idx          on public.cars (price);
create index cars_year_idx           on public.cars (year);
create index cars_chassis_idx        on public.cars (chassis_number) where chassis_number <> '';

-- Keep updated_at current.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cars_set_updated_at
before update on public.cars
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Enquiries (contact form + "interested in this car" form)
-- ---------------------------------------------------------------------------

create table public.enquiries (
  id          bigint generated always as identity primary key,
  car_id      bigint      references public.cars (id) on delete set null,
  car_title   text        check (char_length(car_title) <= 200),  -- snapshot, survives car deletion
  name        text        not null check (char_length(name) between 1 and 100),
  email       text        not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone       text        not null default '' check (char_length(phone) <= 40),
  message     text        not null check (char_length(message) between 1 and 5000),
  test_drive  boolean     not null default false,
  handled     boolean     not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.enquiries is 'Messages from website visitors. Readable only by the admin (service_role).';

create index enquiries_handled_created_idx on public.enquiries (handled, created_at desc);
create index enquiries_car_id_idx          on public.enquiries (car_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.cars      enable row level security;
alter table public.enquiries enable row level security;

-- Anyone may browse cars (sold cars stay viewable on their own page; the
-- listing pages filter them out in the query).
create policy "Cars are publicly readable"
  on public.cars for select
  to anon, authenticated
  using (true);

-- Anyone may send an enquiry, but cannot pre-mark it handled or read any back.
create policy "Anyone can submit an enquiry"
  on public.enquiries for insert
  to anon, authenticated
  with check (handled = false);

-- No other policies: updates/deletes on cars and all reads of enquiries are
-- only possible with the service_role key (admin, server-side).

-- Tighten table privileges to match the policies above.
revoke all on public.cars      from anon, authenticated;
revoke all on public.enquiries from anon, authenticated;
grant select on public.cars to anon, authenticated;
grant insert (car_id, car_title, name, email, phone, message, test_drive)
  on public.enquiries to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: car photos
-- ---------------------------------------------------------------------------

-- Public bucket: photos are viewable by URL. Uploads/deletes only via the
-- service_role key (no insert/update/delete policies for anon).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('car-photos', 'car-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
