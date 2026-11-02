import "server-only";
import { getDb } from "./db";
import type { Enquiry } from "./types";

type EnquiryRow = {
  id: number;
  car_id: number | null;
  car_title: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  test_drive: number;
  handled: number;
  created_at: string;
};

export function insertEnquiry(
  enquiry: Omit<Enquiry, "id" | "createdAt" | "handled">,
) {
  getDb()
    .prepare(
      `INSERT INTO enquiries (car_id, car_title, name, email, phone, message, test_drive)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      enquiry.carId,
      enquiry.carTitle,
      enquiry.name,
      enquiry.email,
      enquiry.phone,
      enquiry.message,
      enquiry.testDrive ? 1 : 0,
    );
}

export function listEnquiries(): Enquiry[] {
  const rows = getDb()
    .prepare("SELECT * FROM enquiries ORDER BY handled ASC, created_at DESC, id DESC")
    .all() as EnquiryRow[];
  return rows.map((row) => ({
    id: row.id,
    carId: row.car_id,
    carTitle: row.car_title,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    testDrive: row.test_drive === 1,
    handled: row.handled === 1,
    createdAt: row.created_at,
  }));
}

export function countOpenEnquiries(): number {
  const { count } = getDb()
    .prepare("SELECT COUNT(*) AS count FROM enquiries WHERE handled = 0")
    .get() as { count: number };
  return count;
}

export function setEnquiryHandled(id: number, handled: boolean) {
  getDb()
    .prepare("UPDATE enquiries SET handled = ? WHERE id = ?")
    .run(handled ? 1 : 0, id);
}
