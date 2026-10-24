-- ==============================================================================
-- BMK Dental & Maxillofacial Clinic — Migration 003: Storage Buckets & Policies
-- ==============================================================================

-- 1. Create Public Storage Bucket for Clinic Media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'clinic-media',
  'clinic-media',
  true,
  52428800, -- 50MB limit (accommodates high-res radiographs and clinical videos)
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- 2. Storage RLS Policies for clinic-media Bucket
-- Anyone can view published clinic media files
CREATE POLICY "clinic_media_public_read"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'clinic-media');

-- Only verified clinic administrators can upload media assets
CREATE POLICY "clinic_media_admin_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'clinic-media'
    AND public.is_admin()
  );

-- Only verified clinic administrators can update or replace media assets
CREATE POLICY "clinic_media_admin_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'clinic-media'
    AND public.is_admin()
  );

-- Only verified clinic administrators can delete media assets
CREATE POLICY "clinic_media_admin_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'clinic-media'
    AND public.is_admin()
  );
