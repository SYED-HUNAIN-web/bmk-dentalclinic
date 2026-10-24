# BMK Dental & Maxillofacial Clinic

A distinctive, high-craft editorial web application and backend platform for **BMK Dental & Maxillofacial Clinic**, led by **Dr Vishal Lohana (FCPS, BDS)** in Saddar, Hyderabad, Pakistan.

---

## 1. Technology Stack

* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS with custom editorial design tokens
* **Typography**: *Cormorant Garamond* (display serif) + *Plus Jakarta Sans* (body sans)
* **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS)
* **Storage**: Supabase Storage bucket (`clinic-media`)
* **Icons**: Lucide React

---

## 2. Getting Started

### Prerequisites

* Node.js v18+ (tested on Node v24.15.0)
* npm v10+

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials to `.env.local` (see [supabase/README.md](supabase/README.md) for step-by-step instructions).

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the website.

4. Build for production:
   ```bash
   npm run build
   npm run start
   ```

---

## 3. Database & Backend Architecture

The backend foundation is built on Supabase PostgreSQL with strict Row Level Security (RLS):

* **SQL Migrations**: Located in `supabase/migrations/`:
  * `001_initial_schema.sql` — Schema definitions for `site_settings`, `pages`, `staff`, `services`, `projects`, `appointments`, `notification_logs`, and `admin_users`.
  * `002_rls_security_policies.sql` — RLS policies enforcing public read restrictions and zero public access to patient appointment records.
  * `003_storage_buckets.sql` — Storage bucket configuration for clinical photography and media.
  * `004_seed_clinic_data.sql` — Safe, repeatable seed data for verified clinic settings, 4 staff members, all 10 services, and 10 clinical cases.

* **Client Utilities**:
  * `src/lib/supabase/client.ts` — Browser-side client using public anon key.
  * `src/lib/supabase/server.ts` — Server-side client using cookie authentication.
  * `src/lib/supabase/admin.ts` — Isolated server-only client using `SUPABASE_SERVICE_ROLE_KEY`.
  * `src/lib/validations/appointment.ts` — Server-side appointment input validator enforcing clinic hours, Sunday closure, and consent.
  * `src/app/actions/appointments.ts` — Server action for patient appointment request triage.

Detailed database documentation, security matrices, and dashboard setup instructions can be found in **[`supabase/README.md`](supabase/README.md)**.

---

## 4. Practice Information (Verified)

* **Clinic**: BMK Dental & Maxillofacial Clinic
* **Lead Surgeon**: Dr Vishal Lohana (FCPS, BDS)
* **Team**:
  * Dr Vishal Lohana (FCPS, BDS) — Consultant Oral & Maxillofacial Surgeon | Dental Surgeon
  * Dr Jotika (BDS, RDS) — Dental Surgeon (Female Dentist)
  * Mr Parboo Malu (D.S.A. Technician) — Dental Surgery Assistant & Technician
  * Mr Touheed Hussain (Dental Hygienist) — Certified Dental Hygienist
* **Official Address**: Quaid-E-Azam Medical Complex, Clinic No: MF:32, CMH Rd, Saddar, Hyderabad, 72000, Pakistan
* **Phone**: `03332760510`
* **Opening Hours**: Monday–Saturday: 4:00 PM – 10:00 PM | Sunday: Closed
* **Care Oversight**: *"Dr Vishal Lohana and his team"*
