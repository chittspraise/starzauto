import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const globalForDb = globalThis as unknown as { starzDb?: DatabaseSync };

function open() {
  mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "starzauto.db"));
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      price INTEGER NOT NULL,
      mileage INTEGER NOT NULL,
      fuel_type TEXT NOT NULL,
      transmission TEXT NOT NULL,
      body_type TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      images TEXT NOT NULL DEFAULT '[]',
      featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'available',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      car_id INTEGER REFERENCES cars(id) ON DELETE SET NULL,
      car_title TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      test_drive INTEGER NOT NULL DEFAULT 0,
      handled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  migrate(db);
  seed(db);
  return db;
}

// Optional listing details added after the first release. Added in place so
// existing databases keep their data.
const OPTIONAL_CAR_COLUMNS: [name: string, definition: string][] = [
  ["variant", "TEXT NOT NULL DEFAULT ''"],
  ["auction_grade", "TEXT NOT NULL DEFAULT ''"],
  ["chassis_number", "TEXT NOT NULL DEFAULT ''"],
  ["engine_cc", "INTEGER"],
  ["mileage_genuine", "INTEGER NOT NULL DEFAULT 0"],
  ["location", "TEXT NOT NULL DEFAULT ''"],
  ["price_destination", "TEXT NOT NULL DEFAULT ''"],
  ["price_note", "TEXT NOT NULL DEFAULT ''"],
];

function migrate(db: DatabaseSync) {
  const existing = new Set(
    (db.prepare("PRAGMA table_info(cars)").all() as { name: string }[]).map((c) => c.name),
  );
  for (const [name, definition] of OPTIONAL_CAR_COLUMNS) {
    if (!existing.has(name)) db.exec(`ALTER TABLE cars ADD COLUMN ${name} ${definition}`);
  }
}

// Sample stock so the site isn't empty on first run. Delete these from the admin.
function seed(db: DatabaseSync) {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM cars").get() as {
    count: number;
  };
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO cars (make, model, year, price, mileage, fuel_type, transmission, body_type, color, description, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const samples: [string, string, number, number, number, string, string, string, string, string, number][] = [
    ["Toyota", "Corolla", 2021, 18500, 42000, "Petrol", "Automatic", "Sedan", "White", "One owner, full service history. Reliable and economical daily driver.", 1],
    ["Honda", "CR-V", 2020, 24900, 58000, "Petrol", "Automatic", "SUV", "Silver", "Spacious family SUV with reversing camera and Apple CarPlay.", 1],
    ["Ford", "Ranger", 2019, 27500, 85000, "Diesel", "Manual", "Pickup", "Blue", "Double cab 4x4 with tow bar and canopy. Ready for work or adventure.", 1],
    ["Tesla", "Model 3", 2022, 33900, 21000, "Electric", "Automatic", "Sedan", "Black", "Long Range, autopilot, glass roof. Battery health excellent.", 0],
    ["Volkswagen", "Golf", 2018, 13900, 76000, "Petrol", "Manual", "Hatchback", "Red", "Fun and practical hatch, new tyres and recent service.", 0],
    ["Toyota", "Prius", 2019, 16800, 64000, "Hybrid", "Automatic", "Hatchback", "Grey", "Superb fuel economy. Ideal for city driving.", 0],
    ["BMW", "3 Series", 2020, 29900, 39000, "Petrol", "Automatic", "Sedan", "Black", "M Sport package, leather seats, navigation.", 1],
    ["Mercedes-Benz", "Sprinter", 2018, 31500, 120000, "Diesel", "Manual", "Van", "White", "High roof panel van, well maintained fleet vehicle.", 0],
  ];
  for (const row of samples) insert.run(...row);

  // Example of a listing that uses the optional details.
  db.prepare(`
    INSERT INTO cars (make, model, variant, year, price, mileage, mileage_genuine, fuel_type, transmission, body_type, color,
      engine_cc, auction_grade, chassis_number, location, price_destination, price_note, description, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Mazda", "CX-5", "XD Proactive", 2018, 9635, 117596, 1, "Diesel", "Automatic", "SUV", "Silver",
    2180, "4", "CZ0609117", "Japan", "Beitbridge", "inclusive of port clearance, inspection and delivery",
    "Clean Japanese import with auction grade 4 and genuine mileage.", 1,
  );
}

export function getDb() {
  globalForDb.starzDb ??= open();
  return globalForDb.starzDb;
}
