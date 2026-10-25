"use server";

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { revalidatePath } from "next/cache";
import type { Database, ServiceCategory } from "@/types/database";

export interface CmsResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface StaffInput {
  name: string;
  credentials: string;
  role: string;
  bio: string;
  specialties?: string[];
  image_path: string;
  image_alt?: string;
  gender_badge?: string;
  sort_order?: number;
  is_published?: boolean;
}

export interface ServiceInput {
  service_number?: string;
  title: string;
  category: ServiceCategory;
  short_desc: string;
  full_desc: string;
  indications?: string[];
  clinical_approach?: string;
  image_path: string;
  image_alt?: string;
  sort_order?: number;
  is_published?: boolean;
}

export interface CaseInput {
  title: string;
  category: string;
  modality: string;
  diagnostic_method: string;
  clinical_summary: string;
  procedure_notes: string;
  image_path: string;
  image_alt?: string;
  sort_order?: number;
  is_published?: boolean;
}

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requireAdmin() {
  const auth = await verifyAdminSession();
  if (auth.status !== "authenticated") {
    return { ok: false as const, message: "Authorization required. Please sign in to an active administrative account." };
  }

  if (auth.profile.role !== "admin" && auth.profile.role !== "surgeon") {
    return {
      ok: false as const,
      message: "Insufficient permissions: Administrative or surgical credentials required to modify clinic content.",
    };
  }

  // 1. Try service-role administrative client first if configured (bypasses RLS)
  const adminClient = createAdminClient();
  if (adminClient) {
    return { ok: true as const, client: adminClient as any, auth, isServiceRole: true };
  }

  // 2. Fall back to authenticated SSR server client with the admin's session cookies.
  // Database and storage RLS policies allow full management to authenticated users where public.is_admin() is true.
  const serverClient = await createServerSupabaseClient();
  if (serverClient) {
    return { ok: true as const, client: serverClient as any, auth, isServiceRole: false };
  }

  return { ok: false as const, message: "Supabase connection unavailable. Please verify your Supabase environment variables." };
}

// ============================================================================
// STAFF ACTIONS
// ============================================================================

export async function getAdminStaffAction(): Promise<CmsResponse<any[]>> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  const { data, error } = await (r.client.from("staff") as any)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Staff retrieved.", data: data || [] };
}

export async function createStaffAction(input: StaffInput): Promise<CmsResponse<any>> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!input.name?.trim() || !input.credentials?.trim() || !input.role?.trim() || !input.bio?.trim()) {
    return { success: false, message: "Name, credentials, role, and biography are required." };
  }

  if (!input.image_path?.trim()) {
    return { success: false, message: "Staff portrait image is required." };
  }

  const baseSlug = slugify(`${input.name} ${input.credentials}`);
  const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const newStaff = {
    slug: uniqueSlug,
    name: input.name.trim(),
    credentials: input.credentials.trim(),
    role: input.role.trim(),
    gender_badge: input.gender_badge?.trim() || null,
    bio: input.bio.trim(),
    specialties: input.specialties || [],
    image_path: input.image_path.trim(),
    image_alt: input.image_alt?.trim() || `${input.name.trim()} portrait`,
    sort_order: typeof input.sort_order === "number" ? input.sort_order : 10,
    is_published: input.is_published !== undefined ? input.is_published : true,
  };

  const { data, error } = await (r.client.from("staff") as any)
    .insert(newStaff)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");

  return { success: true, message: "Staff member added successfully.", data };
}

