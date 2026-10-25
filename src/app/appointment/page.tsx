"use client";

import { useState, useEffect, FormEvent } from "react";
import { CLINIC_INFO } from "@/data/mediaManifest";
import {
  CalendarDays,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "@/components/BrandIcons";

import { submitAppointmentAction } from "@/app/actions/appointments";

type FormState = "idle" | "submitting" | "submitted";

interface FormData {
  patientName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  dentalConcern: string;
  consent: boolean;
}

const TIME_SLOTS = [
  "04:00 PM – 05:00 PM",
  "05:00 PM – 06:00 PM",
  "06:00 PM – 07:00 PM",
  "07:00 PM – 08:00 PM",
  "08:00 PM – 09:00 PM",
  "09:00 PM – 10:00 PM",
];

const today = new Date().toISOString().split("T")[0];

export default function AppointmentPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    patientName: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    dentalConcern: "",
    consent: false,
  });

  // Pre-fill dental concern if user navigated from a specific service
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get("service");
      if (serviceParam) {
        setFormData((prev) => ({
          ...prev,
          dentalConcern: `Inquiry regarding ${serviceParam}: `,
        }));
      }
    }
  }, []);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};

    if (!formData.patientName.trim() || formData.patientName.trim().length < 2) {
      errs.patientName = "Please provide your full legal name.";
    }

    if (!formData.phone.trim() || !/^\+?[\d\s\-().]{8,}$/.test(formData.phone)) {
      errs.phone = "Please provide a valid contact phone number.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "If provided, email must be a valid address.";
    }

    if (!formData.preferredDate) {
      errs.preferredDate = "Please select your preferred appointment date.";
    } else {
      // Validate that date is not a Sunday
      const selected = new Date(formData.preferredDate + "T12:00:00");
      if (selected.getDay() === 0) {
        errs.preferredDate = "The clinic is closed on Sundays. Please select a date from Monday to Saturday.";
      } else if (formData.preferredDate < today) {
        errs.preferredDate = "Please select today or a future date.";
      }
    }

    if (!formData.preferredTime) {
      errs.preferredTime = "Please select a preferred time slot.";
    }

    if (!formData.dentalConcern.trim() || formData.dentalConcern.trim().length < 5) {
      errs.dentalConcern = "Please describe your dental concern or procedure.";
    }

    if (!formData.consent) {
      errs.consent = "You must confirm consent to submit this consultation request.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    setFormState("submitting");

    try {
      const res = await submitAppointmentAction({
        patientName: formData.patientName,
        patientPhone: formData.phone,
        patientEmail: formData.email,
        preferredDate: formData.preferredDate,
        preferredTimeSlot: formData.preferredTime,
        dentalConcern: formData.dentalConcern,
        consentGiven: formData.consent,
      });

      if (!res.success) {
        if (res.errors) {
          setErrors(res.errors as any);
        }
        setSubmitError(
          res.message ||
            "Unable to submit appointment request. Please try again or call the clinic at 03332760510."
        );
        setFormState("idle");
        return;
      }

      if (res.referenceId) {
        setReferenceId(res.referenceId);
      }
      setFormState("submitted");
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(
        "A network or server error occurred. Please verify your connection or call the clinic directly at 03332760510."
      );
      setFormState("idle");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (submitError) setSubmitError(null);
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ------------------ SUBMITTED STATE ------------------
  if (formState === "submitted") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-xl w-full bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-8 sm:p-12 space-y-7 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#103629] text-[#B69A61] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                Consultation Request Received
              </h2>
              <p className="text-xs font-mono text-[#707873] dark:text-[#A8B2AC] uppercase tracking-wider mt-0.5">
                Pending Clinic Verification
              </p>
            </div>
          </div>

          <div className="space-y-3.5 text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed border-t border-b border-[#E4E0D6] dark:border-[#1E4234] py-5">
            <p>
              Thank you, <strong className="text-[#103629] dark:text-[#F7F5EF]">{formData.patientName}</strong>. Dr Vishal Lohana and his team will review your appointment request.
            </p>
            {referenceId && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-xs font-mono">
                <span className="text-[#707873] dark:text-[#A8B2AC] uppercase text-[10px]">Reference ID:</span>
                <span className="font-bold text-[#103629] dark:text-[#B69A61]">{referenceId}</span>
              </div>
            )}
            <p className="text-xs text-[#707873] dark:text-[#A8B2AC]">
              Our clinical coordinator will contact you by telephone at{" "}
              <strong className="text-[#103629] dark:text-[#F7F5EF] font-mono">{formData.phone}</strong> during practice hours (Monday – Saturday: 4:00 PM – 10:00 PM) to confirm availability and finalize your appointment time.
            </p>
            {formData.email && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  An automatic consultation receipt was dispatched to <strong>{formData.email}</strong>. Please check your inbox or spam folder.
                </span>
              </div>
            )}
            <div className="bg-[#FAF9F6] dark:bg-[#0F261D] p-4 border border-[#E4E0D6] dark:border-[#1E4234] text-xs font-mono text-[#545C57] dark:text-[#CBD5CF] space-y-1">
              <div>
                <span className="text-[#707873] dark:text-[#A8B2AC] uppercase text-[10px] block">Requested Preference:</span>
                <span className="font-semibold text-[#103629] dark:text-[#F7F5EF]">
                  {formData.preferredDate} &bull; {formData.preferredTime}
                </span>
              </div>
              <div className="pt-1 text-[11px] text-[#707873] dark:text-[#A8B2AC] italic">
                *Note: Selected dates and times are treated as preferences rather than guaranteed availability.
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#707873] dark:text-[#A8B2AC] font-sans">Have an urgent clinical question?</span>
              <div className="flex items-center gap-4 font-mono">
                <a
                  href={CLINIC_INFO.phoneTel}
                  className="text-[#103629] dark:text-[#F7F5EF] hover:text-[#B69A61] dark:hover:text-[#CBB584] font-semibold underline underline-offset-2 transition-colors"
                >
                  Call {CLINIC_INFO.phoneDisplay}
                </a>
                <a
                  href={CLINIC_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 font-semibold underline underline-offset-2 transition-colors inline-flex items-center gap-1.5"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                setFormState("idle");
                setReferenceId(null);
                setFormData({
                  patientName: "",
                  phone: "",
                  email: "",
                  preferredDate: "",
                  preferredTime: "",
                  dentalConcern: "",
                  consent: false,
                });
              }}
              className="text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#B69A61] hover:text-[#B69A61] dark:hover:text-[#CBB584] underline underline-offset-4 transition-colors pt-2 block"
            >
              Submit another request
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ MAIN EDITORIAL APPOINTMENT PAGE ------------------
  return (
    <div className="space-y-14 md:space-y-20 pb-28">
      {/* Refined Page Introduction */}
      <section className="pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF] text-xs font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61]" />
            <span>Consultation Booking</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight leading-[1.08]">
            Request a Consultation with Dr Vishal Lohana and his team
          </h1>
          <p className="text-base sm:text-lg text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed pt-1 font-light">
            Select your preferred consultation date, time preference, and clinical concern. Our clinic coordinator will review your request and contact you directly to confirm scheduling.
          </p>
        </div>
      </section>

      {/* Balanced Two-Column Composition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* LEFT: Visually Dominant Appointment Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-7 sm:p-10 space-y-7 shadow-sm"
            >
              <div className="border-b border-[#E4E0D6] dark:border-[#1E4234] pb-4">
                <h2 className="font-serif text-2xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                  Patient &amp; Scheduling Details
                </h2>
                <p className="text-xs text-[#707873] dark:text-[#A8B2AC] font-sans mt-1">
                  All consultations receive dedicated clinical review before scheduling confirmation.
                </p>
              </div>

              {/* Submission Error Alert */}
              {submitError && (
                <div
                  role="alert"
                  className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-800 dark:text-red-300 text-xs font-sans leading-relaxed"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Full Legal Name */}
              <div className="space-y-2">
                <label
                  htmlFor="patientName"
                  className="block text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="patientName"
                  name="patientName"
                  type="text"
                  value={formData.patientName}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="e.g. Tariq Ahmed"
                  className={`w-full px-4 py-3 bg-[#FAF9F6] dark:bg-[#0F261D] border text-sm text-[#103629] dark:text-[#F7F5EF] font-sans placeholder:text-[#707873]/60 focus:outline-none focus:ring-2 focus:ring-[#B69A61] focus:bg-white dark:focus:bg-[#071510] transition-all ${
                    errors.patientName
                      ? "border-red-400 ring-1 ring-red-400"
                      : "border-[#E4E0D6] dark:border-[#1E4234] hover:border-[#B69A61]/50"
                  }`}
                  aria-describedby={errors.patientName ? "patientName-error" : undefined}
                  aria-invalid={!!errors.patientName}
                />
                {errors.patientName && (
                  <p id="patientName-error" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.patientName}</span>
                  </p>
                )}
              </div>

              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="03xx-xxxxxxx"
                    className={`w-full px-4 py-3 bg-[#FAF9F6] dark:bg-[#0F261D] border text-sm text-[#103629] dark:text-[#F7F5EF] font-sans placeholder:text-[#707873]/60 focus:outline-none focus:ring-2 focus:ring-[#B69A61] focus:bg-white dark:focus:bg-[#071510] transition-all ${
                      errors.phone
                        ? "border-red-400 ring-1 ring-red-400"
                        : "border-[#E4E0D6] dark:border-[#1E4234] hover:border-[#B69A61]/50"
                    }`}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-xs font-mono uppercase tracking-wider text-[#545C57] dark:text-[#CBD5CF] font-semibold"
                  >
                    Email Address <span className="text-[#707873] dark:text-[#A8B2AC] font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="patient@example.com"
                    className={`w-full px-4 py-3 bg-[#FAF9F6] dark:bg-[#0F261D] border text-sm text-[#103629] dark:text-[#F7F5EF] font-sans placeholder:text-[#707873]/60 focus:outline-none focus:ring-2 focus:ring-[#B69A61] focus:bg-white dark:focus:bg-[#071510] transition-all ${
                      errors.email
                        ? "border-red-400 ring-1 ring-red-400"
                        : "border-[#E4E0D6] dark:border-[#1E4234] hover:border-[#B69A61]/50"
                    }`}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                  />
                  <span className="text-[11px] text-[#707873] dark:text-[#A8B2AC] font-sans block">
                    Provide your email to receive an immediate electronic consultation receipt with clinic coordinates.
                  </span>
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="preferredDate"
                    className="block text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold"
                  >
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      min={today}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#FAF9F6] dark:bg-[#0F261D] border text-sm text-[#103629] dark:text-[#F7F5EF] font-sans focus:outline-none focus:ring-2 focus:ring-[#B69A61] focus:bg-white dark:focus:bg-[#071510] transition-all ${
                        errors.preferredDate
                          ? "border-red-400 ring-1 ring-red-400"
                          : "border-[#E4E0D6] dark:border-[#1E4234] hover:border-[#B69A61]/50"
                      }`}
                      aria-describedby={errors.preferredDate ? "preferredDate-error" : undefined}
                      aria-invalid={!!errors.preferredDate}
                    />
                  </div>
                  <span className="text-[11px] text-[#707873] dark:text-[#A8B2AC] font-sans block">
                    Mon – Sat only (Clinic closed Sundays)
                  </span>
                  {errors.preferredDate && (
                    <p id="preferredDate-error" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.preferredDate}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="preferredTime"
                    className="block text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold"
                  >
                    Preferred Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#FAF9F6] dark:bg-[#0F261D] border text-sm text-[#103629] dark:text-[#F7F5EF] font-sans focus:outline-none focus:ring-2 focus:ring-[#B69A61] focus:bg-white dark:focus:bg-[#071510] transition-all ${
                      errors.preferredTime
                        ? "border-red-400 ring-1 ring-red-400"
                        : "border-[#E4E0D6] dark:border-[#1E4234] hover:border-[#B69A61]/50"
                    }`}
                    aria-describedby={errors.preferredTime ? "preferredTime-error" : undefined}
                    aria-invalid={!!errors.preferredTime}
                  >
                    <option value="">Select a preferred time window</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-[#707873] dark:text-[#A8B2AC] font-sans block">
                    Clinic hours: 4:00 PM – 10:00 PM
                  </span>
                  {errors.preferredTime && (
                    <p id="preferredTime-error" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.preferredTime}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Dental Concern */}
              <div className="space-y-2">
                <label
                  htmlFor="dentalConcern"
                  className="block text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold"
                >
                  Dental Concern or Treatment Needed <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="dentalConcern"
                  name="dentalConcern"
                  rows={4}
                  value={formData.dentalConcern}
                  onChange={handleChange}
                  placeholder="Please describe your symptoms, desired procedure (e.g., dental implant, wisdom tooth removal, jaw pain, root canal, teeth alignment), or any relevant medical history..."
                  className={`w-full px-4 py-3 bg-[#FAF9F6] dark:bg-[#0F261D] border text-sm text-[#103629] dark:text-[#F7F5EF] font-sans placeholder:text-[#707873]/60 focus:outline-none focus:ring-2 focus:ring-[#B69A61] focus:bg-white dark:focus:bg-[#071510] transition-all ${
                    errors.dentalConcern
                      ? "border-red-400 ring-1 ring-red-400"
                      : "border-[#E4E0D6] dark:border-[#1E4234] hover:border-[#B69A61]/50"
                  }`}
                  aria-describedby={errors.dentalConcern ? "dentalConcern-error" : undefined}
                  aria-invalid={!!errors.dentalConcern}
                />
                {errors.dentalConcern && (
                  <p id="dentalConcern-error" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.dentalConcern}</span>
                  </p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 rounded border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#B69A61] focus:ring-[#B69A61] accent-[#103629] dark:accent-[#B69A61]"
                  />
                  <span className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed">
                    I confirm that the details provided are accurate and authorize BMK Dental &amp; Maxillofacial Clinic to contact me by phone or WhatsApp regarding this appointment request.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-sans pl-7">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.consent}</span>
                  </p>
                )}
              </div>

              {/* Submit Action Area with Required Explicit Wording */}
              <div className="pt-3 space-y-4 border-t border-[#E4E0D6] dark:border-[#1E4234]">
                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full flex items-center justify-center gap-2 bg-[#103629] hover:bg-[#174635] disabled:bg-[#103629]/60 text-[#F7F5EF] py-4 px-6 text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-sm active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#B69A61] focus:ring-offset-2"
                >
                  {formState === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#B69A61]" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#B69A61]" />
                      <span>Submit Consultation Request</span>
                    </>
                  )}
                </button>

                {/* Essential Single Disclaimer Required by Phase 4 Specification */}
                <p className="text-xs text-center text-[#707873] dark:text-[#A8B2AC] font-sans leading-relaxed max-w-xl mx-auto">
                  Submitting this form sends an appointment request. Our clinic team will contact you by phone to confirm availability and finalize your appointment.
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT: Minimal Restrained Clinic Information Area */}
          <div className="lg:col-span-5">
            <div className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-7 sm:p-9 space-y-7 shadow-sm">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B69A61] dark:text-[#CBB584] block font-semibold">
                  Clinic Information &amp; Hours
                </span>
                <h3 className="font-serif text-2xl text-[#103629] dark:text-[#F7F5EF] font-normal mt-1">
                  {CLINIC_INFO.name}
                </h3>
                <p className="text-xs font-mono text-[#707873] dark:text-[#A8B2AC] mt-1">
                  Led by {CLINIC_INFO.leadSurgeon}
                </p>
              </div>

              <div className="space-y-5 text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans border-t border-b border-[#E4E0D6] dark:border-[#1E4234] py-6">
                {/* Official Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#103629] dark:text-[#B69A61] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-[#103629] dark:text-[#F7F5EF] uppercase tracking-wider font-mono text-[11px] block">
                      Operating Hours
                    </span>
                    <div className="text-xs text-[#545C57] dark:text-[#CBD5CF] space-y-0.5">
                      <p>Monday – Saturday: 4:00 PM – 10:00 PM</p>
                      <p className="text-[#707873] dark:text-[#A8B2AC]">Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Address & Google Maps Embed */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#103629] dark:text-[#B69A61] shrink-0 mt-0.5" />
                  <div className="space-y-2 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#103629] dark:text-[#F7F5EF] uppercase tracking-wider font-mono text-[11px] block">
                        Location
                      </span>
                      <a
                        href="https://www.google.com/maps/place/BMK+Dental+%26+Maxillofacial+Clinic+(Dr+Vishal+Lohana)/@25.4003729,68.3558586,17z"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B69A61] hover:text-[#9A814F] dark:hover:text-[#D1BE93] font-semibold transition-colors"
                      >
                        <span>View on Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] leading-relaxed">
                      {CLINIC_INFO.address}
                    </p>

                    {/* Responsive Google Maps Embed */}
                    <div className="mt-3 relative w-full aspect-[16/10] sm:aspect-[16/9] border border-[#E4E0D6] dark:border-[#1E4234] overflow-hidden bg-[#FAF9F6] dark:bg-[#0F261D] shadow-inner">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3604.1325619182135!2d68.35585861163469!3d25.40037292334654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x394c71da9339a345%3A0xa1b0a2084236d4f6!2sBMK%20Dental%20%26%20Maxillofacial%20Clinic%20(Dr%20Vishal%20Lohana)!5e0!3m2!1sen!2s!4v1792865449215!5m2!1sen!2s"
                        title="BMK Dental & Maxillofacial Clinic Location Map"
                        className="absolute inset-0 w-full h-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#103629] dark:text-[#B69A61] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-[#103629] dark:text-[#F7F5EF] uppercase tracking-wider font-mono text-[11px] block">
                      Telephone Lines
                    </span>
                    <div className="text-xs space-y-0.5 font-mono">
                      <div>
                        <span className="text-[#707873] dark:text-[#A8B2AC]">Line 1: </span>
                        <a
                          href={CLINIC_INFO.phoneTel}
                          className="text-[#103629] dark:text-[#F7F5EF] hover:text-[#B69A61] dark:hover:text-[#CBB584] font-semibold underline decoration-[#103629]/30 dark:decoration-[#B69A61]/30 transition-colors"
                        >
                          {CLINIC_INFO.phoneDisplay}
                        </a>
                      </div>
                      <div>
                        <span className="text-[#707873] dark:text-[#A8B2AC]">Line 2: </span>
                        <a
                          href={CLINIC_INFO.secondaryPhoneTel}
                          className="text-[#103629] dark:text-[#F7F5EF] hover:text-[#B69A61] dark:hover:text-[#CBB584] font-semibold underline decoration-[#103629]/30 dark:decoration-[#B69A61]/30 transition-colors"
                        >
                          {CLINIC_INFO.secondaryPhoneDisplay}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <WhatsAppIcon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-[#103629] dark:text-[#F7F5EF] uppercase tracking-wider font-mono text-[11px] block">
                      WhatsApp Messaging
                    </span>
                    <div className="text-xs space-y-0.5 font-mono">
                      <div>
                        <span className="text-[#707873] dark:text-[#A8B2AC]">Line 1: </span>
                        <a
                          href={CLINIC_INFO.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold underline decoration-emerald-600/30 transition-colors"
                        >
                          {CLINIC_INFO.phoneDisplay}
                        </a>
                      </div>
                      <div>
                        <span className="text-[#707873] dark:text-[#A8B2AC]">Line 2: </span>
                        <a
                          href={CLINIC_INFO.secondaryWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold underline decoration-emerald-600/30 transition-colors"
                        >
                          {CLINIC_INFO.secondaryPhoneDisplay}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Communication Buttons for both lines */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={CLINIC_INFO.phoneTel}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] text-xs font-mono uppercase tracking-wider font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B69A61]" />
                    <span>Call 0333</span>
                  </a>
                  <a
                    href={CLINIC_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-mono uppercase tracking-wider font-medium transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp 1</span>
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={CLINIC_INFO.secondaryPhoneTel}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#FAF9F6] dark:bg-[#0F261D] hover:bg-[#EFECE3] dark:hover:bg-[#143026] text-[#103629] dark:text-[#F7F5EF] border border-[#E4E0D6] dark:border-[#1E4234] text-xs font-mono uppercase tracking-wider font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B69A61]" />
                    <span>Call 0343</span>
                  </a>
                  <a
                    href={CLINIC_INFO.secondaryWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-mono uppercase tracking-wider font-medium transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp 2</span>
                  </a>
                </div>
              </div>

              {/* Official Social Media Channels */}
              <div className="pt-3 border-t border-[#E4E0D6] dark:border-[#1E4234]">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B69A61] dark:text-[#CBB584] block font-semibold mb-2">
                  Official Social Channels
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={CLINIC_INFO.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F6] dark:bg-[#0F261D] hover:bg-white dark:hover:bg-[#143026] text-[#103629] dark:text-[#F7F5EF] border border-[#E4E0D6] dark:border-[#1E4234] text-xs font-sans transition-colors rounded-xs shadow-xs"
                  >
                    <FacebookIcon className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href={CLINIC_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F6] dark:bg-[#0F261D] hover:bg-white dark:hover:bg-[#143026] text-[#103629] dark:text-[#F7F5EF] border border-[#E4E0D6] dark:border-[#1E4234] text-xs font-sans transition-colors rounded-xs shadow-xs"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

              {/* Clinical Reassurance Note */}
              <div className="pt-2 text-[11px] text-[#707873] dark:text-[#A8B2AC] font-sans leading-relaxed">
                <p>
                  Dr Vishal Lohana and his team will review your appointment request. Dates and time slots selected online are registered as clinical preferences, and finalized during your telephone confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
