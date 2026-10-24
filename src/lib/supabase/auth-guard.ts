import { createServerSupabaseClient } from "./server";
import { getSupabaseEnv } from "./env";
import { cookies } from "next/headers";
import type { Database, AdminRole } from "@/types/database";

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
}

export type AuthGuardResult =
  | { status: "unconfigured"; message: string }
  | { status: "unauthenticated"; message: string }
  | { status: "unauthorized"; message: string; userEmail: string }
  | {
      status: "authenticated";
      user: { id: string; email: string };
      profile: AdminProfile;
    };

/**
 * Configurable administrative session idle timeout.
 * Defaults to 1800 seconds (30 minutes). Can be tuned via ADMIN_SESSION_TIMEOUT_SECONDS.
 */
export const ADMIN_SESSION_TIMEOUT_SECONDS =
  Number(process.env.ADMIN_SESSION_TIMEOUT_SECONDS) || 1800;

export const ADMIN_SESSION_COOKIE_NAME = "bmk_admin_last_active";

/**
 * Server-Side Admin Authentication & Authorization Guard
 * Never trusts client JWT claims or browser headers alone.
 * Enforces session inactivity timeout, validates Supabase Auth session,
 * and confirms active record in `public.admin_users`.
 */
export async function verifyAdminSession(): Promise<AuthGuardResult> {
  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return {
      status: "unconfigured",
      message:
        "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are not configured in .env.local.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      status: "unconfigured",
      message: "Unable to initialize server Supabase client.",
    };
  }

  // 1. Session Idle Policy & Departure Check: Enforce timeout or departure to public website
  const cookieStore = cookies();
  const departed = cookieStore.get("bmk_admin_departed")?.value;

  if (departed) {
    await supabase.auth.signOut();
    try {
      cookieStore.set("bmk_admin_departed", "", { maxAge: 0, path: "/" });
      cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
      cookieStore.set("bmk_admin_in_area", "", { maxAge: 0, path: "/" });
    } catch {
      // Ignored if called during component rendering
    }
    return {
      status: "unauthenticated",
      message:
        "For security, your session ended when you left the admin area. Please sign in again.",
    };
  }

  const lastActiveStr = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (lastActiveStr) {
    const lastActive = parseInt(lastActiveStr, 10);
    const now = Date.now();
    if (!isNaN(lastActive) && now - lastActive > ADMIN_SESSION_TIMEOUT_SECONDS * 1000) {
      await supabase.auth.signOut();
      try {
        cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
        cookieStore.set("bmk_admin_in_area", "", { maxAge: 0, path: "/" });
      } catch {
        // Ignored if called during component rendering
      }
      return {
        status: "unauthenticated",
        message:
          "Your administrative session has timed out due to departure or inactivity. Please sign in again.",
      };
    }
  }

  // 2. Validate user session via Supabase Auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      status: "unauthenticated",
      message: "No active authenticated session found. Please sign in.",
    };
  }

  // 2. Validate against public.admin_users table (Database RBAC)
  const { data: profile, error: profileError } = await (
    supabase.from("admin_users") as any
  )
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      status: "unauthorized",
      userEmail: user.email || "Unknown",
      message:
        "Authenticated user is not registered in the clinic admin roster (public.admin_users). Access denied.",
    };
  }

  if (!profile.is_active) {
    return {
      status: "unauthorized",
      userEmail: user.email || "Unknown",
      message: "This administrator account has been deactivated by the clinic director.",
    };
  }

  return {
    status: "authenticated",
    user: { id: user.id, email: user.email || profile.email },
    profile: profile as AdminProfile,
  };
}
