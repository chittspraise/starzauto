-- Optional example stock. Run after the schema migration (SQL Editor), or it
-- runs automatically with `supabase db reset` locally. Upload photos from the
-- admin afterwards — these rows start without images.

insert into public.cars
  (make, model, variant, year, price, mileage, mileage_genuine, fuel_type, transmission, body_type, color,
   engine_cc, auction_grade, chassis_number, location, price_destination, price_note, description, featured)
values
  ('Mazda', 'CX-5', 'XD Proactive', 2018, 9635, 117596, true, 'Diesel', 'Automatic', 'SUV', 'Silver',
   2180, '4', 'CZ0609117', 'Japan', 'Beitbridge', 'inclusive of port clearance, inspection and delivery',
   'Clean Japanese import with auction grade 4 and genuine mileage.', true),
  ('Toyota', 'Land Cruiser Prado', 'VX', 2024, 68500, 12400, true, 'Diesel', 'Automatic', 'SUV', 'White',
   2755, '', '', 'Dubai, UAE', 'Beitbridge', 'inclusive of port clearance, inspection and delivery',
   'New-generation Prado with black alloys, roof rails and side steps. Low mileage, like new.', true),
  ('Honda', 'Vezel', 'Hybrid Z', 2016, 11250, 68210, true, 'Hybrid', 'Automatic', 'SUV', 'Dark Green',
   1496, '4.5', 'RU3-1201457', 'Japan', 'Beitbridge', 'inclusive of port clearance, inspection and delivery',
   'Economical hybrid crossover in excellent condition. Push start, reverse camera.', false),
  ('Toyota', 'Vitz', 'F', 2017, 7450, 54880, true, 'Petrol', 'Automatic', 'Hatchback', 'Silver',
   1329, '4', 'NSP130-2261879', 'Durban, South Africa', 'Beitbridge', 'inclusive of port clearance, inspection and delivery',
   'Reliable, fuel-saving city car. Ideal first car or taxi.', false),
  ('Ford', 'Ranger', 'XLT Super Cab', 2023, 42900, 23500, false, 'Diesel', 'Automatic', 'Pickup', 'White',
   1996, '', '', 'Harare, Zimbabwe', '', '',
   'Next-gen Ranger XLT with sports bar, tow hitch and side steps. Available for viewing in Harare.', true);
