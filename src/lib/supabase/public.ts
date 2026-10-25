import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

let publicServerClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Creates or reuses a lightweight Supabase client for public read-only queries.
 * Safe for Server Components, Static Site Generation (SSG), and ISR.
 * CRITICAL: Does NOT call cookies() or headers(), allowing Next.js 14 to cache
 * public pages (Home, About, Services, Clinical Cases) globally on the Edge CDN.
 */
export function createPublicServerClient() {
  const { url, anonKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return null;
  }

  if (!publicServerClient) {
    publicServerClient = createSupabaseClient<Database>(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return publicServerClient;
}