export async function updateStaffAction(id: string, input: Partial<StaffInput>): Promise<CmsResponse<any>> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!id) return { success: false, message: "Staff ID is required." };

  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.credentials !== undefined) updates.credentials = input.credentials.trim();
  if (input.role !== undefined) updates.role = input.role.trim();
  if (input.bio !== undefined) updates.bio = input.bio.trim();
  if (input.gender_badge !== undefined) updates.gender_badge = input.gender_badge?.trim() || null;
  if (input.specialties !== undefined) updates.specialties = input.specialties;
  if (input.image_path !== undefined) updates.image_path = input.image_path.trim();
  if (input.image_alt !== undefined) updates.image_alt = input.image_alt?.trim() || null;
  if (input.sort_order !== undefined) updates.sort_order = input.sort_order;
  if (input.is_published !== undefined) updates.is_published = input.is_published;

  const idOrSlug = id.trim();
  const query = (r.client.from("staff") as any).update(updates);
  let { data, error } = await (isUuid(idOrSlug)
    ? query.eq("id", idOrSlug)
    : query.eq("slug", idOrSlug)
  )
    .select()
    .maybeSingle();

  if (error) {
    console.error("[updateStaffAction] Supabase error:", error.message, "| id:", idOrSlug);
    return { success: false, message: error.message };
  }

  // If no row matched
  if (!data) {
    if (isUuid(idOrSlug)) {
      console.error("[updateStaffAction] No row matched UUID:", idOrSlug);
      return { success: false, message: "Record not found; refresh and try again." };
    }

    // Preserve slug-based insert only for static manifest records with full details; never create placeholders
    if (!input.name?.trim() || !input.credentials?.trim() || !input.role?.trim() || !input.bio?.trim()) {
      return {
        success: false,
        message: "Faculty record not found. Full details (name, credentials, role, bio) are required to create a new record.",
      };
    }

    const newStaff = {
      slug: idOrSlug,
      name: input.name.trim(),
      credentials: input.credentials.trim(),
      role: input.role.trim(),
      gender_badge: input.gender_badge?.trim() || null,
      bio: input.bio.trim(),
      specialties: input.specialties || [],
      image_path: input.image_path?.trim() || "/media/logo.jpeg",
      image_alt: input.image_alt?.trim() || `${input.name.trim()} portrait`,
      sort_order: typeof input.sort_order === "number" ? input.sort_order : 10,
      is_published: input.is_published !== undefined ? input.is_published : true,
    };
    const { data: inserted, error: insertError } = await (r.client.from("staff") as any)
      .insert(newStaff)
      .select()
      .maybeSingle();

    if (insertError) {
      return { success: false, message: insertError.message };
    }
    data = inserted;
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");

  return { success: true, message: "Staff member updated successfully.", data };
}

export async function deleteStaffAction(id: string): Promise<CmsResponse> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!id) return { success: false, message: "Staff ID is required." };

  const idOrSlug = id.trim();
  const query = (r.client.from("staff") as any).delete();
  const { error } = await (isUuid(idOrSlug)
    ? query.eq("id", idOrSlug)
    : query.eq("slug", idOrSlug)
  );

  if (error) {
    console.error("[deleteStaffAction] Supabase error:", error.message, "| id:", idOrSlug);
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");

  return { success: true, message: "Staff member deleted successfully." };
}

// ============================================================================
// SERVICES ACTIONS
// ============================================================================

export async function getAdminServicesAction(): Promise<CmsResponse<any[]>> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  const { data, error } = await (r.client.from("services") as any)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Services retrieved.", data: data || [] };
}

export async function createServiceAction(input: ServiceInput): Promise<CmsResponse<any>> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!input.title?.trim() || !input.category || !input.short_desc?.trim() || !input.full_desc?.trim()) {
    return { success: false, message: "Title, category, summary, and full description are required." };
  }

  if (!input.image_path?.trim()) {
    return { success: false, message: "Service clinical image is required." };
  }

  // Derive service number if not provided
  let serviceNumber = input.service_number?.trim();
  if (!serviceNumber) {
    const { data: latest } = await (r.client.from("services") as any)
      .select("service_number")
      .order("sort_order", { ascending: false })
      .limit(1);
    const count = (latest?.length ? parseInt(latest[0].service_number, 10) || 0 : 0) + 1;
    serviceNumber = String(count).padStart(2, "0");
  }

  const baseSlug = slugify(input.title);
  const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const newService = {
    service_number: serviceNumber,
    slug: uniqueSlug,
    title: input.title.trim(),
    category: input.category,
    short_desc: input.short_desc.trim(),
    full_desc: input.full_desc.trim(),
    indications: input.indications || [],
    clinical_approach: input.clinical_approach?.trim() || null,
    image_path: input.image_path.trim(),
    image_alt: input.image_alt?.trim() || `${input.title.trim()} procedure`,
    sort_order: typeof input.sort_order === "number" ? input.sort_order : 10,
    is_published: input.is_published !== undefined ? input.is_published : true,
  };

  const { data, error } = await (r.client.from("services") as any)
    .insert(newService)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin");

  return { success: true, message: "Service procedure created successfully.", data };
}

