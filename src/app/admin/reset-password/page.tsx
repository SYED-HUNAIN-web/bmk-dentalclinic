"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminResetPasswordWithSessionAction } from "@/app/actions/admin-auth";
import {
  KeyRound,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters in length.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await adminResetPasswordWithSessionAction({
        newPassword: password,
        confirmPassword,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          router.push(res.redirectTo || "/admin/login?reason=password_recovered");
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Password update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F7F5EF] dark:bg-[#0A1B14] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-8 sm:p-10 shadow-lg relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#B69A61]" />

        <div className="flex items-center justify-between">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-sans text-[#707873] dark:text-[#CBD5CF] hover:text-[#103629] dark:hover:text-[#F7F5EF] transition-colors uppercase tracking-wider"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>
          <KeyRound className="w-4 h-4 text-[#B69A61]" />
        </div>

        <div className="text-center space-y-2 pt-2">
          <span className="text-[11px] font-sans uppercase tracking-[0.24em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
            Security Credential Update
          </span>
          <h1 className="font-serif text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight">
            Set New Password
          </h1>
          <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed max-w-xs mx-auto">
            Choose a strong alphanumeric password for your clinic administration account.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-xs font-sans space-y-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
            <div className="pt-2 border-t border-red-200/60 dark:border-red-800/60">
              <Link
                href="/admin/forgot-password"
                className="text-xs font-medium underline hover:opacity-80 transition-opacity"
              >
                Need to request a verification OTP code instead?
              </Link>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-sans flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{successMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label
              htmlFor="reset-new-password"
              className="block text-xs font-sans uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-medium mb-1.5"
            >
              New Password (min 8 chars)
            </label>
            <div className="relative">
              <input
                id="reset-new-password"
                name="new-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-3 pl-10 pr-10 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] placeholder:text-[#707873]/60 focus:outline-none focus:border-[#B69A61] focus:ring-1 focus:ring-[#B69A61] transition-all"
              />
              <Lock className="w-4 h-4 text-[#707873] dark:text-[#A8B2AC] absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3 top-3.5 text-[#707873] hover:text-[#103629] dark:text-[#A8B2AC] dark:hover:text-[#F7F5EF] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="reset-confirm-password"
              className="block text-xs font-sans uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-medium mb-1.5"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="reset-confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-3 pl-10 pr-10 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] placeholder:text-[#707873]/60 focus:outline-none focus:border-[#B69A61] focus:ring-1 focus:ring-[#B69A61] transition-all"
              />
              <Lock className="w-4 h-4 text-[#707873] dark:text-[#A8B2AC] absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                aria-pressed={showConfirmPassword}
                className="absolute right-3 top-3.5 text-[#707873] hover:text-[#103629] dark:text-[#A8B2AC] dark:hover:text-[#F7F5EF] transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || password.length < 8 || password !== confirmPassword}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] py-3.5 px-6 text-xs font-sans uppercase tracking-[0.16em] font-medium transition-all disabled:opacity-60 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#B69A61]" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Save New Password</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B69A61]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
