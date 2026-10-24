"use client";

import { useState } from "react";
import Link from "next/link";
import {
  adminSendPasswordRecoveryOtpAction,
  adminVerifyRecoveryOtpAction,
  adminResetPasswordWithSessionAction,
} from "@/app/actions/admin-auth";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronLeft,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

type RecoveryStep = "email" | "otp" | "new_password" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await adminSendPasswordRecoveryOtpAction({ email });
      if (res.success) {
        setStatusMessage(res.message);
        setStep("otp");
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await adminVerifyRecoveryOtpAction({ email, otp });
      if (res.success) {
        setStatusMessage(res.message);
        setStep("new_password");
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP in Step 2
  const handleResendOtp = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await adminSendPasswordRecoveryOtpAction({ email });
      if (res.success) {
        setStatusMessage("A new 6-digit verification code has been dispatched to your email.");
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters in length.");
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await adminResetPasswordWithSessionAction({
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setStatusMessage(res.message);
        setStep("success");
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

        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-sans text-[#707873] dark:text-[#CBD5CF] hover:text-[#103629] dark:hover:text-[#F7F5EF] transition-colors uppercase tracking-wider"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B69A61]">
              Step {step === "email" ? "1 of 3" : step === "otp" ? "2 of 3" : step === "new_password" ? "3 of 3" : "Done"}
            </span>
            <KeyRound className="w-4 h-4 text-[#B69A61]" />
          </div>
        </div>

        {/* Step Titles */}
        <div className="text-center space-y-2 pt-2">
          <span className="text-[11px] font-sans uppercase tracking-[0.24em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
            Security & Access Control
          </span>

          {step === "email" && (
            <>
              <h1 className="font-serif text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight">
                Forgot Password
              </h1>
              <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed max-w-xs mx-auto">
                Enter your registered administrator email to receive a secure one-time verification code.
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <h1 className="font-serif text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight">
                Enter Verification Code
              </h1>
              <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed max-w-xs mx-auto">
                Enter the 6-digit one-time code sent to{" "}
                <span className="font-semibold text-[#103629] dark:text-[#F7F5EF]">{email}</span>.
              </p>
            </>
          )}

          {step === "new_password" && (
            <>
              <h1 className="font-serif text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight">
                Set New Password
              </h1>
              <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed max-w-xs mx-auto">
                Create a strong password for your clinic administrator account.
              </p>
            </>
          )}

          {step === "success" && (
            <>
              <h1 className="font-serif text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight">
                Password Updated
              </h1>
              <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed max-w-xs mx-auto">
                Your credentials have been securely updated in Supabase Auth.
              </p>
            </>
          )}
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-xs font-sans flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {statusMessage && step !== "success" && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-sans flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{statusMessage}</div>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-5" autoComplete="off">
            <div>
              <label
                htmlFor="recovery-email"
                className="block text-xs font-sans uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-medium mb-1.5"
              >
                Registered Staff Email
              </label>
              <div className="relative">
                <input
                  id="recovery-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bmkdentalclinic.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 pl-10 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] placeholder:text-[#707873]/60 focus:outline-none focus:border-[#B69A61] focus:ring-1 focus:ring-[#B69A61] transition-all"
                />
                <Mail className="w-4 h-4 text-[#707873] dark:text-[#A8B2AC] absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] py-3.5 px-6 text-xs font-sans uppercase tracking-[0.16em] font-medium transition-all disabled:opacity-60 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#B69A61]" />
                  <span>Dispatching Code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B69A61]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter 6-digit OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5" autoComplete="off">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="recovery-otp"
                  className="block text-xs font-sans uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-medium"
                >
                  6-Digit OTP Code
                </label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 text-[11px] font-sans text-[#B69A61] hover:text-[#9A814F] dark:hover:text-[#D1BE93] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend code</span>
                </button>
              </div>
              <input
                id="recovery-otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                autoComplete="one-time-code"
                className="w-full text-center tracking-[0.4em] font-mono text-xl py-3.5 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF] placeholder:text-[#707873]/40 focus:outline-none focus:border-[#B69A61] focus:ring-1 focus:ring-[#B69A61] transition-all"
              />
              <p className="mt-1.5 text-[11px] text-[#707873] dark:text-[#A8B2AC] text-center font-sans">
                Check your inbox (and spam folder) for the 6-digit code.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setErrorMessage(null);
                  setStatusMessage(null);
                }}
                className="w-1/3 py-3.5 px-3 border border-[#E4E0D6] dark:border-[#1E4234] text-xs font-sans uppercase tracking-wider text-[#707873] dark:text-[#CBD5CF] hover:text-[#103629] dark:hover:text-[#F7F5EF] transition-colors"
              >
                Change Email
              </button>
              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-2/3 inline-flex items-center justify-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] py-3.5 px-6 text-xs font-sans uppercase tracking-[0.16em] font-medium transition-all disabled:opacity-60 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#B69A61]" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B69A61]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Enter New Password & Confirm Password */}
        {step === "new_password" && (
          <form onSubmit={handleResetPassword} className="space-y-4" autoComplete="off">
            <div>
              <label
                htmlFor="new-password"
                className="block text-xs font-sans uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-medium mb-1.5"
              >
                New Password (min 8 chars)
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  name="new-password"
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pl-10 pr-10 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] placeholder:text-[#707873]/60 focus:outline-none focus:border-[#B69A61] focus:ring-1 focus:ring-[#B69A61] transition-all"
                />
                <Lock className="w-4 h-4 text-[#707873] dark:text-[#A8B2AC] absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  aria-pressed={showNewPassword}
                  className="absolute right-3 top-3.5 text-[#707873] hover:text-[#103629] dark:text-[#A8B2AC] dark:hover:text-[#F7F5EF] transition-colors focus:outline-none"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-sans uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-medium mb-1.5"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
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

            <div className="p-3 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-[11px] font-sans text-[#707873] dark:text-[#A8B2AC] space-y-1">
              <p className="font-medium text-[#103629] dark:text-[#F7F5EF]">Password Requirements:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li className={newPassword.length >= 8 ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                  Minimum 8 characters
                </li>
                <li className={/[a-zA-Z]/.test(newPassword) ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                  Includes letters
                </li>
                <li className={/[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                  Includes at least one number or special character
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}
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
        )}

        {/* STEP 4: Success Screen */}
        {step === "success" && (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-sans text-[#545C57] dark:text-[#CBD5CF] leading-relaxed">
                Your password has been securely updated. All previous temporary recovery sessions have been terminated.
              </p>
            </div>

            <Link
              href="/admin/login?reason=password_recovered"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] py-3.5 px-6 text-xs font-sans uppercase tracking-[0.16em] font-medium transition-all shadow-sm"
            >
              <span>Return to Staff Login</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B69A61]" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
