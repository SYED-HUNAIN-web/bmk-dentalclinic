import { createPublicServerClient } from "@/lib/supabase/public";
import {
  CLINIC_INFO,
  CLINIC_TEAM,
  CLINIC_SERVICES,
  CLIENT_CASES,
  type TeamMember,
  type ClinicService,
  type ClientCase,
} from "@/data/mediaManifest";

export async function getPublicSiteSettings() {
  try {
    const supabase = createPublicServerClient();
    if (!supabase) return CLINIC_INFO;

    const { data, error } = await (supabase.from("site_settings") as any)
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return CLINIC_INFO;
    }

    return {
      name: data.clinic_name || CLINIC_INFO.name,
      leadSurgeon: data.lead_surgeon || CLINIC_INFO.leadSurgeon,
      address: data.address || CLINIC_INFO.address,
      phoneDisplay: data.phone_display || CLINIC_INFO.phoneDisplay,
      phoneTel: data.phone_tel || CLINIC_INFO.phoneTel,
      whatsappUrl: data.whatsapp_url || CLINIC_INFO.whatsappUrl,
      secondaryPhoneDisplay: data.secondary_phone_display || CLINIC_INFO.secondaryPhoneDisplay,
      secondaryPhoneTel: data.secondary_phone_tel || CLINIC_INFO.secondaryPhoneTel,
      secondaryWhatsappUrl: data.secondary_whatsapp_url || CLINIC_INFO.secondaryWhatsappUrl,
      facebookUrl: data.facebook_url || CLINIC_INFO.facebookUrl,
      instagramUrl: data.instagram_url || CLINIC_INFO.instagramUrl,
      hours: data.opening_hours || CLINIC_INFO.hours,
      emergencyNote: data.emergency_note || CLINIC_INFO.emergencyNote,
      // Pass raw db fields as well
      ...data,
    };
  } catch {
    return CLINIC_INFO;
  }
}

export async function getPublicStaff(): Promise<TeamMember[]> {
  try {
    const supabase = createPublicServerClient();
    if (!supabase) return CLINIC_TEAM;

    const { data, error } = await (supabase.from("staff") as any)
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return CLINIC_TEAM;
    }

    return data.map((item: any) => ({
      id: item.slug || item.id,
      name: item.name,
      credentials: item.credentials,
      role: item.role,
      genderBadge: item.gender_badge || undefined,
      gender_badge: item.gender_badge,
      image: item.image_path,
      image_path: item.image_path,
      alt: item.image_alt || `${item.name} portrait`,
      image_alt: item.image_alt,
      bio: item.bio,
      specialties: Array.isArray(item.specialties) ? item.specialties : [],
      sort_order: item.sort_order,
      is_published: item.is_published,
      _dbId: item.id,
    }));
  } catch {
    return CLINIC_TEAM;
  }
}

export async function getPublicServices(): Promise<ClinicService[]> {
  try {
    const supabase = createPublicServerClient();
    if (!supabase) return CLINIC_SERVICES;

    const { data, error } = await (supabase.from("services") as any)
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return CLINIC_SERVICES;
    }

    return data.map((item: any) => ({
      id: item.slug || item.id,
      number: item.service_number || "01",
      service_number: item.service_number,
      title: item.title,
      slug: item.slug,
      shortDesc: item.short_desc,
      short_desc: item.short_desc,
      fullDesc: item.full_desc,
      full_desc: item.full_desc,
      indications: Array.isArray(item.indications) ? item.indications : [],
      clinicalApproach: item.clinical_approach || "",
      clinical_approach: item.clinical_approach,
      image: item.image_path,
      image_path: item.image_path,
      alt: item.image_alt || `${item.title} procedure`,
      image_alt: item.image_alt,
      category: item.category,
      sort_order: item.sort_order,
      is_published: item.is_published,
      _dbId: item.id,
    }));
  } catch {
    return CLINIC_SERVICES;
  }
}

export async function getPublicCases(): Promise<ClientCase[]> {
  try {
    const supabase = createPublicServerClient();
    if (!supabase) return CLIENT_CASES;

    const { data, error } = await (supabase.from("projects") as any)
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return CLIENT_CASES;
    }

    return data.map((item: any) => ({
      id: item.slug || item.id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      image: item.image_path,
      image_path: item.image_path,
      alt: item.image_alt || `${item.title} clinical case`,
      image_alt: item.image_alt,
      clinicalSummary: item.clinical_summary,
      clinical_summary: item.clinical_summary,
      procedureNotes: item.procedure_notes,
      procedure_notes: item.procedure_notes,
      modality: item.modality,
      diagnosticMethod: item.diagnostic_method,
      diagnostic_method: item.diagnostic_method,
      sort_order: item.sort_order,
      is_published: item.is_published,
      _dbId: item.id,
    }));
  } catch {
    return CLIENT_CASES;
  }
}

export interface PatientReview {
  id: string;
  patient_name: string;
  rating: number;
  treatment_type: string | null;
  review_text: string;
  location: string | null;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
  _dbId?: string;
}

export const DEFAULT_REVIEWS: PatientReview[] = [];

export async function getPublicReviews(): Promise<PatientReview[]> {
  try {
    const supabase = createPublicServerClient();
    if (!supabase) return DEFAULT_REVIEWS;

    const { data, error } = await (supabase.from("patient_reviews") as any)
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_REVIEWS;
    }

    return data.map((item: any) => ({
      id: item.id,
      patient_name: item.patient_name,
      rating: item.rating,
      treatment_type: item.treatment_type,
      review_text: item.review_text,
      location: item.location,
      status: item.status,
      created_at: item.created_at,
      _dbId: item.id,
    }));
  } catch {
    return DEFAULT_REVIEWS;
  }
}
