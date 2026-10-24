import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or reuses a browser-side Supabase client.
 * Safe for client components; uses only the public anon key.
 */
export function createClient() {
  const { url, anonKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    // Return null or unconfigured dummy client in dev to prevent hard crashes before env setup
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(url, anonKey);
  }

  return browserClient;
}
