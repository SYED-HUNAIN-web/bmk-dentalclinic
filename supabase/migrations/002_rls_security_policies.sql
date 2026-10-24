-- ==============================================================================
-- BMK Dental & Maxillofacial Clinic — Migration 002: Row Level Security (RLS)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Helper Security Definer Functions
-- Verified against public.admin_users — does NOT trust client-supplied JWT claims alone.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'surgeon')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_clinic_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'surgeon', 'staff')
  );
$$;

-- ------------------------------------------------------------------------------
-- Enable RLS on ALL Tables
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. admin_users Policies
-- Only authenticated administrators can read the staff roster.
-- No public registration or self-elevation permitted.
-- ------------------------------------------------------------------------------
CREATE POLICY "admin_users_select_authorized"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin() OR id = auth.uid());

CREATE POLICY "admin_users_admin_manage"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 2. site_settings Policies
-- Public: Read only.
-- Admin: Full management.
-- ------------------------------------------------------------------------------
CREATE POLICY "site_settings_public_read"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "site_settings_admin_manage"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. pages Policies
-- Public: Read published pages only.
-- Admin: Read all (including drafts), insert, update, delete.
-- ------------------------------------------------------------------------------
CREATE POLICY "pages_public_read_published"
  ON public.pages
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_clinic_staff());

CREATE POLICY "pages_admin_manage"
  ON public.pages
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. staff Policies
-- Public: Read published staff only.
-- Admin: Full management.
-- ------------------------------------------------------------------------------
CREATE POLICY "staff_public_read_published"
  ON public.staff
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_clinic_staff());

CREATE POLICY "staff_admin_manage"
  ON public.staff
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. services Policies
-- Public: Read published clinical services only.
-- Admin: Full management.
-- ------------------------------------------------------------------------------
CREATE POLICY "services_public_read_published"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_clinic_staff());

CREATE POLICY "services_admin_manage"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. projects (Clinical Cases) Policies
-- Public: Read published clinical cases only. Sensitive records remain private.
-- Admin: Full management.
-- ------------------------------------------------------------------------------
CREATE POLICY "projects_public_read_published"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_clinic_staff());

CREATE POLICY "projects_admin_manage"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. appointments Policies
-- CRITICAL SECURITY:
-- Public visitors must NEVER read patient records!
-- Public visitors can only submit a pending appointment request with mandatory consent.
-- Only verified clinic staff / administrators may view and manage appointment triage.
-- ------------------------------------------------------------------------------
CREATE POLICY "appointments_public_insert_only"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consent_given = true
    AND status = 'pending'
    AND trim(patient_name) <> ''
    AND trim(patient_phone) <> ''
    AND preferred_date >= CURRENT_DATE
  );

CREATE POLICY "appointments_staff_read"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (public.is_clinic_staff());

CREATE POLICY "appointments_staff_update"
  ON public.appointments
  FOR UPDATE
  TO authenticated
  USING (public.is_clinic_staff())
  WITH CHECK (public.is_clinic_staff());

CREATE POLICY "appointments_admin_delete"
  ON public.appointments
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. notification_logs Policies
-- Public: NO ACCESS under any circumstances.
-- Clinic Staff: Read audit logs.
-- Admin: Manage audit logs.
-- ------------------------------------------------------------------------------
CREATE POLICY "notification_logs_staff_read"
  ON public.notification_logs
  FOR SELECT
  TO authenticated
  USING (public.is_clinic_staff());

CREATE POLICY "notification_logs_admin_manage"
  ON public.notification_logs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
