// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServer = process.env.SUPABASE_SERVICE_KEY!;

// client‐side, only anon key:
export const supabase = createClient(supabaseUrl, supabaseAnon);

// server‐side (in /api) with full privileges:
export const supabaseAdmin = createClient(supabaseUrl, supabaseServer);
