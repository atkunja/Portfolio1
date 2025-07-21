// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

// public/browser‐safe client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// server‐only client (bypass RLS)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  // disable session persistence
  auth: { persistSession: false, autoRefreshToken: false },
});
