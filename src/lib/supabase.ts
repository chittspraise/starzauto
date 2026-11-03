import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const PHOTO_BUCKET = "car-photos";

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be set (see .env.example).`);
  return value;
}

const options = { auth: { persistSession: false, autoRefreshToken: false } };

const globalForSupabase = globalThis as unknown as {
  supabasePublic?: SupabaseClient;
  supabaseAdmin?: SupabaseClient;
};

/** Anon key: limited by Row Level Security to reading cars and submitting enquiries. */
export function publicClient() {
  globalForSupabase.supabasePublic ??= createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    options,
  );
  return globalForSupabase.supabasePublic;
}

/** Service role key: bypasses RLS. Only call after requireAdmin(). */
export function adminClient() {
  globalForSupabase.supabaseAdmin ??= createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY"),
    options,
  );
  return globalForSupabase.supabaseAdmin;
}

/** Throws on a Supabase error so failures surface instead of rendering empty pages. */
export function check<T>({ data, error }: { data: T; error: { message: string } | null }): T {
  if (error) throw new Error(`Supabase: ${error.message}`);
  return data;
}