export async function updateServiceAction(id: string, input: Partial<ServiceInput>): Promise<CmsResponse<any>> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!id) return { success: false, message: "Service ID is required." };

  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.service_number !== undefined) updates.service_number = input.service_number.trim();
  if (input.category !== undefined) updates.category = input.category;
  if (input.short_desc !== undefined) updates.short_desc = input.short_desc.trim();
  if (input.full_desc !== undefined) updates.full_desc = input.full_desc.trim();
  if (input.indications !== undefined) updates.indications = input.indications;
  if (input.clinical_approach !== undefined) updates.clinical_approach = input.clinical_approach?.trim() || null;
  if (input.image_path !== undefined) updates.image_path = input.image_path.trim();
  if (input.image_alt !== undefined) updates.image_alt = input.image_alt?.trim() || null;
  if (input.sort_order !== undefined) updates.sort_order = input.sort_order;
  if (input.is_published !== undefined) updates.is_published = input.is_published;

  const idOrSlug = id.trim();
  const query = (r.client.from("services") as any).update(updates);
  let { data, error } = await (isUuid(idOrSlug)
    ? query.eq("id", idOrSlug)
    : query.eq("slug", idOrSlug)
  )
    .select()
    .maybeSingle();

  if (error) {
    console.error("[updateServiceAction] Supabase error:", error.message, "| id:", idOrSlug);
    return { success: false, message: error.message };
  }

  // If no row matched
  if (!data) {
    if (isUuid(idOrSlug)) {
      console.error("[updateServiceAction] No row matched UUID:", idOrSlug);
      return { success: false, message: "Record not found; refresh and try again." };
    }

    // Preserve slug-based insert only for static manifest records with full details; never create placeholders
    if (!input.title?.trim() || !input.category || !input.short_desc?.trim() || !input.full_desc?.trim()) {
      return {
        success: false,
        message: "Service record not found. Full details (title, category, short description, full description) are required to create a new procedure.",
      };
    }

    const newService = {
      service_number: input.service_number?.trim() || "01",
      slug: idOrSlug,
      title: input.title.trim(),
      category: input.category,
      short_desc: input.short_desc.trim(),
      full_desc: input.full_desc.trim(),
      indications: input.indications || [],
      clinical_approach: input.clinical_approach?.trim() || null,
      image_path: input.image_path?.trim() || "/media/logo.jpeg",
      image_alt: input.image_alt?.trim() || `${input.title.trim()} procedure`,
      sort_order: typeof input.sort_order === "number" ? input.sort_order : 10,
      is_published: input.is_published !== undefined ? input.is_published : true,
    };
    const { data: inserted, error: insertError } = await (r.client.from("services") as any)
      .insert(newService)
      .select()
      .maybeSingle();

    if (insertError) {
      return { success: false, message: insertError.message };
    }
    data = inserted;
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin");

  return { success: true, message: "Service procedure updated successfully.", data };
}

export async function deleteServiceAction(id: string): Promise<CmsResponse> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!id) return { success: false, message: "Service ID is required." };

  const idOrSlug = id.trim();
  const query = (r.client.from("services") as any).delete();
  const { error } = await (isUuid(idOrSlug)
    ? query.eq("id", idOrSlug)
    : query.eq("slug", idOrSlug)
  );

  if (error) {
    console.error("[deleteServiceAction] Supabase error:", error.message, "| id:", idOrSlug);
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin");

  return { success: true, message: "Service procedure removed successfully." };
}

