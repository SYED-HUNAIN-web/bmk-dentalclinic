import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/admin/reset-password";
  const errorParam = requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error");

  // Fallback origin
  const origin = requestUrl.origin;

  if (errorParam) {
    const errorRedirect = new URL("/admin/forgot-password", origin);
    errorRedirect.searchParams.set("error", errorParam);
    return NextResponse.redirect(errorRedirect);
  }

  if (code) {
    const { url, anonKey, isConfigured } = getSupabaseEnv();

    if (isConfigured) {
      const response = NextResponse.redirect(new URL(next, origin));

      const supabase = createServerClient(url, anonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: "", ...options, maxAge: 0 });
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Clear any leftover departed flags so the administrator can access the reset page
        response.cookies.delete("bmk_admin_departed");
        return response;
      }

      console.error("[Auth Callback Error]: Failed to exchange recovery code:", error.message);
    }
  }

  // If code exchange fails or no code is provided, redirect safely to forgot password
  const failRedirect = new URL("/admin/forgot-password", origin);
  failRedirect.searchParams.set(
    "error",
    "Invalid or expired recovery link. Please enter your email to request a new code or link."
  );
  return NextResponse.redirect(failRedirect);
}
