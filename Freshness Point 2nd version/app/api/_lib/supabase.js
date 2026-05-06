import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./env.js";

let cachedClient;

export function getSupabaseAdminClient() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = requireEnv("SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}