// ============================================================================
// CASES (PROJECTS) ACTIONS
// ============================================================================

export async function getAdminCasesAction(): Promise<CmsResponse<any[]>> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  const { data, error } = await (r.client.from("projects") as any)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Cases retrieved.", data: data || [] };
}

export async function createCaseAction(input: CaseInput): Promise<CmsResponse<any>> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (
    !input.title?.trim() ||
    !input.category?.trim() ||
    !input.modality?.trim() ||
    !input.diagnostic_method?.trim() ||
    !input.clinical_summary?.trim() ||
    !input.procedure_notes?.trim()
  ) {
    return {
      success: false,
      message: "Title, category, modality, diagnostic method, summary, and procedure notes are required.",
    };
  }

  if (!input.image_path?.trim()) {
    return { success: false, message: "Case radiographic / photographic image is required." };
  }

  const baseSlug = slugify(input.title);
  const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const newCase = {
    slug: uniqueSlug,
    title: input.title.trim(),
    category: input.category.trim(),
    modality: input.modality.trim(),
    diagnostic_method: input.diagnostic_method.trim(),
    clinical_summary: input.clinical_summary.trim(),
    procedure_notes: input.procedure_notes.trim(),
    image_path: input.image_path.trim(),
    image_alt: input.image_alt?.trim() || `${input.title.trim()} clinical record`,
    sort_order: typeof input.sort_order === "number" ? input.sort_order : 10,
    is_published: input.is_published !== undefined ? input.is_published : true,
  };

  const { data, error } = await (r.client.from("projects") as any)
    .insert(newCase)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/client-work");
  revalidatePath("/admin");

  return { success: true, message: "Clinical case documented successfully.", data };
}

export async function updateCaseAction(id: string, input: Partial<CaseInput>): Promise<CmsResponse<any>> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!id) return { success: false, message: "Case ID is required." };

  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.category !== undefined) updates.category = input.category.trim();
  if (input.modality !== undefined) updates.modality = input.modality.trim();
  if (input.diagnostic_method !== undefined) updates.diagnostic_method = input.diagnostic_method.trim();
  if (input.clinical_summary !== undefined) updates.clinical_summary = input.clinical_summary.trim();
  if (input.procedure_notes !== undefined) updates.procedure_notes = input.procedure_notes.trim();
  if (input.image_path !== undefined) updates.image_path = input.image_path.trim();
  if (input.image_alt !== undefined) updates.image_alt = input.image_alt?.trim() || null;
  if (input.sort_order !== undefined) updates.sort_order = input.sort_order;
  if (input.is_published !== undefined) updates.is_published = input.is_published;

  const idOrSlug = id.trim();
  const query = (r.client.from("projects") as any).update(updates);
  let { data, error } = await (isUuid(idOrSlug)
    ? query.eq("id", idOrSlug)
    : query.eq("slug", idOrSlug)
  )
    .select()
    .maybeSingle();

  if (error) {
    console.error("[updateCaseAction] Supabase error:", error.message, "| id:", idOrSlug);
    return { success: false, message: error.message };
  }

  // If no row matched
  if (!data) {
    if (isUuid(idOrSlug)) {
      console.error("[updateCaseAction] No row matched UUID:", idOrSlug);
      return { success: false, message: "Record not found; refresh and try again." };
    }

    // Preserve slug-based insert only for static manifest records with full details; never create placeholders
    if (
      !input.title?.trim() ||
      !input.category?.trim() ||
      !input.modality?.trim() ||
      !input.diagnostic_method?.trim() ||
      !input.clinical_summary?.trim() ||
      !input.procedure_notes?.trim()
    ) {
      return {
        success: false,
        message: "Clinical case record not found. Complete details (title, category, modality, diagnostic method, summary, procedure notes) are required to create a new case.",
      };
    }

    const newCase = {
      slug: idOrSlug,
      title: input.title.trim(),
      category: input.category.trim(),
      modality: input.modality.trim(),
      diagnostic_method: input.diagnostic_method.trim(),
      clinical_summary: input.clinical_summary.trim(),
      procedure_notes: input.procedure_notes.trim(),
      image_path: input.image_path?.trim() || "/media/logo.jpeg",
      image_alt: input.image_alt?.trim() || `${input.title.trim()} record`,
      sort_order: typeof input.sort_order === "number" ? input.sort_order : 10,
      is_published: input.is_published !== undefined ? input.is_published : true,
    };
    const { data: inserted, error: insertError } = await (r.client.from("projects") as any)
      .insert(newCase)
      .select()
      .maybeSingle();

    if (insertError) {
      return { success: false, message: insertError.message };
    }
    data = inserted;
  }

  revalidatePath("/");
  revalidatePath("/client-work");
  revalidatePath("/admin");

  return { success: true, message: "Clinical case updated successfully.", data };
}

