import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendClinicNewAppointmentAlert,
  sendPatientAppointmentReceipt,
} from "./email";
import {
  sendPatientAppointmentWhatsAppReceipt,
  sendClinicAdminWhatsAppAlert,
} from "./whatsapp";

export interface AppointmentNotificationPayload {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  preferred_date: string;
  preferred_time_slot: string;
  dental_concern: string;
}

export interface DispatchSummary {
  patientWhatsApp: boolean;
  adminWhatsApp: boolean;
  adminEmail: boolean;
  patientEmail: boolean;
}

/**
 * Unified Appointment Notification Dispatcher
 *
 * Implements:
 * 1. Idempotency Guard: Checks `notification_logs` to prevent duplicate dispatches on retries.
 * 2. Parallel, resilient channel execution (Patient WhatsApp, Admin WhatsApp, Admin Email, Patient Email).
 * 3. Safe fallback: Provider outages never block or roll back valid appointment bookings.
 * 4. Updates `appointments.notification_sent` flag.
 */
export async function dispatchAppointmentNotifications(
  appointment: AppointmentNotificationPayload
): Promise<DispatchSummary> {
  const summary: DispatchSummary = {
    patientWhatsApp: false,
    adminWhatsApp: false,
    adminEmail: false,
    patientEmail: false,
  };

  const adminSupabase = createAdminClient();

  // 1. Check existing notification logs for idempotency
  const existingSentChannels = new Set<string>();
  if (adminSupabase) {
    try {
      const { data: pastLogs } = await (adminSupabase.from("notification_logs") as any)
        .select("channel, delivery_status, metadata")
        .eq("appointment_id", appointment.id);

      if (pastLogs && Array.isArray(pastLogs)) {
        for (const log of pastLogs) {
          if (log.delivery_status === "sent" || log.delivery_status === "delivered") {
            const recipientType = log.metadata?.recipient_type || "unknown";
            existingSentChannels.add(`${log.channel}:${recipientType}`);
          }
        }
      }
    } catch (checkErr) {
      console.warn("[Notification Idempotency Check Skipped]:", checkErr);
    }
  }

  const tasks: Promise<any>[] = [];

  // A. Patient WhatsApp Confirmation
  if (!existingSentChannels.has("whatsapp:patient") && appointment.patient_phone) {
    tasks.push(
      sendPatientAppointmentWhatsAppReceipt({
        id: appointment.id,
        patient_name: appointment.patient_name,
        patient_phone: appointment.patient_phone,
        preferred_date: appointment.preferred_date,
        preferred_time_slot: appointment.preferred_time_slot,
      })
        .then((res) => {
          summary.patientWhatsApp = res.sent || res.deliveryStatus === "queued";
        })
        .catch((err) => {
          console.warn("[Dispatcher] Patient WhatsApp error:", err?.message);
        })
    );
  }

  // B. Clinic Admin WhatsApp Alert
  if (!existingSentChannels.has("whatsapp:admin")) {
    tasks.push(
      sendClinicAdminWhatsAppAlert({
        id: appointment.id,
        patient_name: appointment.patient_name,
        patient_phone: appointment.patient_phone,
        patient_email: appointment.patient_email,
        preferred_date: appointment.preferred_date,
        preferred_time_slot: appointment.preferred_time_slot,
        dental_concern: appointment.dental_concern,
      })
        .then((res) => {
          summary.adminWhatsApp = res.sent || res.deliveryStatus === "queued";
        })
        .catch((err) => {
          console.warn("[Dispatcher] Admin WhatsApp error:", err?.message);
        })
    );
  }

  // C. Clinic Admin Email Alert
  if (!existingSentChannels.has("email:admin")) {
    tasks.push(
      sendClinicNewAppointmentAlert({
        id: appointment.id,
        patient_name: appointment.patient_name,
        patient_phone: appointment.patient_phone,
        patient_email: appointment.patient_email,
        preferred_date: appointment.preferred_date,
        preferred_time_slot: appointment.preferred_time_slot,
        dental_concern: appointment.dental_concern,
      })
        .then((res) => {
          summary.adminEmail = res.sent || res.deliveryStatus === "queued";
        })
        .catch((err) => {
          console.warn("[Dispatcher] Admin Email error:", err?.message);
        })
    );
  }

  // D. Patient Email Receipt (if email address was provided)
  if (
    appointment.patient_email &&
    !existingSentChannels.has("email:patient")
  ) {
    tasks.push(
      sendPatientAppointmentReceipt({
        id: appointment.id,
        patient_name: appointment.patient_name,
        patient_email: appointment.patient_email,
        preferred_date: appointment.preferred_date,
        preferred_time_slot: appointment.preferred_time_slot,
        dental_concern: appointment.dental_concern,
      })
        .then((res) => {
          summary.patientEmail = res.sent || res.deliveryStatus === "queued";
        })
        .catch((err) => {
          console.warn("[Dispatcher] Patient Email error:", err?.message);
        })
    );
  }

  // Wait for all channel tasks without throwing
  await Promise.allSettled(tasks);

  // Update appointment status flag
  if (adminSupabase) {
    try {
      await (adminSupabase.from("appointments") as any)
        .update({ notification_sent: true })
        .eq("id", appointment.id);
    } catch (updateErr) {
      console.warn("[Dispatcher] Failed to update appointment notification_sent:", updateErr);
    }
  }

  return summary;
}
