-- ==============================================================================
-- BMK Dental & Maxillofacial Clinic — Migration 005: Patient & Visitor Reviews
-- ==============================================================================
-- Adds verified patient reviews with moderation support (status: pending, approved, rejected)
-- Public visitors can read approved reviews and submit new reviews.
-- Only active administrators / surgeons can moderate (approve/reject), edit, or delete reviews.
-- ==============================================================================

-- 1. Create patient_reviews table
CREATE TABLE IF NOT EXISTS public.patient_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  treatment_type TEXT,
  review_text TEXT NOT NULL,
  location TEXT DEFAULT 'Hyderabad',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER update_patient_reviews_modtime
BEFORE UPDATE ON public.patient_reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for fast public queries of approved reviews
CREATE INDEX IF NOT EXISTS idx_patient_reviews_status_created 
  ON public.patient_reviews(status, created_at DESC);

-- 2. Row Level Security Policies
ALTER TABLE public.patient_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
CREATE POLICY "patient_reviews_public_select_approved"
  ON public.patient_reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Public visitors can submit pending reviews
CREATE POLICY "patient_reviews_public_insert_pending"
  ON public.patient_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Clinic administrators can view all reviews (including pending/rejected)
CREATE POLICY "patient_reviews_admin_select_all"
  ON public.patient_reviews
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Clinic administrators can update review status, text, or moderation notes
CREATE POLICY "patient_reviews_admin_update"
  ON public.patient_reviews
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Clinic administrators can delete reviews
CREATE POLICY "patient_reviews_admin_delete"
  ON public.patient_reviews
  FOR DELETE
  TO authenticated
  USING (public.is_admin());
