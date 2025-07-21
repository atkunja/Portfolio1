// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

// use the service key on the server (API routes, SSR), anon key in the browser
const key =
  typeof window === "undefined" ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, key);
