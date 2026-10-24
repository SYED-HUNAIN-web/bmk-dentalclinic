import { createAdminClient } from "@/lib/supabase/admin";
import { CLINIC_INFO } from "@/data/mediaManifest";

export interface SendWhatsAppOptions {
  to: string;
  message: string;
  appointmentId?: string;
  recipientType: "patient" | "admin";
  notificationType: "appointment_request_receipt" | "admin_alert" | "appointment_confirmed";
}

export interface WhatsAppDispatchResult {
  sent: boolean;
  channel: "whatsapp";
  recipient: string;
  deliveryStatus: "queued" | "sent" | "failed";
  errorMessage?: string;
}

/**
 * Normalizes phone numbers to standard E.164 format, specifically handling Pakistan numbers.
 * Converts:
 *  - "03332760510"  -> "+923332760510"
 *  - "3332760510"   -> "+923332760510"
 *  - "923332760510" -> "+923332760510"
 *  - "+92 333 2760510" -> "+923332760510"
 */
export function normalizePakistanPhone(rawPhone: string): string {
  if (!rawPhone) return "";
  // Strip all non-digit characters except leading '+'
  const cleaned = rawPhone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    const digitsOnly = cleaned.substring(1).replace(/\D/g, "");
    return `+${digitsOnly}`;
  }

  // If starts with 00 (international prefix)
  if (cleaned.startsWith("00")) {
    return `+${cleaned.substring(2)}`;
  }

  // Pakistan local format 03xx
  if (cleaned.startsWith("03") && cleaned.length === 11) {
    return `+92${cleaned.substring(1)}`;
  }

  // 3xx without leading zero
  if (cleaned.startsWith("3") && cleaned.length === 10) {
    return `+92${cleaned}`;
  }

  // 923xx without plus
  if (cleaned.startsWith("92") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // Return with leading plus if standard length
  if (cleaned.length >= 10) {
    return `+${cleaned}`;
  }

  return cleaned;
}

/**
 * Dispatches a WhatsApp notification via configured provider (Twilio or Meta Cloud API),
 * with safe simulated audit queue fallback if credentials are not yet configured.
 */
