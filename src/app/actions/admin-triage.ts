"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { sendPatientAppointmentConfirmation } from "@/lib/notifications/email";
import { revalidatePath } from "next/cache";
import type { AppointmentStatus } from "@/types/database";

export interface TriageResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Fetch Real-Time Dashboard Statistics
 */
export async function getAdminDashboardStatsAction(): Promise<
  TriageResponse<{
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    total: number;
    recentUrgent: number;
  }>
> {
  const auth = await verifyAdminSession();
  if (auth.status !== "authenticated") {
    return {
      success: false,
      message: "Authorization required. Please log in as an administrator.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase connection unavailable." };
  }

  const { data: appointments, error } = await (supabase.from("appointments") as any)
    .select("status, is_triage_urgent");

  if (error) {
    return { success: false, message: error.message };
  }

  const list = appointments || [];
  const stats = {
    pending: list.filter((a: any) => a.status === "pending").length,
    confirmed: list.filter((a: any) => a.status === "confirmed").length,
    completed: list.filter((a: any) => a.status === "completed").length,
    cancelled: list.filter((a: any) => a.status === "cancelled").length,
    total: list.length,
    recentUrgent: list.filter((a: any) => a.is_triage_urgent).length,
  };

  return { success: true, message: "Stats loaded.", data: stats };
}

/**
 * Fetch Appointments with filtering by status, search, and date
 */
export async function getAppointmentsAction(filters?: {
  status?: string;
  date?: string;
  search?: string;
}): Promise<TriageResponse<any[]>> {
  const auth = await verifyAdminSession();
  if (auth.status !== "authenticated") {
    return { success: false, message: "Authorization required." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase connection unavailable." };
  }

  let query = (supabase.from("appointments") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.date) {
    query = query.eq("preferred_date", filters.date);
  }

  if (filters?.search) {
    const term = `%${filters.search.trim()}%`;
    query = query.or(`patient_name.ilike.${term},patient_phone.ilike.${term},dental_concern.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Appointments fetched.", data: data || [] };
}

/**
 * Update Appointment Status, Internal Notes & Urgency
 */
export async function updateAppointmentStatusAction(input: {
  id: string;
  status: AppointmentStatus;
  internalNotes?: string;
  isTriageUrgent?: boolean;
  preferredDate?: string;
  preferredTimeSlot?: string;
}): Promise<TriageResponse> {
  const auth = await verifyAdminSession();
  if (auth.status !== "authenticated") {
    return { success: false, message: "Authorization required." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase connection unavailable." };
  }

  // Get previous appointment state
  const { data: previous, error: fetchErr } = await (supabase.from("appointments") as any)
    .select("*")
    .eq("id", input.id)
    .single();

  if (fetchErr || !previous) {
    return { success: false, message: "Appointment record not found." };
  }

  const updates: Record<string, any> = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.internalNotes !== undefined) {
    updates.internal_notes = input.internalNotes;
  }
  if (input.isTriageUrgent !== undefined) {
    updates.is_triage_urgent = input.isTriageUrgent;
  }
  if (input.preferredDate) {
    updates.preferred_date = input.preferredDate;
  }
  if (input.preferredTimeSlot) {
    updates.preferred_time_slot = input.preferredTimeSlot;
  }

  const { error: updateErr } = await (supabase.from("appointments") as any)
    .update(updates)
    .eq("id", input.id);

  if (updateErr) {
    return { success: false, message: updateErr.message };
  }

  // If transitioned to confirmed, dispatch patient confirmation email
  if (input.status === "confirmed" && previous.status !== "confirmed" && previous.patient_email) {
    try {
      await sendPatientAppointmentConfirmation({
        id: previous.id,
        patient_name: previous.patient_name,
        patient_email: previous.patient_email,
        preferred_date: updates.preferred_date || previous.preferred_date,
        preferred_time_slot: updates.preferred_time_slot || previous.preferred_time_slot,
        internal_notes: updates.internal_notes,
      });
    } catch (confErr) {
      console.warn("[Patient Confirmation Dispatch Error]:", confErr);
    }
  }

  revalidatePath("/admin");
  return {
    success: true,
    message: `Appointment ${input.id.slice(0, 8).toUpperCase()} updated to '${input.status}'.`,
  };
}

/**
 * Delete an Appointment Record (Surgeon / Admin role only)
 */
export async function deleteAppointmentAction(id: string): Promise<TriageResponse> {
  const auth = await verifyAdminSession();
  if (auth.status !== "authenticated") {
    return { success: false, message: "Authorization required." };
  }

  if (auth.profile.role !== "admin" && auth.profile.role !== "surgeon") {
    return {
      success: false,
      message: "Insufficient permissions: Only clinical directors can delete appointment records.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase connection unavailable." };
  }

  const { error } = await (supabase.from("appointments") as any)
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  return { success: true, message: "Appointment record deleted successfully." };
}

/**
 * Update Clinic Settings (Site details, hours, contact, notices)
 */
export async function updateClinicSettingsAction(settings: {
  clinic_name: string;
  lead_surgeon: string;
  address: string;
  phone_display: string;
  phone_tel: string;
  whatsapp_url: string;
  opening_hours: string;
  emergency_note?: string;
}): Promise<TriageResponse> {
  const auth = await verifyAdminSession();
  if (auth.status !== "authenticated") {
    return { success: false, message: "Authorization required." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase connection unavailable." };
  }

  const { error } = await (supabase.from("site_settings") as any)
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // update any existing row

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/about");
  return { success: true, message: "Clinic configuration updated successfully." };
}
