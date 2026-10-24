-- ==============================================================================
-- BMK Dental & Maxillofacial Clinic — Migration 001: Initial Schema
-- ==============================================================================
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Utility Trigger for Automatic updated_at Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 1. admin_users
-- Authorized clinic administrative personnel linked to Supabase Auth users.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'surgeon', 'staff')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_admin_users_modtime
BEFORE UPDATE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 2. site_settings
-- Global practice configuration, contact details, operating hours, and notices.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name TEXT NOT NULL,
  lead_surgeon TEXT NOT NULL,
  tagline TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Hyderabad',
  postal_code TEXT DEFAULT '72000',
  country TEXT NOT NULL DEFAULT 'Pakistan',
  phone_display TEXT NOT NULL,
  phone_tel TEXT NOT NULL,
  whatsapp_url TEXT NOT NULL,
  email TEXT,
  opening_hours TEXT NOT NULL,
  emergency_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_site_settings_modtime
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 3. pages
-- Editable content and meta descriptions for primary website routes.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_description TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  lead_paragraph TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pages_slug_published ON public.pages(slug, is_published);

CREATE TRIGGER update_pages_modtime
BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. staff
-- Clinical surgeons, dentists, and technical auxiliaries.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  credentials TEXT NOT NULL,
  role TEXT NOT NULL,
  gender_badge TEXT,
  bio TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  image_path TEXT NOT NULL,
  image_alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_published_sort ON public.staff(is_published, sort_order ASC);

CREATE TRIGGER update_staff_modtime
BEFORE UPDATE ON public.staff
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 5. services
-- Clinical procedures, indications, categories, and technical descriptions.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_number TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'Oral Surgery',
      'Maxillofacial Trauma & Oncology',
      'Restorative & Implantology',
      'Preventive & Endodontics'
    )
  ),
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  indications TEXT[] NOT NULL DEFAULT '{}',
  clinical_approach TEXT,
  image_path TEXT NOT NULL,
  image_alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_published_sort ON public.services(is_published, sort_order ASC);

CREATE TRIGGER update_services_modtime
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 6. projects (Clinical Cases)
-- Real surgical records, radiographic modalities, and intraoperative cases.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  modality TEXT NOT NULL,
  diagnostic_method TEXT NOT NULL,
  clinical_summary TEXT NOT NULL,
  procedure_notes TEXT NOT NULL,
  image_path TEXT NOT NULL,
  image_alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_published_sort ON public.projects(is_published, sort_order ASC);

CREATE TRIGGER update_projects_modtime
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 7. appointments
-- Patient appointment booking requests with strict data constraints.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL CHECK (char_length(trim(patient_name)) >= 2),
  patient_phone TEXT NOT NULL CHECK (char_length(trim(patient_phone)) >= 7),
  patient_email TEXT,
  preferred_date DATE NOT NULL,
  preferred_time_slot TEXT NOT NULL,
  dental_concern TEXT NOT NULL CHECK (char_length(trim(dental_concern)) >= 5),
  consent_given BOOLEAN NOT NULL DEFAULT false CHECK (consent_given = true),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  is_triage_urgent BOOLEAN NOT NULL DEFAULT false,
  internal_notes TEXT,
  notification_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_status_date ON public.appointments(status, preferred_date DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON public.appointments(created_at DESC);

CREATE TRIGGER update_appointments_modtime
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 8. notification_logs
-- Audit trail of telephone triage reminders, SMS, or WhatsApp dispatch.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('phone_call', 'whatsapp', 'email', 'sms', 'internal')),
  recipient TEXT NOT NULL,
  delivery_status TEXT NOT NULL CHECK (delivery_status IN ('queued', 'sent', 'delivered', 'failed')),
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_appointment ON public.notification_logs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON public.notification_logs(created_at DESC);
