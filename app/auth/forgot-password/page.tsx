"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/services/auth-api";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type PasswordStrength = "weak" | "fair" | "good" | "strong";

function getPasswordStrength(password: string): PasswordStrength {
  if (!password.length) return "weak";
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const types = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (password.length >= 8 && types >= 4) return "strong";
  if (password.length >= 8 && types >= 3) return "good";
  if (password.length >= 6 && types >= 2) return "fair";
  return "weak";
}

function PasswordStrengthMeter({
  strength,
  className = "",
}: {
  strength: PasswordStrength;
  className?: string;
}) {
  const labels: Record<PasswordStrength, string> = {
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
  };
  const colors: Record<PasswordStrength, string> = {
    weak: "bg-red-500",
    fair: "bg-amber-500",
    good: "bg-sky-500",
    strong: "bg-emerald-600",
  };
  const widths: Record<PasswordStrength, string> = {
    weak: "w-1/4",
    fair: "w-2/4",
    good: "w-3/4",
    strong: "w-full",
  };
  const textColors: Record<PasswordStrength, string> = {
    weak: "text-red-600",
    fair: "text-amber-600",
    good: "text-sky-600",
    strong: "text-emerald-600",
  };
  return (
    <div className={className}>
      <div className="flex gap-1 h-1.5 bg-dashboard-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${widths[strength]} ${colors[strength]}`}
        />
      </div>
      <p className={`text-xs mt-1 font-medium ${textColors[strength]}`}>
        {labels[strength]}
      </p>
    </div>
  );
}

const emailSchema = (v: string) => {
  if (!v?.trim()) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(v.trim()) ? null : "Invalid email address";
};

const otpSchema = (v: string) => {
  if (!v || v.length !== 4) return "OTP must be exactly 4 digits";
  return /^\d{4}$/.test(v) ? null : "OTP must contain only numbers";
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const strength = getPasswordStrength(newPassword);
  const isStrong = strength === "strong";

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    const err = emailSchema(email);
    if (err) {
      setErrors({ email: err });
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const response = await authApi.requestPasswordReset(
        email.trim().toLowerCase()
      );
      setSuccessMessage(response.message || "OTP sent to your email.");
      setOtpSent(true);
      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    const emailErr = emailSchema(email);
    if (emailErr) {
      setErrors((prev) => ({ ...prev, email: emailErr }));
      return;
    }
    const otpErr = otpSchema(otp);
    if (otpErr) {
      setErrors((prev) => ({ ...prev, otp: otpErr }));
      return;
    }
    if (!isStrong) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          "Password must be strong: at least 8 characters with uppercase, lowercase, number and symbol.",
      }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }
    if (newPassword.length < 4 || newPassword.length > 32) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password must be 4–32 characters.",
      }));
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email: email.trim().toLowerCase(),
        otp,
        new_password: newPassword,
      });
      setSuccessMessage("Password reset successfully. Redirecting to sign in...");
      setTimeout(() => router.push("/auth/signin"), 2000);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isResetReady =
    otpSent && otp.length === 4 && isStrong && newPassword === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-dashboard-bg px-4 py-12">
      <AuthCard
        title="Forgot password"
        description={
          !otpSent
            ? "Enter your email to receive a 4-digit code"
            : "Enter the code from your email and choose a new password"
        }
      >
        {serverError && <FormError message={serverError} />}
        {successMessage && <FormSuccess message={successMessage} />}

        <motion.form
          onSubmit={otpSent ? handleResetPassword : handleRequestOtp}
          className="space-y-5 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="label-auth">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent || isLoading}
              readOnly={otpSent}
              className={`input-auth ${errors.email ? "input-auth-error" : ""} ${otpSent ? "input-auth-readonly" : ""}`}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!otpSent && (
              <motion.div
                key="send-otp"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-brand-bg-primary hover:bg-brand-bg-primary/90 text-white font-medium shadow-md shadow-orange-900/10"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {otpSent && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="otp" className="label-auth">4-digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="1234"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  disabled={isLoading}
                  maxLength={4}
                  className={`input-auth text-center text-xl tracking-[0.4em] ${errors.otp ? "input-auth-error" : ""}`}
                />
                {errors.otp && (
                  <p className="text-xs text-red-600">{errors.otp}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="label-auth">New password</Label>
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  placeholder="At least 8 characters, with upper, lower, number & symbol"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  error={errors.newPassword}
                  className="input-auth"
                />
                <PasswordStrengthMeter strength={strength} />
                {errors.newPassword && (
                  <p className="text-xs text-red-600">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="label-auth">Confirm new password</Label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  error={errors.confirmPassword}
                  className="input-auth"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-brand-bg-primary hover:bg-brand-bg-primary/90 text-white font-medium shadow-md shadow-orange-900/10"
                disabled={isLoading || !isResetReady}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </motion.div>
          )}
        </motion.form>

        <motion.p
          className="text-center text-sm text-dashboard-muted mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/auth/signin"
            className="text-dashboard-accent hover:underline"
          >
            Back to sign in
          </Link>
        </motion.p>
      </AuthCard>
    </div>
  );
}
