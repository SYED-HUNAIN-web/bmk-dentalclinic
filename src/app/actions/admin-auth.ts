"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_TIMEOUT_SECONDS,
  verifyAdminSession,
} from "@/lib/supabase/auth-guard";

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  redirectTo?: string;
  error?: string;
}

/**
 * Server Action: Admin Sign-In
 * Verifies email/password with Supabase Auth, then confirms active record in admin_users.
 */
export async function adminSignInAction(formData: {
  email: string;
  password: string;
}): Promise<AdminAuthResponse> {
  const email = (formData.email || "").trim().toLowerCase();
  const password = formData.password || "";

  if (!email || !password) {
    return {
      success: false,
      message: "Please enter both an authorized email and password.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message:
        "Supabase credentials have not been configured in .env.local yet. Please complete database setup first.",
    };
  }

  // 1. Authenticate with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return {
      success: false,
      message: authError?.message || "Invalid administrative credentials.",
    };
  }

  // 2. Database RBAC Verification: Check active profile in public.admin_users
  const { data: profile, error: profileError } = await (
    supabase.from("admin_users") as any
  )
    .select("id, role, is_active")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || !profile || !profile.is_active) {
    // Revoke session immediately if not authorized
    await supabase.auth.signOut();
    return {
      success: false,
      message:
        "Access denied: This account is not registered as an active clinic staff member or administrator.",
    };
  }

  // 3. Initialize secure session activity timestamp and reset departure state
  const cookieStore = cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, String(Date.now()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TIMEOUT_SECONDS,
  });
  cookieStore.set("bmk_admin_in_area", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("bmk_admin_departed", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  revalidatePath("/admin");
  return {
    success: true,
    message: "Authentication successful. Accessing clinic dashboard...",
    redirectTo: "/admin",
  };
}

/**
 * Server Action: Admin Sign-Out
 */
export async function adminSignOutAction(): Promise<AdminAuthResponse> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  const cookieStore = cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  cookieStore.set("bmk_admin_in_area", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  cookieStore.set("bmk_admin_departed", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  revalidatePath("/admin");
  return {
    success: true,
    message: "Signed out successfully.",
    redirectTo: "/admin/login",
  };
}

/**
 * Server Action: Touch Session Activity (Heartbeat)
 */
export async function touchAdminSessionAction(): Promise<{ success: boolean }> {
  const auth = await verifyAdminSession();
  if (auth.status !== "authenticated") {
    return { success: false };
  }
  const cookieStore = cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, String(Date.now()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TIMEOUT_SECONDS,
  });
  return { success: true };
}

/**
 * Server Action: Send Password Recovery OTP
 * Enforces admin authorization check before calling Supabase Auth reset.
 * Does not disclose whether email exists in the database.
 */
export async function adminSendPasswordRecoveryOtpAction(formData: {
  email: string;
}): Promise<AdminAuthResponse> {
  const email = (formData.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid administrator email address." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Database connection not configured. Check .env.local.",
    };
  }

  // 1. Verify that email belongs to an active, authorized clinic staff or administrator
  const { data: adminExists } = await (supabase.from("admin_users") as any)
    .select("id")
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminExists) {
    // Return generic message to prevent account enumeration
    return {
      success: true,
      message:
        "If an authorized administrator account matches that email, a 6-digit verification code has been dispatched. Please check your inbox.",
    };
  }

  // 2. Request password reset OTP / recovery link from Supabase Auth
  // We specify redirectTo pointing to our /auth/callback handler so that if Supabase
  // delivers a reset link, clicking it securely exchanges the code and lands on /admin/reset-password.
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/admin/reset-password`,
  });

  if (error) {
    // If rate limited or provider error, provide safe message
    return {
      success: false,
      message: error.message.includes("rate limit")
        ? "Too many requests. Please wait a few minutes before requesting another code."
        : error.message,
    };
  }

  return {
    success: true,
    message:
      "A 6-digit verification code has been dispatched to your email. Please check your inbox.",
  };
}

/**
 * Server Action: Verify Recovery OTP Code
 * Uses Supabase Auth verifyOtp with type 'recovery' to establish a secure recovery session.
 */
export async function adminVerifyRecoveryOtpAction(formData: {
  email: string;
  otp: string;
}): Promise<AdminAuthResponse> {
  const email = (formData.email || "").trim().toLowerCase();
  const otp = (formData.otp || "").trim();

  if (!email || !otp) {
    return { success: false, message: "Email and 6-digit verification code are required." };
  }

  if (otp.length < 6) {
    return { success: false, message: "Verification code must be 6 digits." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase connection unavailable." };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "recovery",
  });

  if (error || !data.session) {
    return {
      success: false,
      message: "Invalid or expired verification code. Please request a new code or try again.",
    };
  }

  return {
    success: true,
    message: "Verification code accepted. Please set your new password.",
  };
}

/**
 * Server Action: Set New Password after OTP verification
 * Updates password and signs out recovery session.
 */
export async function adminResetPasswordWithSessionAction(formData: {
  newPassword: string;
  confirmPassword: string;
}): Promise<AdminAuthResponse> {
  const newPassword = formData.newPassword || "";
  const confirmPassword = formData.confirmPassword || "";

  if (!newPassword || newPassword.length < 8) {
    return {
      success: false,
      message: "New password must be at least 8 characters in length.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "New password and confirmation password do not match.",
    };
  }

  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasDigitOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  if (!hasLetter || !hasDigitOrSpecial) {
    return {
      success: false,
      message: "Password must contain letters and at least one number or special character.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase connection unavailable." };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  // Sign out recovery session and clear all cookies so user must log in afresh
  await supabase.auth.signOut();
  const cookieStore = cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  cookieStore.set("bmk_admin_in_area", "", { maxAge: 0, path: "/" });
  cookieStore.set("bmk_admin_departed", "", { maxAge: 0, path: "/" });

  return {
    success: true,
    message: "Password successfully updated. Please sign in with your new credentials.",
    redirectTo: "/admin/login?reason=password_recovered",
  };
}

/**
 * Server Action: Change Password from Admin Settings
 * Enforces current session verification, re-authenticates current password with Supabase Auth,
 * updates password, and terminates other sessions.
 */
export async function adminChangePasswordAction(formData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<AdminAuthResponse> {
  const auth = await verifyAdminSession();
  if (auth.status !== "authenticated") {
    return {
      success: false,
      message: "Your administrative session has expired or is unauthorized. Please sign in again.",
    };
  }

  const currentPassword = formData.currentPassword || "";
  const newPassword = formData.newPassword || "";
  const confirmPassword = formData.confirmPassword || "";

  if (!currentPassword) {
    return {
      success: false,
      message: "Please enter your current password to authorize this security change.",
    };
  }

  if (!newPassword || newPassword.length < 8) {
    return {
      success: false,
      message: "New password must be at least 8 characters in length.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "New password and confirmation password do not match.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      success: false,
      message: "New password must be different from your current password.",
    };
  }

  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasDigitOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  if (!hasLetter || !hasDigitOrSpecial) {
    return {
      success: false,
      message: "Password must contain letters and at least one number or special character.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase connection unavailable." };
  }

  // 1. Re-authenticate against Supabase Auth using current credentials
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: auth.user.email,
    password: currentPassword,
  });

  if (reauthError) {
    return {
      success: false,
      message: "Incorrect current password. Please re-enter your current password.",
    };
  }

  // 2. Update to new password in Supabase Auth
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  // 3. Invalidate active session and require explicit re-login
  await supabase.auth.signOut();
  const cookieStore = cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  cookieStore.set("bmk_admin_in_area", "", { maxAge: 0, path: "/" });
  cookieStore.set("bmk_admin_departed", "", { maxAge: 0, path: "/" });

  return {
    success: true,
    message: "Password successfully updated. For security, please sign in with your new password.",
    redirectTo: "/admin/login?reason=password_changed",
  };
}

/**
 * Server Action: Legacy Forgot Password (Kept for compatibility)
 */
export async function adminForgotPasswordAction(formData: {
  email: string;
}): Promise<AdminAuthResponse> {
  return adminSendPasswordRecoveryOtpAction(formData);
}

/**
 * Server Action: Legacy Update Admin Password (Kept for compatibility)
 */
export async function adminUpdatePasswordAction(formData: {
  newPassword: string;
}): Promise<AdminAuthResponse> {
  return adminResetPasswordWithSessionAction({
    newPassword: formData.newPassword,
    confirmPassword: formData.newPassword,
  });
}
