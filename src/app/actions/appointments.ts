"use server";

import { validateAppointmentInput, AppointmentInput } from "@/lib/validations/appointment";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import { dispatchAppointmentNotifications } from "@/lib/notifications/dispatcher";

export interface AppointmentActionResponse {
  success: boolean;
  message: string;
  referenceId?: string;
  errors?: Record<string, string>;
}

type AppointmentInsert = Database["public"]["Tables"]["appointments"]["Insert"];

/**
 * Server Action: Submit Appointment Request
 * Validates patient details, blocks Sundays/closed hours, prevents rapid duplicates,
 * records pending appointment using server-only admin client, and triggers notifications.
 */
export async function submitAppointmentAction(
  data: AppointmentInput
): Promise<AppointmentActionResponse> {
  // 1. Strict Server-Side Validation
  const validation = validateAppointmentInput(data);
  if (!validation.isValid || !validation.sanitizedData) {
    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors: validation.errors,
    };
  }

  // 2. Obtain Server-Only Supabase Client
  const supabase = createAdminClient();

  if (!supabase) {
    return {
      success: false,
      message:
        "Database service is currently unconfigured or unavailable. Please call the clinic directly at 03332760510.",
    };
  }

  const sanitized = validation.sanitizedData;

  // 3. Duplicate Submission Guard: Check for identical pending appointment within last 15 minutes
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: existingDuplicate } = await (supabase.from("appointments") as any)
      .select("id")
      .eq("patient_phone", sanitized.patient_phone)
      .eq("preferred_date", sanitized.preferred_date)
      .gte("created_at", fifteenMinutesAgo)
      .limit(1)
      .maybeSingle();

    if (existingDuplicate) {
      return {
        success: true,
        message:
          "An appointment request with this phone number and date has already been received. Our clinical team will contact you shortly by telephone.",
        referenceId: existingDuplicate.id.slice(0, 8).toUpperCase(),
      };
    }
  } catch (dupErr) {
    // Non-blocking; continue to insert
    console.warn("[Duplicate Check Skipped]:", dupErr);
  }

  // 4. Build fully-typed insert payload
  const payload: AppointmentInsert = {
    ...sanitized,
    status: "pending",
    is_triage_urgent: false,
    notification_sent: false,
  };

  // 5. Insert record using RLS
  const { data: appointment, error } = await (
    supabase.from("appointments") as any
  )
    .insert(payload)
    .select("id, patient_name, patient_phone, patient_email, preferred_date, preferred_time_slot, dental_concern")
    .single();

  if (error || !appointment) {
    console.error("[Appointment Submission Error]:", error?.message);
    return {
      success: false,
      message:
        "An error occurred while submitting your appointment request. Please contact the clinic directly at 03332760510.",
    };
  }

  // 6. Trigger Asynchronous Notifications (Non-blocking & Idempotent)
  try {
    await dispatchAppointmentNotifications(appointment);
  } catch (notifErr) {
    console.warn("[Appointment Notification Dispatch Warning]:", notifErr);
  }

  return {
    success: true,
    message:
      "Your appointment request has been submitted. Our clinical team will contact you by telephone to confirm availability.",
    referenceId: (appointment as { id: string }).id.slice(0, 8).toUpperCase(),
  };
}
