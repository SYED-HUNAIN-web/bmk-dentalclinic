import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyAdminSession } from "@/lib/supabase/auth-guard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { CLINIC_INFO, CLINIC_TEAM, CLINIC_SERVICES, CLIENT_CASES } from "@/data/mediaManifest";
import {
  Lock,
  Database,
  Key,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Terminal,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Admin Operations & Triage | BMK Dental & Maxillofacial Clinic",
  description: "Internal surgical administration, appointment triage, and content management suite.",
};

export default async function AdminPage() {
  const auth = await verifyAdminSession();

  // CASE 1: Database environment unconfigured
  if (auth.status === "unconfigured") {
    return (
      <div className="min-h-[85vh] bg-[#F7F5EF] dark:bg-[#0A1B14] py-16 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-8 sm:p-10 shadow-lg relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#B69A61]" />

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#103629] dark:bg-[#071510] text-[#B69A61]">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
                  System Initialization
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                  Supabase Database Configuration Required
                </h1>
              </div>
            </div>

            <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed mb-6">
              The backend schema, Row Level Security policies, storage bucket rules, and appointment server actions are fully engineered. To connect this live portal to your Supabase PostgreSQL database, follow the three setup steps below.
            </p>

            {/* Setup Steps */}
            <div className="space-y-6 pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234]">
              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#103629] dark:text-[#F7F5EF] uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-[#103629] dark:bg-[#B69A61] text-[#F7F5EF] dark:text-[#0A1B14] flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  <span>Set Environment Credentials in <code>.env.local</code></span>
                </div>
                <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans pl-7">
                  Obtain your Supabase Project URL and API Keys from <strong>Project Settings → API</strong> in your Supabase dashboard, then create or update <code>.env.local</code> in the clinic folder:
                </p>
                <div className="pl-7">
                  <pre className="p-3 bg-[#103629] dark:bg-[#071510] text-[#F7F5EF] text-[11px] font-mono overflow-x-auto rounded-none border border-[#174635] dark:border-[#1E4234]">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (your service role key)`}
                  </pre>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#103629] dark:text-[#F7F5EF] uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-[#103629] dark:bg-[#B69A61] text-[#F7F5EF] dark:text-[#0A1B14] flex items-center justify-center text-[10px] font-bold">
                    2
                  </span>
                  <span>Execute Database Migrations in Supabase SQL Editor</span>
                </div>
                <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans pl-7">
                  Run the SQL migration files located in the repository under <code>supabase/migrations/</code> in sequential order:
                </p>
                <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF]">
                    1. <code>001_initial_schema.sql</code>
                  </div>
                  <div className="p-2.5 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF]">
                    2. <code>002_rls_security_policies.sql</code>
                  </div>
                  <div className="p-2.5 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF]">
                    3. <code>003_storage_buckets.sql</code>
                  </div>
                  <div className="p-2.5 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF]">
                    4. <code>004_seed_clinic_data.sql</code>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#103629] dark:text-[#F7F5EF] uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-[#103629] dark:bg-[#B69A61] text-[#F7F5EF] dark:text-[#0A1B14] flex items-center justify-center text-[10px] font-bold">
                    3
                  </span>
                  <span>Create Initial Administrator User in Supabase Auth</span>
                </div>
                <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans pl-7">
                  In Supabase Dashboard → <strong>Authentication → Users</strong>, click <strong>&quot;Add user&quot;</strong>, enter Dr. Vishal Lohana&apos;s email and password, then execute this SQL snippet to register the administrator profile:
                </p>
                <div className="pl-7">
                  <pre className="p-3 bg-[#103629] dark:bg-[#071510] text-[#F7F5EF] text-[11px] font-mono overflow-x-auto rounded-none border border-[#174635] dark:border-[#1E4234]">
{`INSERT INTO public.admin_users (id, email, full_name, role, is_active)
SELECT id, email, 'Dr Vishal Lohana', 'surgeon', true
FROM auth.users
WHERE email = 'YOUR_ADMIN_EMAIL_HERE'
ON CONFLICT (id) DO NOTHING;`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E4E0D6] dark:border-[#1E4234] flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-[#707873] dark:text-[#A8B2AC] font-sans">
                Full documentation available in <code>supabase/README.md</code>
              </span>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] px-5 py-2.5 text-xs font-sans uppercase tracking-wider font-medium transition-colors"
              >
                <span>Proceed to Staff Login</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B69A61]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CASE 2: Unauthenticated — redirect to staff login
  if (auth.status === "unauthenticated") {
    const isTimeout =
      auth.message.toLowerCase().includes("timed out") ||
      auth.message.toLowerCase().includes("inactivity");
    const isDeparted = auth.message.toLowerCase().includes("departed");
    redirect(
      isDeparted
        ? "/admin/login?reason=departed"
        : isTimeout
        ? "/admin/login?reason=timeout"
        : "/admin/login"
    );
  }

  // CASE 3: Unauthorized — logged-in user is not in public.admin_users
  if (auth.status === "unauthorized") {
    return (
      <div className="min-h-[85vh] bg-[#F7F5EF] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[#EFECE3] border border-[#E4E0D6] p-8 space-y-6 text-center">
          <div className="w-12 h-12 bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-[#103629]">Access Denied</h1>
            <p className="text-xs text-[#545C57] font-sans mt-2">
              Logged in as <strong>{auth.userEmail}</strong>, but this account is not registered in the active clinic administrator roster.
            </p>
          </div>
          <Link
            href="/admin/login"
            className="inline-block px-5 py-2.5 bg-[#103629] text-[#F7F5EF] text-xs font-sans uppercase tracking-wider font-semibold"
          >
            Sign In with Authorized Account
          </Link>
        </div>
      </div>
    );
  }

  // CASE 4: Authenticated Administrator
  const supabase = await createServerSupabaseClient();
  let appointments: any[] = [];
  let siteSettings: any = null;
  let staffList: any[] = [];
  let servicesList: any[] = [];
  let casesList: any[] = [];
  let reviewsList: any[] = [];

  if (supabase) {
    const { data: apps } = await (supabase.from("appointments") as any)
      .select("*")
      .order("created_at", { ascending: false });
    appointments = apps || [];

    const { data: settings } = await (supabase.from("site_settings") as any)
      .select("*")
      .limit(1)
      .maybeSingle();
    siteSettings = settings;

    const { data: staffData } = await (supabase.from("staff") as any)
      .select("*")
      .order("sort_order", { ascending: true });
    staffList = staffData || [];

    const { data: servicesData } = await (supabase.from("services") as any)
      .select("*")
      .order("sort_order", { ascending: true });
    servicesList = servicesData || [];

    const { data: casesData } = await (supabase.from("projects") as any)
      .select("*")
      .order("sort_order", { ascending: true });
    casesList = casesData || [];

    const { data: reviewsData } = await (supabase.from("patient_reviews") as any)
      .select("*")
      .order("created_at", { ascending: false });
    reviewsList = reviewsData || [];
  }

  const initialStats = {
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
    total: appointments.length,
    recentUrgent: appointments.filter((a) => a.is_triage_urgent).length,
  };

  return (
    <AdminDashboardClient
      profile={auth.profile}
      initialStats={initialStats}
      initialAppointments={appointments}
      initialSettings={
        siteSettings || {
          clinic_name: CLINIC_INFO.name,
          lead_surgeon: CLINIC_INFO.leadSurgeon,
          address: CLINIC_INFO.address,
          phone_display: CLINIC_INFO.phoneDisplay,
          phone_tel: CLINIC_INFO.phoneTel,
          whatsapp_url: CLINIC_INFO.whatsappUrl,
          opening_hours: CLINIC_INFO.hours,
          emergency_note: CLINIC_INFO.emergencyNote,
        }
      }
      staffList={staffList.length > 0 ? staffList : CLINIC_TEAM}
      servicesList={servicesList.length > 0 ? servicesList : CLINIC_SERVICES}
      casesList={casesList.length > 0 ? casesList : CLIENT_CASES}
      initialReviews={reviewsList}
    />
  );
}
