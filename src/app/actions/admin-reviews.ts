"use server";

import { revalidatePath } from "next/cache";
import { createPublicServerClient } from "@/lib/supabase/public";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ReviewSubmissionInput {
  patient_name: string;
  rating: number;
  treatment_type?: string;
  review_text: string;
  location?: string;
}

export interface ReviewModerateInput {
  id: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
  patient_name?: string;
  treatment_type?: string;
  review_text?: string;
  rating?: number;
}

export interface ReviewActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Public Server Action: Submit a patient review (always queued as 'pending' for moderation)
 */
export async function submitPublicReviewAction(
  input: ReviewSubmissionInput
): Promise<ReviewActionResponse> {
  const name = input.patient_name?.trim();
  const text = input.review_text?.trim();
  const rating = Number(input.rating);

  if (!name || name.length < 2) {
    return { success: false, message: "Please provide your name (at least 2 characters)." };
  }
  if (!text || text.length < 10) {
    return { success: false, message: "Please write a review with at least 10 characters." };
  }
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, message: "Please provide a star rating between 1 and 5." };
  }

  // Use public server client to respect RLS (public insert with status='pending')
  const supabase = createPublicServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Database service temporarily unconfigured. Please try again later.",
    };
  }

  const { data, error } = await (supabase.from("patient_reviews") as any)
    .insert({
      patient_name: name,
      rating: Math.round(rating),
      treatment_type: input.treatment_type?.trim() || null,
      review_text: text,
      location: input.location?.trim() || "Hyderabad",
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[submitPublicReviewAction] Supabase error:", error.message);
    return {
      success: false,
      message: "Unable to submit your review at this time. Please try again.",
    };
  }

  return {
    success: true,
    message: "Thank you for your feedback! Your review has been submitted for moderation and will appear publicly once verified by our clinic team.",
    data,
  };
}

/**
 * Helper to ensure privileged admin client
 */
async function requireReviewAdmin() {
  const auth = await verifyAdminSession();
  if (auth.status !== "authenticated" || !auth.profile) {
    return { ok: false as const, message: "Unauthorized. Administrator session required." };
  }
  if (auth.profile.role !== "admin" && auth.profile.role !== "surgeon") {
    return { ok: false as const, message: "Forbidden. Admin or Surgeon role required." };
  }

  const adminClient = createAdminClient();
  if (adminClient) {
    return { ok: true as const, client: adminClient as any, auth };
  }

  const serverClient = await createServerSupabaseClient();
  if (serverClient) {
    return { ok: true as const, client: serverClient as any, auth };
  }

  return { ok: false as const, message: "Supabase connection unavailable." };
}

/**
 * Admin Server Action: Retrieve all reviews for moderation
 */
export async function getAdminReviewsAction(): Promise<ReviewActionResponse> {
  const r = await requireReviewAdmin();
  if (!r.ok) return { success: false, message: r.message };

  const { data, error } = await (r.client.from("patient_reviews") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Reviews retrieved.", data: data || [] };
}

/**
 * Admin Server Action: Moderate / update a review
 */
export async function moderateReviewAction(
  input: ReviewModerateInput
): Promise<ReviewActionResponse> {
  const r = await requireReviewAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!input.id) {
    return { success: false, message: "Review ID is required." };
  }

  const updates: Record<string, any> = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.admin_notes !== undefined) updates.admin_notes = input.admin_notes;
  if (input.patient_name !== undefined) updates.patient_name = input.patient_name.trim();
  if (input.treatment_type !== undefined) updates.treatment_type = input.treatment_type?.trim() || null;
  if (input.review_text !== undefined) updates.review_text = input.review_text.trim();
  if (input.rating !== undefined) updates.rating = Math.max(1, Math.min(5, Math.round(input.rating)));

  const { data, error } = await (r.client.from("patient_reviews") as any)
    .update(updates)
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    success: true,
    message: `Review updated to '${input.status}'.`,
    data,
  };
}

/**
 * Admin Server Action: Delete a review
 */
export async function deleteReviewAction(id: string): Promise<ReviewActionResponse> {
  const r = await requireReviewAdmin();
  if (!r.ok) return { success: false, message: r.message };

  if (!id) {
    return { success: false, message: "Review ID is required." };
  }

  const { error } = await (r.client.from("patient_reviews") as any)
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true, message: "Review deleted successfully." };
}
