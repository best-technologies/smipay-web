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
import {
  requestEmailOtpSchema,
  verifyEmailOtpSchema,
  completeRegistrationSchema,
  type RequestEmailOtpData,
  type VerifyEmailOtpData,
  type CompleteRegistrationData,
} from "@/lib/validations/auth/register-backend.schema";
import { authApi } from "@/services/auth-api";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";

type Step = "email" | "verify-otp" | "complete";

interface RegistrationState {
  email: string;
  otp: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  referral_code: string;
}

export default function RegisterNewPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [formData, setFormData] = useState<RegistrationState>({
    email: "",
    otp: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    referral_code: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationState, string>>>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegistrationState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Step 1: Request Email OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    setErrors({});

    const result = requestEmailOtpSchema.safeParse({ email: formData.email });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegistrationState, string>> = {};
      result.error.issues.forEach((error) => {
        fieldErrors[error.path[0] as keyof RegistrationState] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.requestEmailOtp(formData.email);

      // Check if email is already verified
      if (response.data?.email_already_verified) {
        setServerError(response.data.message || "Email is already registered. Please login.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(response.message);
      setOtpExpiresIn(response.data?.otp_expires_in || 300);
      setTimeout(() => {
        setStep("verify-otp");
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      setServerError(error.message || "Failed to send OTP. Please try again.");
      setIsLoading(false);
    }
  };

  // Step 2: Verify Email OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    setErrors({});

    const result = verifyEmailOtpSchema.safeParse({
      email: formData.email,
      otp: formData.otp,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegistrationState, string>> = {};
      result.error.issues.forEach((error) => {
        fieldErrors[error.path[0] as keyof RegistrationState] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.verifyEmailOtp(formData.email, formData.otp);

      // Check if email is already verified
      if (response.data?.email_already_verified) {
        setServerError(response.data.message || "Email is already registered. Please login.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(response.message);
      setTimeout(() => {
        setStep("complete");
        setSuccessMessage("");
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      setServerError(error.message || "Failed to verify OTP. Please try again.");
      setIsLoading(false);
    }
  };

  // Step 3: Complete Registration
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    setErrors({});

    const result = completeRegistrationSchema.safeParse({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone_number: formData.phone_number,
      password: formData.password,
      referral_code: formData.referral_code || "",
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegistrationState, string>> = {};
      result.error.issues.forEach((error) => {
        fieldErrors[error.path[0] as keyof RegistrationState] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        email: result.data.email,
        phone_number: result.data.phone_number,
        password: result.data.password,
        referral_code: result.data.referral_code,
      });

      setSuccessMessage(response.message || "Registration completed successfully!");
      setTimeout(() => {
        router.push("/auth/signin?registered=true");
      }, 2000);
    } catch (error: any) {
      setServerError(error.message || "Failed to complete registration. Please try again.");
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setServerError("");
    setSuccessMessage("");
    setErrors({});
    if (step === "verify-otp") {
      setStep("email");
    } else if (step === "complete") {
      setStep("verify-otp");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <AuthCard
        title={
          step === "email"
            ? "Create Your Smipay Account"
            : step === "verify-otp"
            ? "Verify Your Email"
            : "Complete Your Registration"
        }
        description={
          step === "email"
            ? "Enter your email to get started"
            : step === "verify-otp"
            ? `We've sent a 4-digit OTP to ${formData.email}`
            : "Fill in your details to complete registration"
        }
      >
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center gap-2 ${step === "email" ? "text-brand-bg-primary" : "text-green-600"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === "email" ? "bg-brand-bg-primary text-white" : "bg-green-600 text-white"}`}>
                {step === "email" ? "1" : <CheckCircle className="h-4 w-4" />}
              </div>
              <span>Email</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${step === "verify-otp" || step === "complete" ? "bg-green-600" : "bg-gray-200"}`} />
            <div className={`flex items-center gap-2 ${step === "verify-otp" ? "text-brand-bg-primary" : step === "complete" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === "verify-otp" ? "bg-brand-bg-primary text-white" : step === "complete" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                {step === "complete" ? <CheckCircle className="h-4 w-4" /> : "2"}
              </div>
              <span>Verify</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${step === "complete" ? "bg-green-600" : "bg-gray-200"}`} />
            <div className={`flex items-center gap-2 ${step === "complete" ? "text-brand-bg-primary" : "text-gray-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step === "complete" ? "bg-brand-bg-primary text-white" : "bg-gray-200"}`}>
                3
              </div>
              <span>Details</span>
            </div>
          </div>
        </div>

        {serverError && <FormError message={serverError} />}
        {successMessage && <FormSuccess message={successMessage} />}

        {/* Step 1: Enter Email */}
        {step === "email" && (
          <form onSubmit={handleRequestOtp} className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-bg-primary hover:bg-brand-bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send OTP
                </>
              )}
            </Button>

            <div className="text-center text-sm text-brand-text-secondary">
              Already have an account?{" "}
              <Link href="/auth/signin-new" className="text-brand-bg-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === "verify-otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 mt-6">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 text-sm text-brand-text-secondary hover:text-brand-text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Change email
            </button>

            <div className="space-y-2">
              <Label htmlFor="otp">Enter 4-Digit OTP</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                placeholder="1234"
                value={formData.otp}
                onChange={handleChange}
                disabled={isLoading}
                maxLength={4}
                className={`text-center text-2xl tracking-widest ${errors.otp ? "border-red-500" : ""}`}
              />
              {errors.otp && <p className="text-xs text-red-600">{errors.otp}</p>}
              <p className="text-xs text-brand-text-secondary text-center">
                OTP expires in {Math.floor(otpExpiresIn / 60)} minutes
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-bg-primary hover:bg-brand-bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => handleRequestOtp({ preventDefault: () => {} } as any)}
              disabled={isLoading}
            >
              Resend OTP
            </Button>
          </form>
        )}

        {/* Step 3: Complete Registration */}
        {step === "complete" && (
          <form onSubmit={handleCompleteRegistration} className="space-y-4 mt-6">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 text-sm text-brand-text-secondary hover:text-brand-text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.first_name ? "border-red-500" : ""}
                />
                {errors.first_name && <p className="text-xs text-red-600">{errors.first_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && <p className="text-xs text-red-600">{errors.last_name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="08012345678 or 2348012345678"
                value={formData.phone_number}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.phone_number ? "border-red-500" : ""}
              />
              {errors.phone_number && <p className="text-xs text-red-600">{errors.phone_number}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.password}
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
              <p className="text-xs text-brand-text-secondary">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral_code">Referral Code (Optional)</Label>
              <Input
                id="referral_code"
                name="referral_code"
                placeholder="SMILE123"
                value={formData.referral_code}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.referral_code ? "border-red-500" : ""}
              />
              {errors.referral_code && <p className="text-xs text-red-600">{errors.referral_code}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-bg-primary hover:bg-brand-bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        )}
      </AuthCard>
    </div>
  );
}

