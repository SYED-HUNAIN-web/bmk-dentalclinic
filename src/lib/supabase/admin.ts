import "server-only";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { getSupabaseAdminEnv } from "./env";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Creates a server-only Supabase client with the service-role key.
 * Bypasses RLS for secure backend administrative tasks (e.g., triage notifications, audit logging).
 * CRITICAL: NEVER import this into client components or expose in browser code.
 */
export function createAdminClient() {
  const { url, serviceRoleKey, isConfigured } = getSupabaseAdminEnv();

  if (!isConfigured) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient<Database>(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}
