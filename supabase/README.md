# BMK Dental & Maxillofacial Clinic — Backend & Database Documentation

This directory contains the database schema, Row Level Security (RLS) policies, storage bucket configurations, and seed scripts for **BMK Dental & Maxillofacial Clinic**.

---

## 1. Architecture Overview

* **Database**: Supabase PostgreSQL with extensions (`uuid-ossp`, `pgcrypto`).
* **Authentication**: Supabase Auth (email/password with strict server-side RBAC; no public self-registration).
* **Storage**: Supabase Storage bucket `clinic-media` with strict public-read / admin-write policies.
* **Server Architecture**: Next.js App Router (TypeScript) with `@supabase/ssr` for cookie-based session handling and server actions.

---

## 2. Environment Setup

### Local Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
2. Retrieve your credentials from the **[Supabase Dashboard](https://supabase.com/dashboard)** under **Project Settings → API**:
   * `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   * `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `service_role secret key` → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **SECURITY WARNING**:  
> `SUPABASE_SERVICE_ROLE_KEY` has full administrative database privileges.  
> It is strictly imported in `src/lib/supabase/admin.ts` using `import "server-only";` and must **NEVER** be committed to version control, exposed to browser bundles, or logged.

---

## 3. Database Migrations (Run in Supabase SQL Editor)

Run the SQL migration scripts located in `supabase/migrations/` in sequential order:

### Migration 1: `001_initial_schema.sql`
Creates core tables, foreign keys, check constraints, automatic `updated_at` triggers, and indexing:
* `admin_users`: Authorized clinical staff and administrative accounts.
* `site_settings`: Global clinic information, emergency phone, WhatsApp, opening hours.
* `pages`: Editable CMS content for Home and About Us pages.
* `staff`: Surgeon credentials, biographies, clinical specialties, and image paths.
* `services`: 10 clinical disciplines, indications, and clinical approach notes.
* `projects`: 10 documented clinical cases, modalities, and intraoperative notes.
* `appointments`: Patient appointment requests with validation and triage status.
* `notification_logs`: Triage audit trail for phone calls, WhatsApp, and internal logs.

### Migration 2: `002_rls_security_policies.sql`
Enables Row Level Security on **all 8 tables** and implements security definer helper functions:
* `public.is_admin()`: Confirms the authenticated user has `admin` or `surgeon` privileges in `public.admin_users`.
* `public.is_clinic_staff()`: Confirms the user is active staff.
* **Public Access**: Can read only published content (`is_published = true`).
* **Appointment Protection**: Anonymous visitors **can never read** appointment records or logs. They can only submit a pending request with mandatory consent.
* **Staff Access**: Authorized clinic staff can review appointments, triage incoming requests, and manage content.

### Migration 3: `003_storage_buckets.sql`
Initializes the `clinic-media` storage bucket:
* Sets public access for published clinical photography, staff portraits, and facility videos.
* Enforces that only authorized administrators (`is_admin()`) can upload, replace, or delete assets.

### Migration 4: `004_seed_clinic_data.sql`
Seeds all verified clinic information safely using `ON CONFLICT DO UPDATE`:
* **Site Settings**: Official address at Quaid-E-Azam Medical Complex, Hyderabad, phone `03332760510`, hours `Mon–Sat: 4:00 PM – 10:00 PM`.
* **Clinical Faculty**: Dr Vishal Lohana (FCPS, BDS), Dr Jotika (BDS, RDS), Mr Parboo Malu (D.S.A. Technician), and Mr Touheed Hussain (Dental Hygienist).
* **Services**: All 10 existing clinical procedures.
* **Cases**: All 10 documented clinical cases.

---

## 4. Manual Configuration Steps in Supabase Dashboard

1. **Create Project**:
   * Navigate to [https://supabase.com](https://supabase.com) and create a project in your preferred region.
2. **Execute Migrations**:
   * Open **SQL Editor** in the dashboard.
   * Paste and run the contents of each migration file in order (`001`, `002`, `003`, `004`).
3. **Disable Public Sign-ups**:
   * Go to **Authentication → Providers → Email**.
   * Toggle **OFF** "Enable sign ups" (this prevents unauthorized users from registering as administrators).
4. **Create First Administrator**:
   * Go to **Authentication → Users** and click **Add User → Create user**.
   * Enter the admin email and a strong password (e.g., `drvishal@bmkdentalclinic.com`).
   * Copy the generated `User UID`.
   * Run the following query in the SQL Editor to grant admin privileges:
     ```sql
     INSERT INTO public.admin_users (id, email, full_name, role, is_active)
     VALUES (
       '<USER_UID_HERE>',
       'drvishal@bmkdentalclinic.com',
       'Dr. Vishal Lohana',
       'admin',
       true
     );
     ```

---

## 5. Security & Row Level Security (RLS) Matrix

| Table | Anonymous / Public | Authenticated Staff | Admin / Surgeon |
| :--- | :--- | :--- | :--- |
| `site_settings` | **SELECT** (All) | **SELECT** (All) | **ALL** (CRUD) |
| `pages` | **SELECT** (`is_published = true`) | **SELECT** (All) | **ALL** (CRUD) |
| `staff` | **SELECT** (`is_published = true`) | **SELECT** (All) | **ALL** (CRUD) |
| `services` | **SELECT** (`is_published = true`) | **SELECT** (All) | **ALL** (CRUD) |
| `projects` | **SELECT** (`is_published = true`) | **SELECT** (All) | **ALL** (CRUD) |
| `appointments` | **INSERT** (`status = 'pending'`, `consent = true`) | **SELECT**, **UPDATE** (Triage) | **ALL** (CRUD) |
| `notification_logs` | **NO ACCESS** | **SELECT** | **ALL** (CRUD) |
| `admin_users` | **NO ACCESS** | **SELECT** (Self) | **ALL** (CRUD) |

---

## 6. Verification Queries

After executing migrations, run these queries in the Supabase SQL Editor to verify data integrity:

```sql
-- 1. Check verified staff count (Expect 4)
SELECT COUNT(*) AS staff_count FROM public.staff;

-- 2. Check clinical services count (Expect 10)
SELECT COUNT(*) AS services_count FROM public.services;

-- 3. Check documented clinical cases count (Expect 10)
SELECT COUNT(*) AS cases_count FROM public.projects;

-- 4. Verify RLS is enabled on all tables (Expect 8 tables with rowsecurity = true)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('admin_users', 'site_settings', 'pages', 'staff', 'services', 'projects', 'appointments', 'notification_logs');
```
