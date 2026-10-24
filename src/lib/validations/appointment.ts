/**
 * Server-Side Appointment Input Validation
 * Validates appointment requests against verified clinic hours and policies.
 */

export interface AppointmentInput {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  dentalConcern: string;
  consentGiven: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: {
    patient_name: string;
    patient_phone: string;
    patient_email: string | null;
    preferred_date: string;
    preferred_time_slot: string;
    dental_concern: string;
    consent_given: boolean;
  };
}

export const VALID_TIME_SLOTS = [
  "04:00 PM – 05:00 PM",
  "05:00 PM – 06:00 PM",
  "06:00 PM – 07:00 PM",
  "07:00 PM – 08:00 PM",
  "08:00 PM – 09:00 PM",
  "09:00 PM – 10:00 PM",
];

export function validateAppointmentInput(input: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== "object") {
    return { isValid: false, errors: { form: "Invalid submission data." } };
  }

  const data = input as Partial<AppointmentInput>;

  // 1. Patient Name Validation
  const name = typeof data.patientName === "string" ? data.patientName.trim() : "";
  if (!name || name.length < 2) {
    errors.patientName = "Please provide your full name (at least 2 characters).";
  } else if (name.length > 100) {
    errors.patientName = "Name cannot exceed 100 characters.";
  }

  // 2. Patient Phone Validation (03xx-xxxxxxx or international +92...)
  const phone = typeof data.patientPhone === "string" ? data.patientPhone.trim() : "";
  const phoneDigits = phone.replace(/[^0-9]/g, "");
  if (!phone || phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.patientPhone = "Please provide a valid contact number (e.g., 03332760510).";
  }

  // 3. Optional Email Validation
  let email: string | null = null;
  if (data.patientEmail && typeof data.patientEmail === "string") {
    const trimmedEmail = data.patientEmail.trim();
    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.patientEmail = "Please enter a valid email address or leave it blank.";
      } else {
        email = trimmedEmail.toLowerCase();
      }
    }
  }

  // 4. Preferred Date Validation (Must not be in past, must not be Sunday)
  const dateStr = typeof data.preferredDate === "string" ? data.preferredDate.trim() : "";
  if (!dateStr) {
    errors.preferredDate = "Please select your preferred appointment date.";
  } else {
    const selectedDate = new Date(`${dateStr}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      errors.preferredDate = "Invalid appointment date format.";
    } else if (selectedDate < today) {
      errors.preferredDate = "Appointment date cannot be in the past.";
    } else if (selectedDate.getDay() === 0) {
      // 0 = Sunday
      errors.preferredDate =
        "The clinic is closed on Sundays. Please select a date from Monday to Saturday (4:00 PM – 10:00 PM).";
    }
  }

  // 5. Preferred Time Slot Validation (Verified clinic hours: 4:00 PM – 10:00 PM)
  const timeSlot = typeof data.preferredTimeSlot === "string" ? data.preferredTimeSlot.trim() : "";
  if (!timeSlot || !VALID_TIME_SLOTS.includes(timeSlot)) {
    errors.preferredTimeSlot = "Please select a valid consultation time slot (between 4:00 PM and 10:00 PM).";
  }

  // 6. Dental Concern Validation
  const concern = typeof data.dentalConcern === "string" ? data.dentalConcern.trim() : "";
  if (!concern || concern.length < 5) {
    errors.dentalConcern = "Please describe your clinical concern or reason for visit (at least 5 characters).";
  } else if (concern.length > 1000) {
    errors.dentalConcern = "Clinical concern description cannot exceed 1000 characters.";
  }

  // 7. Mandatory Consent
  if (data.consentGiven !== true) {
    errors.consentGiven = "You must acknowledge and consent to the clinic processing your appointment request.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitizedData: isValid
      ? {
          patient_name: name,
          patient_phone: phone,
          patient_email: email,
          preferred_date: dateStr,
          preferred_time_slot: timeSlot,
          dental_concern: concern,
          consent_given: true,
        }
      : undefined,
  };
}
