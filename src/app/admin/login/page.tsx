"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { adminSignInAction } from "@/app/actions/admin-auth";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
} from "lucide-react";

function AdminLoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reasonParam = searchParams.get("reason");

  // Controlled input state initialized strictly empty
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Guarantee no lingering or pre-populated state on component mount
  useEffect(() => {
    setEmail("");
    setPassword("");
    return () => {
      setEmail("");
      setPassword("");
    };
  }, [reasonParam]);

  const isDepartedReason = reasonParam === "departed";
  const isTimeoutReason =
    reasonParam === "timeout" || reasonParam === "session_expired";
  const isPasswordChangedReason = reasonParam === "password_changed";
  const isPasswordRecoveredReason = reasonParam === "password_recovered";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await adminSignInAction({ email, password });
      if (!result.success) {
        setErrorMessage(result.message);
        // Clear sensitive password field on failure
        setPassword("");
        setIsLoading(false);
      } else {
        setSuccessMessage(result.message);
        // Clear sensitive input fields from memory immediately
        setEmail("");
        setPassword("");
        setTimeout(() => {
          router.push(result.redirectTo || "/admin");
          router.refresh();
        }, 500);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected authentication error occurred."
      );
      setPassword("");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-8 sm:p-10 shadow-lg relative">
      {/* Subtle Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#B69A61]" />

      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-sans text-[#707873] dark:text-[#CBD5CF] hover:text-[#103629] dark:hover:text-[#F7F5EF] transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Clinic Website</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#103629] dark:bg-[#071510] text-[#F7F5EF] text-[10px] font-sans tracking-[0.18em] uppercase border border-[#174635] dark:border-[#1E4234]">
          <Lock className="w-3 h-3 text-[#B69A61]" />
          <span>Secure Area</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <span className="text-[11px] font-sans uppercase tracking-[0.24em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
          BMK Clinical Portal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight">
          Staff Authentication
        </h1>
        <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed max-w-xs mx-auto">
          Authorized access for Dr. Vishal Lohana and verified BMK Clinic surgical staff.
        </p>
      </div>

      {/* Password Changed / Recovered Success Banner */}
      {(isPasswordChangedReason || isPasswordRecoveredReason) && !errorMessage && !successMessage && (
        <div
          role="status"
          className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs font-sans flex items-start gap-3 leading-relaxed"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Password Updated:</strong>{" "}
            {isPasswordRecoveredReason
              ? "Your password has been successfully recovered. Please sign in with your new credentials."
              : "Your administrative password has been changed. Please sign in with your new credentials to establish an active session."}
          </div>
        </div>
      )}

      {/* Session Inactivity Timeout or Departure Banner */}
      {(isTimeoutReason || isDepartedReason) && !isPasswordChangedReason && !isPasswordRecoveredReason && !errorMessage && !successMessage && (
        <div
          role="status"
          className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-sans flex items-start gap-3 leading-relaxed"
        >
          <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Session Security Notice:</strong>{" "}
            {isDepartedReason
              ? "For patient confidentiality and security, your administrative session ended because you navigated away from the admin area. Please sign in again."
              : "For patient confidentiality, your administrative session timed out due to inactivity. Please re-authenticate to resume."}
          </div>
        </div>
      )}

      {/* Error & Success Alerts */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-xs font-sans flex items-start gap-3"
        >
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-sans flex items-start gap-3"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{successMessage}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate autoComplete="off">
        <div>
          <label
            htmlFor="admin-email"
            className="block text-xs font-sans uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-medium mb-1.5"
          >
            Staff Email Address
          </label>
          <div className="relative">
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="clinician@bmkdentalclinic.com"
              className="w-full px-4 py-3 pl-10 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] placeholder:text-[#707873]/60 focus:outline-none focus:border-[#B69A61] focus:ring-1 focus:ring-[#B69A61] transition-all"
            />
            <Mail className="w-4 h-4 text-[#707873] dark:text-[#A8B2AC] absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="block text-xs font-sans uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-medium mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 pl-10 pr-11 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] placeholder:text-[#707873]/60 focus:outline-none focus:border-[#B69A61] focus:ring-1 focus:ring-[#B69A61] transition-all"
            />
            <KeyRound className="w-4 h-4 text-[#707873] dark:text-[#A8B2AC] absolute left-3 top-3.5 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-2.5 p-1 text-[#707873] hover:text-[#103629] dark:text-[#A8B2AC] dark:hover:text-[#F7F5EF] focus:outline-none focus:ring-1 focus:ring-[#B69A61] rounded transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] py-3.5 px-6 text-xs font-sans uppercase tracking-[0.16em] font-medium transition-all disabled:opacity-70 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#B69A61]" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B69A61]" />
            </>
          )}
        </button>
      </form>

      {/* Security & Audit Notice */}
      <div className="pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234] text-[11px] font-sans text-[#707873] dark:text-[#A8B2AC] leading-relaxed flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[#B69A61] shrink-0 mt-0.5" />
        <span>
          This portal is restricted to authorized clinic staff. All access attempts, session IP addresses, and administrative mutations are audited.
        </span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[85vh] bg-[#F7F5EF] dark:bg-[#0A1B14] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 transition-colors">
      <Suspense
        fallback={
          <div className="max-w-md w-full bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-10 text-center text-xs font-sans text-[#707873]">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#B69A61] mb-2" />
            <span>Loading Portal Authentication...</span>
          </div>
        }
      >
        <AdminLoginFormContent />
      </Suspense>
    </div>
  );
}