export async function deleteCaseAction(id: string): Promise<CmsResponse> {
  const r = await requireAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!id) return { success: false, message: "Case ID is required." };

  const idOrSlug = id.trim();
  const query = (r.client.from("projects") as any).delete();
  const { error } = await (isUuid(idOrSlug)
    ? query.eq("id", idOrSlug)
    : query.eq("slug", idOrSlug)
  );

  if (error) {
    console.error("[deleteCaseAction] Supabase error:", error.message, "| id:", idOrSlug);
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/client-work");
  revalidatePath("/admin");

  return { success: true, message: "Clinical case record removed successfully." };
}

// ============================================================================
// STORAGE IMAGE UPLOAD ACTION
// ============================================================================

export async function uploadClinicMediaAction(formData: FormData): Promise<CmsResponse<{ url: string; path: string }>> {
  try {
    const r = await requireAdmin();
    if (!r.ok) return { success: false, message: r.message };

    if (!formData) {
      return { success: false, message: "No form data provided." };
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, message: "No image file provided for upload." };
    }

    // Validate file size: 4.5MB limit to prevent Vercel Serverless payload drops
    const MAX_SIZE_BYTES = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return {
        success: false,
        message: `Image exceeds 4.5MB size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose an image under 4.5MB for web display.`,
      };
    }

    // Validate MIME type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: `Unsupported file type (${file.type || "unknown"}). Allowed: JPG, PNG, WEBP, SVG, GIF.`,
      };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const sanitizedName = (file.name || "image")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .slice(0, 32);
    const storagePath = `cms/${Date.now()}_${sanitizedName}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await r.client.storage
      .from("clinic-media")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      const msg = uploadError.message || "";
      if (
        msg.toLowerCase().includes("bucket not found") ||
        (uploadError as any)?.statusCode === "404" ||
        (uploadError as any)?.error === "Bucket not found"
      ) {
        return {
          success: false,
          message:
            "Supabase Storage bucket 'clinic-media' not found. Please create a public bucket named 'clinic-media' in your Supabase Dashboard Storage section, or run migration 003_storage_buckets.sql.",
        };
      }
      if (
        msg.toLowerCase().includes("row-level security") ||
        msg.toLowerCase().includes("policy") ||
        (uploadError as any)?.statusCode === "403"
      ) {
        return {
          success: false,
          message:
            "Storage upload permission denied by RLS policy. Verify your administrator user is active in public.admin_users and migration 003_storage_buckets.sql has been applied.",
        };
      }
      console.error("[uploadClinicMediaAction] Storage error:", uploadError.message, "| statusCode:", (uploadError as any)?.statusCode, "| path:", storagePath);
      return { success: false, message: `Storage upload failed: ${msg}` };
    }

    const { data: publicUrlData } = r.client.storage
      .from("clinic-media")
      .getPublicUrl(storagePath);

    return {
      success: true,
      message: "Media uploaded successfully.",
      data: {
        url: publicUrlData.publicUrl,
        path: storagePath,
      },
    };
  } catch (err: any) {
    console.error("[uploadClinicMediaAction] Unexpected error:", err);
    return {
      success: false,
      message: `Upload failed: ${err?.message || "Unexpected server error during upload."}`,
    };
  }
}
