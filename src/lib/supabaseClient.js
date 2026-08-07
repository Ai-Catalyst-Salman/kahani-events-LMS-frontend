// src/lib/supabaseClient.js
// -------------------------
// Creates the single Supabase client instance for the frontend.
// Uses the ANON key — the service role key MUST never be used here.
// Session persistence defaults to localStorage (Supabase SDK default).

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[Kahani] Missing Supabase env vars. Copy frontend/.env.example to frontend/.env and fill in your values."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
