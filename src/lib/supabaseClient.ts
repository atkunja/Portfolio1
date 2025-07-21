// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY       = process.env.SUPABASE_SERVICE_KEY!;

// Browser‑safe, public (anon) client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server‑only, secret (service_role) client for your API routes
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
