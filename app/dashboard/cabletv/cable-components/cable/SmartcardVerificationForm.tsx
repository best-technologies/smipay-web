"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SmartcardInput } from "./SmartcardInput";
import { FormError } from "@/components/auth/FormError";
import { Loader2, CheckCircle2 } from "lucide-react";
import { vtpassCableApi } from "@/services/vtpass/vtu/vtpass-cable-api";
import type { VtpassCableVerifyContent } from "@/types/vtpass/vtu/vtpass-cable";

interface SmartcardVerificationFormProps {
  serviceID: string;
  serviceName: string;
  onVerified: (verificationData: VtpassCableVerifyContent, smartcardNumber: string) => void;
  onError: (error: string) => void;
}

export function SmartcardVerificationForm({
  serviceID,
  serviceName,
  onVerified,
  onError,
}: SmartcardVerificationFormProps) {
  const [smartcardNumber, setSmartcardNumber] = useState("");
  const [errors, setErrors] = useState<{ smartcard?: string }>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [serverError, setServerError] = useState("");
  const [verificationData, setVerificationData] = useState<VtpassCableVerifyContent | null>(null);

  // Determine smartcard length based on provider
  const isShowmax = serviceID.toLowerCase() === "showmax";
  const maxLength = isShowmax ? 11 : 10;
  const label = isShowmax ? "Phone Number" : "Smartcard Number";
  const placeholder = isShowmax ? "08012345678" : "1212121212";

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!smartcardNumber) {
      newErrors.smartcard = `${label} is required`;
    } else if (smartcardNumber.length !== maxLength) {
      newErrors.smartcard = `${label} must be ${maxLength} digits`;
    } else if (isShowmax && !smartcardNumber.startsWith("0")) {
      newErrors.smartcard = "Phone number must start with 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsVerifying(true);

    try {
      const response = await vtpassCableApi.verifySmartcard({
        billersCode: smartcardNumber,
        serviceID: serviceID,
      });

      // Debug: Log response structure
      console.log("Verification response:", response);

      // Check if response is successful and has content
      // Backend returns: { success: true, message: "...", data: { code: "000", content: {...} } }
      if (response.success && response.data?.content) {
        setVerificationData(response.data.content);
        onVerified(response.data.content, smartcardNumber);
        return; // Exit early on success
      }

      // If code is "000" but structure is different, still treat as success
      if (response.data?.code === "000" && response.data?.content) {
        setVerificationData(response.data.content);
        onVerified(response.data.content, smartcardNumber);
        return; // Exit early on success
      }

      // Only call onError if we truly have an error
      const errorMsg = response.message || "Verification failed. Please try again.";
      console.error("Verification failed:", errorMsg, response);
      setServerError(errorMsg);
      onError(errorMsg);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred. Please try again.";
      setServerError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // If verified, show verification details
  if (verificationData) {
    // Safely parse renewal amount - handle string like "7900.00"
    const parseRenewalAmount = (amountStr: string | undefined): number | null => {
      if (!amountStr) return null;
      try {
        // Remove any commas and whitespace, then parse
        const cleaned = String(amountStr).replace(/[,\s]/g, "").trim();
        if (!cleaned) return null;
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) || !isFinite(parsed) ? null : parsed;
      } catch {
        return null;
      }
    };

    const renewalAmount = parseRenewalAmount(verificationData.Renewal_Amount);
    void renewalAmount; // reserved for future validation UI

    // Format due date
    const formatDueDate = (dateString: string | undefined): string => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-800 mb-3">Smartcard Verified Successfully</p>
              <div className="space-y-2.5 text-sm">
                {/* Customer Name */}
                <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                  <span className="text-green-700">Customer Name:</span>
                  <span className="font-semibold text-green-900">{verificationData.Customer_Name || "N/A"}</span>
                </div>

                {/* Customer Number */}
                <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                  <span className="text-green-700">Customer Number:</span>
                  <span className="font-semibold text-green-900 font-mono">{verificationData.Customer_Number || "N/A"}</span>
                </div>

                {/* Customer Type */}
                <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                  <span className="text-green-700">Customer Type:</span>
                  <span className="font-semibold text-green-900">{verificationData.Customer_Type || "N/A"}</span>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                  <span className="text-green-700">Status:</span>
                  <span className={`font-semibold px-2 py-1 rounded ${
                    verificationData.Status === "ACTIVE" 
                      ? "bg-green-200 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {verificationData.Status || "N/A"}
                  </span>
                </div>


                {/* Due Date */}
                {verificationData.Due_Date && (
                  <div className="flex justify-between items-center py-2 border-b border-green-200/50">
                    <span className="text-green-700">Due Date:</span>
                    <span className="font-semibold text-green-900">
                      {formatDueDate(verificationData.Due_Date)}
                    </span>
                  </div>
                )}

                {/* Renewal Amount */}
                {verificationData.Renewal_Amount && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-green-800">Renewal Amount:</span>
                    <span className="font-bold text-xl text-green-900">
                      {(() => {
                        // Handle string like "7900.00" - remove commas and whitespace, then parse
                        const amountStr = String(verificationData.Renewal_Amount).replace(/[,\s]/g, "").trim();
                        const parsed = parseFloat(amountStr);
                        if (!isNaN(parsed) && isFinite(parsed)) {
                          return `₦${parsed.toLocaleString()}`;
                        }
                        // Fallback: show raw value if parsing fails
                        return `₦${verificationData.Renewal_Amount}`;
                      })()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            setVerificationData(null);
            setSmartcardNumber("");
            setErrors({});
            setServerError("");
          }}
          variant="outline"
          className="w-full"
        >
          Verify Another Smartcard
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <SmartcardInput
        value={smartcardNumber}
        onChange={setSmartcardNumber}
        error={errors.smartcard}
        disabled={isVerifying}
        label={label}
        placeholder={placeholder}
        maxLength={maxLength}
      />

      {serverError && (
        <div>
          <FormError message={serverError} />
        </div>
      )}

      <Button
        type="submit"
        disabled={isVerifying || !smartcardNumber || smartcardNumber.length !== maxLength}
        className="w-full bg-brand-bg-primary hover:bg-brand-bg-primary/90"
        size="lg"
      >
        {isVerifying ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          `Verify ${serviceName} ${isShowmax ? "Phone" : "Smartcard"}`
        )}
      </Button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> {isShowmax 
            ? "Enter the phone number associated with your Showmax account."
            : `Enter your ${serviceName} smartcard number to verify your account and see renewal options.`}
        </p>
      </div>
    </form>
  );
}
