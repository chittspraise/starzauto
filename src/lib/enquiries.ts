import "server-only";
import { adminClient, check, publicClient } from "./supabase";
import type { Enquiry } from "./types";

type EnquiryRow = {
  id: number;
  car_id: number | null;
  car_title: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  test_drive: boolean;
  handled: boolean;
  created_at: string;
};

/** Public: the anon key may only insert enquiries (see RLS policy). */
export async function insertEnquiry(enquiry: Omit<Enquiry, "id" | "createdAt" | "handled">) {
  check(
    await publicClient().from("enquiries").insert({
      car_id: enquiry.carId,
      car_title: enquiry.carTitle,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      message: enquiry.message,
      test_drive: enquiry.testDrive,
    }),
  );
}

// ---- Admin only (service role) ----

export async function listEnquiries(): Promise<Enquiry[]> {
  const rows = check(
    await adminClient()
      .from("enquiries")
      .select("*")
      .order("handled", { ascending: true })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ) as EnquiryRow[];
  return rows.map((row) => ({
    id: row.id,
    carId: row.car_id,
    carTitle: row.car_title,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    testDrive: row.test_drive,
    handled: row.handled,
    createdAt: row.created_at,
  }));
}

export async function countOpenEnquiries(): Promise<number> {
  const { count, error } = await adminClient()
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("handled", false);
  if (error) throw new Error(`Supabase: ${error.message}`);
  return count ?? 0;
}

export async function setEnquiryHandled(id: number, handled: boolean) {
  check(await adminClient().from("enquiries").update({ handled }).eq("id", id));
}