export async function sendNotificationWhatsApp(
  options: SendWhatsAppOptions
): Promise<WhatsAppDispatchResult> {
  const normalizedPhone = normalizePakistanPhone(options.to);

  // Twilio credentials
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER || "+14155238886"; // e.g. twilio sandbox or live number

  // Meta WhatsApp Cloud API credentials
  const metaToken = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  let deliveryStatus: "queued" | "sent" | "failed" = "failed";
  let errorMessage: string | undefined;
  let providerUsed = "none";

  // Check if live credentials exist
  const hasTwilio =
    Boolean(twilioSid) &&
    Boolean(twilioToken) &&
    !twilioSid?.includes("your_") &&
    !twilioToken?.includes("your_");

  const hasMeta =
    Boolean(metaToken) &&
    Boolean(metaPhoneId) &&
    !metaToken?.includes("your_") &&
    !metaPhoneId?.includes("your_");

  if (hasTwilio) {
    providerUsed = "twilio";
    try {
      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const authHeader = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const params = new URLSearchParams();
      params.append("From", twilioFrom.startsWith("whatsapp:") ? twilioFrom : `whatsapp:${twilioFrom}`);
      params.append("To", `whatsapp:${normalizedPhone}`);
      params.append("Body", options.message);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        deliveryStatus = "sent";
      } else {
        const errorData = await response.json().catch(() => ({}));
        errorMessage = `Twilio responded with HTTP ${response.status}: ${(errorData as any).message || "Unknown"}`;
        deliveryStatus = "failed";
      }
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : "Network error during Twilio WhatsApp dispatch.";
      deliveryStatus = "failed";
    }
  } else if (hasMeta) {
    providerUsed = "meta_cloud_api";
    try {
      const endpoint = `https://graph.facebook.com/v19.0/${metaPhoneId}/messages`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${metaToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: normalizedPhone.replace(/^\+/, ""),
          type: "text",
          text: { preview_url: false, body: options.message },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        deliveryStatus = "sent";
      } else {
        const errorData = await response.json().catch(() => ({}));
        errorMessage = `Meta WhatsApp API responded with HTTP ${response.status}: ${(errorData as any)?.error?.message || "Unknown"}`;
        deliveryStatus = "failed";
      }
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : "Network error during Meta WhatsApp dispatch.";
      deliveryStatus = "failed";
    }
  } else {
    // Graceful audit queue fallback for local / non-configured environments
    providerUsed = "simulated_local";
    deliveryStatus = "queued";
    errorMessage =
      "WhatsApp provider not configured (TWILIO_ACCOUNT_SID or WHATSAPP_CLOUD_API_TOKEN not set in environment). Logged in internal audit queue.";
  }

  // Audit record in public.notification_logs
  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      await (adminSupabase.from("notification_logs") as any).insert({
        appointment_id: options.appointmentId || null,
        channel: "whatsapp",
        recipient: normalizedPhone || options.to,
        delivery_status: deliveryStatus,
        error_message: errorMessage || null,
        metadata: {
          recipient_type: options.recipientType,
          notification_type: options.notificationType,
          provider: providerUsed,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (logErr) {
    console.error("[WhatsApp Audit Error]: Failed to write notification_log:", logErr);
  }

  return {
    sent: deliveryStatus === "sent",
    channel: "whatsapp",
    recipient: normalizedPhone || options.to,
    deliveryStatus,
    errorMessage,
  };
}

/**
 * Builds and sends Patient WhatsApp Confirmation Receipt.
 * Explicitly states that request is awaiting clinical approval, includes booking ref and clinic contact.
 * Contains NO diagnostic data or sensitive clinical notes.
 */
export async function sendPatientAppointmentWhatsAppReceipt(appointment: {
  id: string;
  patient_name: string;
  patient_phone: string;
  preferred_date: string;
  preferred_time_slot: string;
}): Promise<WhatsAppDispatchResult> {
  const refId = appointment.id.slice(0, 8).toUpperCase();

  const message = [
    `🦷 *BMK Dental & Maxillofacial Clinic*`,
    `Consultation Request Received`,
    ``,
    `Dear ${appointment.patient_name},`,
    `We have received your appointment request.`,
    ``,
    `📋 *Booking Reference:* ${refId}`,
    `📅 *Requested Date:* ${appointment.preferred_date}`,
    `⏰ *Requested Time Slot:* ${appointment.preferred_time_slot}`,
    ``,
    `⚠️ *IMPORTANT NOTICE:*`,
    `This request is *AWAITING CLINICAL TRIAGE* and is *NOT YET CONFIRMED*. Our clinical reception will call you at this number to verify schedule availability and finalize your appointment time.`,
    ``,
    `📍 *Clinic Location:*`,
    `Quaid-E-Azam Medical Complex, Clinic No: MF:32, CMH Rd, Saddar, Hyderabad`,
    `📞 *Direct Phone:* ${CLINIC_INFO.phoneDisplay}`,
    `🕒 *Hours:* Mon - Sat, 4:00 PM - 10:00 PM (Closed Sunday)`,
    ``,
    `Thank you for choosing BMK Dental & Maxillofacial Clinic.`,
  ].join("\n");

  return sendNotificationWhatsApp({
    to: appointment.patient_phone,
    message,
    appointmentId: appointment.id,
    recipientType: "patient",
    notificationType: "appointment_request_receipt",
  });
}

/**
 * Builds and sends Clinic Admin WhatsApp Alert.
 * Alert sent to configured clinic WhatsApp number with patient triage details.
 */
export async function sendClinicAdminWhatsAppAlert(appointment: {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  preferred_date: string;
  preferred_time_slot: string;
  dental_concern: string;
}): Promise<WhatsAppDispatchResult> {
  const refId = appointment.id.slice(0, 8).toUpperCase();
  const clinicWhatsApp =
    process.env.CLINIC_ADMIN_WHATSAPP_NUMBER ||
    process.env.CLINIC_NOTIFICATION_WHATSAPP ||
    CLINIC_INFO.phoneTel; // default: +923332760510

  const message = [
    `🚨 *NEW PATIENT TRIAGE REQUEST*`,
    `*BMK Dental & Maxillofacial Clinic*`,
    ``,
    `📋 *Ref:* ${refId}`,
    `👤 *Patient:* ${appointment.patient_name}`,
    `📞 *Phone:* ${appointment.patient_phone}`,
    `✉️ *Email:* ${appointment.patient_email || "None"}`,
    `📅 *Date:* ${appointment.preferred_date}`,
    `⏰ *Slot:* ${appointment.preferred_time_slot}`,
    ``,
    `📝 *Clinical Concern:*`,
    `"${appointment.dental_concern}"`,
    ``,
    `⚡ *Triage Action Required:*`,
    `Contact the patient by phone to confirm or reschedule.`,
  ].join("\n");

  return sendNotificationWhatsApp({
    to: clinicWhatsApp,
    message,
    appointmentId: appointment.id,
    recipientType: "admin",
    notificationType: "admin_alert",
  });
}
