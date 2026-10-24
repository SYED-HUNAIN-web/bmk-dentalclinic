import { createAdminClient } from "@/lib/supabase/admin";
import { CLINIC_INFO } from "@/data/mediaManifest";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  appointmentId?: string;
  recipientType?: "admin" | "patient";
}

export interface NotificationResult {
  sent: boolean;
  channel: "email";
  recipient: string;
  deliveryStatus: "queued" | "sent" | "failed";
  errorMessage?: string;
}

/**
 * Clean Server-Side Email Dispatcher
 * Uses RESEND_API_KEY (server-only) to send via Resend's REST API with a plain fetch.
 * Falls back to onboarding@resend.dev when NOTIFICATION_FROM_EMAIL is not set — this is
 * the Resend-provided sandbox address and is the ONLY sender that works without a
 * verified custom domain. Do NOT use a clinic address as the sender until the domain
 * has been verified in the Resend dashboard.
 * Logs every attempt to `notification_logs` regardless of outcome.
 */
export async function sendNotificationEmail(
  options: SendEmailOptions
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;

  // Sender resolution:
  // 1. NOTIFICATION_FROM_EMAIL — set this only after verifying your domain in Resend.
  // 2. onboarding@resend.dev  — Resend's built-in test address; works immediately but
  //    can ONLY send to the account owner's verified email, not arbitrary recipients.
  const fromEmail =
    process.env.NOTIFICATION_FROM_EMAIL || "onboarding@resend.dev";

  let deliveryStatus: "queued" | "sent" | "failed" = "failed";
  let errorMessage: string | undefined;

  if (!apiKey || apiKey.includes("your-resend-api-key")) {
    errorMessage =
      "Email provider not configured (RESEND_API_KEY missing in .env.local). Notification logged in internal audit queue.";
    deliveryStatus = "queued";
  } else {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text || options.html.replace(/<[^>]+>/g, ""),
        }),
      });

      if (response.ok) {
        deliveryStatus = "sent";
      } else {
        const errorData = await response.json().catch(() => ({}));
        errorMessage = `Email provider responded with HTTP ${response.status}: ${JSON.stringify(errorData)}`;
        deliveryStatus = "failed";
      }
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : "Unknown network error during email dispatch.";
      deliveryStatus = "failed";
    }
  }

  // Record dispatch outcome in the notification_logs database table
  try {
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      await (adminSupabase.from("notification_logs") as any).insert({
        appointment_id: options.appointmentId || null,
        channel: "email",
        recipient: options.to,
        delivery_status: deliveryStatus,
        error_message: errorMessage || null,
        metadata: {
          recipient_type: options.recipientType || (options.to.includes("admin") ? "admin" : "patient"),
          subject: options.subject,
          provider: apiKey ? "resend" : "simulated_local",
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (logErr) {
    console.error("[Notification Audit Error]: Failed to write log:", logErr);
  }

  return {
    sent: deliveryStatus === "sent",
    channel: "email",
    recipient: options.to,
    deliveryStatus,
    errorMessage,
  };
}

/**
 * Clinic Admin Alert: Triggered on new consultation request submission
 */
export async function sendClinicNewAppointmentAlert(appointment: {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  preferred_date: string;
  preferred_time_slot: string;
  dental_concern: string;
}) {
  // Prefer CLINIC_ADMIN_EMAIL (added to .env.local) then fall back to the legacy
  // CLINIC_NOTIFICATION_EMAIL variable and finally to the hard-coded manifest value.
  const clinicRecipient =
    process.env.CLINIC_ADMIN_EMAIL ||
    process.env.CLINIC_NOTIFICATION_EMAIL ||
    CLINIC_INFO.email;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e0d6; background: #faf9f6;">
      <div style="background: #103629; color: #f7f5ef; padding: 16px 20px;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 500;">BMK Dental & Maxillofacial Clinic</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #b69a61; text-transform: uppercase; letter-spacing: 0.1em;">New Consultation Request Received</p>
      </div>
      <div style="padding: 24px 20px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #202622;">
          <tr>
            <td style="padding: 8px 0; color: #707873; width: 140px;">Patient Name:</td>
            <td style="padding: 8px 0; font-weight: 600;">${appointment.patient_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #707873;">Contact Phone:</td>
            <td style="padding: 8px 0; font-weight: 600;"><a href="tel:${appointment.patient_phone}" style="color: #103629;">${appointment.patient_phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #707873;">Patient Email:</td>
            <td style="padding: 8px 0;">${appointment.patient_email || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #707873;">Requested Date:</td>
            <td style="padding: 8px 0; font-weight: 600;">${appointment.preferred_date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #707873;">Requested Slot:</td>
            <td style="padding: 8px 0; font-weight: 600;">${appointment.preferred_time_slot}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0 6px; color: #707873; vertical-align: top;">Clinical Concern:</td>
            <td style="padding: 12px 0 6px; background: #f7f5ef; padding: 12px; border-left: 3px solid #b69a61; font-style: italic;">
              ${appointment.dental_concern}
            </td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e0d6; font-size: 12px; color: #707873;">
          <p style="margin: 0;"><strong>Triage Action Required:</strong> Contact patient by phone to evaluate clinical urgency, confirm slot availability, or reschedule.</p>
        </div>
      </div>
    </div>
  `;

  return sendNotificationEmail({
    to: clinicRecipient,
    subject: `[BMK Triage Alert] Request from ${appointment.patient_name} (${appointment.preferred_date})`,
    html,
    appointmentId: appointment.id,
    recipientType: "admin",
  });
}

/**
 * Patient Receipt Acknowledgment: Explicitly states that submission is NOT a confirmation
 */
export async function sendPatientAppointmentReceipt(appointment: {
  id: string;
  patient_name: string;
  patient_email: string;
  preferred_date: string;
  preferred_time_slot: string;
  dental_concern?: string | null;
}) {
  const serviceDetail = appointment.dental_concern
    ? `<div style="margin: 16px 0; padding: 12px 14px; background: #faf9f6; border-left: 3px solid #b69a61; font-size: 13px; color: #202622;">
        <span style="font-weight: 600; color: #103629; display: block; margin-bottom: 4px;">Service / Concern Requested:</span>
        <span style="color: #545c57;">${appointment.dental_concern}</span>
      </div>`
    : "";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e0d6; background: #faf9f6;">
      <div style="background: #103629; color: #f7f5ef; padding: 20px;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 500;">BMK Dental & Maxillofacial Clinic</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #b69a61; text-transform: uppercase; letter-spacing: 0.1em;">Consultation Request Received</p>
      </div>
      <div style="padding: 24px 20px; background: #ffffff; color: #202622;">
        <p style="font-size: 15px; margin-top: 0;">Dear <strong>${appointment.patient_name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #545c57;">
          Thank you for contacting BMK Dental & Maxillofacial Clinic. We have successfully received your consultation request for <strong>${appointment.preferred_date}</strong> during the <strong>${appointment.preferred_time_slot}</strong> slot.
        </p>

        ${serviceDetail}

        <div style="margin: 20px 0; padding: 14px 16px; background: #fff8e6; border: 1px solid #eddcb0; border-left: 4px solid #b69a61; font-size: 13px; color: #725719;">
          <strong>Important Clinical Notice:</strong> Submitting this request does <strong>NOT</strong> automatically confirm your appointment. Our clinic reception team will review clinical schedules and contact you by telephone to verify availability and confirm your consultation time.
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e0d6; font-size: 12px; color: #707873; line-height: 1.6;">
          <p style="margin: 0 0 4px;"><strong>Clinic Coordinates:</strong></p>
          <p style="margin: 0;">Quaid-E-Azam Medical Complex, Clinic No: MF:32, CMH Rd, Saddar, Hyderabad</p>
          <p style="margin: 4px 0 0;">Hours: Monday – Saturday, 4:00 PM – 10:00 PM (Sunday Closed)</p>
          <p style="margin: 4px 0 0;">Direct Phone: <strong>03332760510</strong></p>
        </div>
      </div>
    </div>
  `;

  return sendNotificationEmail({
    to: appointment.patient_email,
    subject: `Consultation Request Received — BMK Dental & Maxillofacial Clinic`,
    html,
    appointmentId: appointment.id,
    recipientType: "patient",
  });
}

/**
 * Patient Confirmation Notice: Dispatched when admin marks appointment as 'confirmed'
 */
export async function sendPatientAppointmentConfirmation(appointment: {
  id: string;
  patient_name: string;
  patient_email: string;
  preferred_date: string;
  preferred_time_slot: string;
  internal_notes?: string | null;
}) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e0d6; background: #faf9f6;">
      <div style="background: #103629; color: #f7f5ef; padding: 20px;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 500;">BMK Dental & Maxillofacial Clinic</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #4ade80; text-transform: uppercase; letter-spacing: 0.1em;">Appointment Confirmed</p>
      </div>
      <div style="padding: 24px 20px; background: #ffffff; color: #202622;">
        <p style="font-size: 15px; margin-top: 0;">Dear <strong>${appointment.patient_name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #545c57;">
          Your consultation with Dr. Vishal Lohana and the clinical team has been <strong>confirmed</strong>.
        </p>

        <div style="margin: 20px 0; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; font-size: 14px;">
          <p style="margin: 0 0 6px; font-weight: 600; color: #166534;">Confirmed Consultation Details:</p>
          <p style="margin: 0; color: #14532d;">Date: <strong>${appointment.preferred_date}</strong></p>
          <p style="margin: 4px 0 0; color: #14532d;">Time Slot: <strong>${appointment.preferred_time_slot}</strong></p>
        </div>

        <div style="margin-top: 20px; font-size: 13px; color: #545c57; line-height: 1.6;">
          <p style="margin: 0 0 6px;"><strong>Pre-Visit Instructions:</strong></p>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Please arrive 10 minutes prior to your scheduled time slot.</li>
            <li>Bring any previous dental radiographs (X-rays), CT scans, or ongoing medication lists.</li>
            <li>For inquiries or rescheduling, telephone us at <strong>03332760510</strong>.</li>
          </ul>
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e0d6; font-size: 12px; color: #707873;">
          <p style="margin: 0;"><strong>BMK Dental & Maxillofacial Clinic</strong></p>
          <p style="margin: 2px 0 0;">Quaid-E-Azam Medical Complex, Clinic No: MF:32, CMH Rd, Saddar, Hyderabad</p>
        </div>
      </div>
    </div>
  `;

  return sendNotificationEmail({
    to: appointment.patient_email,
    subject: `Appointment Confirmed: ${appointment.preferred_date} — BMK Clinic`,
    html,
    appointmentId: appointment.id,
  });
}
