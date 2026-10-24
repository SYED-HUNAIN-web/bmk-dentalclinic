/**
 * Safe Environment Variable Accessor
 * Validates Supabase configuration without exposing raw secret values to logs or client bundles.
 */

export function getSupabaseEnv() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  // Normalize Supabase URL by removing trailing '/rest/v1' and trailing slashes if present
  const url = rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "") : "";

  // Support both legacy 'ANON_KEY' and modern 'PUBLISHABLE_KEY' naming conventions
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes("your-project-id") &&
    !anonKey.includes("your-anon-key-here") &&
    !anonKey.includes("your-publishable-key-here") &&
    !anonKey.includes("sb_publishable_your_key_here")
  );

  return {
    url,
    anonKey: anonKey || "",
    isConfigured,
  };
}

export function getSupabaseAdminEnv() {
  const { url, isConfigured: hasPublicConfig } = getSupabaseEnv();
  // Support both legacy 'SERVICE_ROLE_KEY' and modern 'SECRET_KEY' naming conventions (server-only)
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  const hasAdminConfig = Boolean(
    hasPublicConfig &&
    serviceRoleKey &&
    !serviceRoleKey.includes("your-service-role-key-here") &&
    !serviceRoleKey.includes("your-secret-key-here") &&
    !serviceRoleKey.includes("sb_secret_your_key_here")
  );

  return {
    url,
    serviceRoleKey: serviceRoleKey || "",
    isConfigured: hasAdminConfig,
  };
}
