"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SmartcardInput } from "./SmartcardInput";
import { FormError } from "@/components/auth/FormError";
import { Loader2, Tv, AlertCircle } from "lucide-react";
import { vtpassCableApi } from "@/services/vtpass/vtu/vtpass-cable-api";
import type { 
  VtpassCableVariation, 
  VtpassCablePurchaseResponse,
  VtpassCableVerifyContent 
} from "@/types/vtpass/vtu/vtpass-cable";
import { PurchaseConfirmationModal } from "./PurchaseConfirmationModal";

interface CablePurchaseFormProps {
  selectedServiceId: string;
  selectedVariation: VtpassCableVariation | null;
  serviceName: string;
  verificationData?: VtpassCableVerifyContent | null;
  verifiedSmartcardNumber?: string;
  onSuccess: (data: VtpassCablePurchaseResponse) => void;
  onError: (error: string) => void;
  walletBalance: number;
}

export function CablePurchaseForm({
  selectedServiceId,
  selectedVariation,
  serviceName,
  verificationData,
  verifiedSmartcardNumber = "",
  onSuccess,
  onError,
  walletBalance,
}: CablePurchaseFormProps) {
  const serviceIdLower = selectedServiceId.toLowerCase();
  const isDSTVOrGOTV = serviceIdLower === "dstv" || serviceIdLower === "gotv";
  const isStartimes = serviceIdLower === "startimes";
  const isShowmax = serviceIdLower === "showmax";
  
  const [smartcardNumber, setSmartcardNumber] = useState(
    verifiedSmartcardNumber || ""
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subscriptionType, setSubscriptionType] = useState<"change" | "renew" | null>(
    verificationData ? "renew" : null
  );
  const [errors, setErrors] = useState<{
    smartcard?: string;
    phoneNumber?: string;
    subscriptionType?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Calculate amount based on subscription type
  const getAmount = (): number => {
    if (isDSTVOrGOTV && subscriptionType === "renew" && verificationData?.Renewal_Amount) {
      return parseFloat(verificationData.Renewal_Amount);
    }
    if (selectedVariation) {
      return parseFloat(selectedVariation.variation_amount);
    }
    return 0;
  };

  const amount = getAmount();

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // For DSTV/GOTV/Startimes: require smartcard
    if (!isShowmax) {
      if (!smartcardNumber) {
        newErrors.smartcard = "Smartcard number is required";
      } else {
        // Remove any spaces/dashes and check length
        const cleaned = smartcardNumber.replace(/[\s-]/g, "");
        if (cleaned.length < 10 || cleaned.length > 11) {
          newErrors.smartcard = "Smartcard number must be 10-11 digits";
        }
      }
    }

    // For Showmax: require phone number
    if (isShowmax) {
      if (!phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (phoneNumber.length !== 11) {
        newErrors.phoneNumber = "Phone number must be 11 digits";
      } else if (!phoneNumber.startsWith("0")) {
        newErrors.phoneNumber = "Phone number must start with 0";
      }
    }

    // For DSTV/GOTV: require subscription type
    if (isDSTVOrGOTV && !subscriptionType) {
      newErrors.subscriptionType = "Please select subscription type";
    }

    // For DSTV/GOTV change or Startimes/Showmax: require variation
    if ((isDSTVOrGOTV && subscriptionType === "change") || isStartimes || isShowmax) {
      if (!selectedVariation) {
        newErrors.subscriptionType = "Please select a subscription plan";
      }
    }

    if (amount > walletBalance) {
      setServerError("Insufficient wallet balance");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      // Generate request ID for idempotency
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 16).replace(/[-:T]/g, "");
      const randomStr = Math.random().toString(36).substring(2, 8);
      const requestId = `${dateStr}${randomStr}`;

      // Build purchase request based on provider
      const purchaseRequest: any = {
        request_id: requestId,
        serviceID: selectedServiceId,
      };

      // Set billersCode (smartcard for DSTV/GOTV/Startimes, phone for Showmax)
      if (isShowmax) {
        purchaseRequest.billersCode = phoneNumber;
        purchaseRequest.phone = phoneNumber;
      } else {
        purchaseRequest.billersCode = smartcardNumber;
        if (phoneNumber) {
          purchaseRequest.phone = phoneNumber;
        }
      }

      // DSTV/GOTV specific fields
      if (isDSTVOrGOTV) {
        purchaseRequest.subscription_type = subscriptionType;
        purchaseRequest.quantity = 1;

        if (subscriptionType === "change" && selectedVariation) {
          purchaseRequest.variation_code = selectedVariation.variation_code;
        } else if (subscriptionType === "renew") {
          purchaseRequest.amount = amount;
        }
      }

      // Startimes/Showmax: always require variation_code
      if (isStartimes || isShowmax) {
        if (selectedVariation) {
          purchaseRequest.variation_code = selectedVariation.variation_code;
        }
        // Amount is optional for Startimes/Showmax (will use variation_code price)
        if (amount > 0) {
          purchaseRequest.amount = amount;
        }
      }

      const response = await vtpassCableApi.purchaseCable(purchaseRequest);

      if (response.success) {
        onSuccess(response.data);
        // Reset form on success
        setSmartcardNumber("");
        setPhoneNumber("");
        setErrors({});
      } else {
        const errorMsg = response.message || "Transaction failed. Please try again.";
        setServerError(errorMsg);
        onError(errorMsg);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred. Please try again.";
      setServerError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPurchaseDescription = (): string => {
    if (isDSTVOrGOTV) {
      if (subscriptionType === "renew") {
        return `Renew ${serviceName} subscription`;
      } else if (subscriptionType === "change") {
        return `Change ${serviceName} bouquet to ${selectedVariation?.name || "selected plan"}`;
      }
    }
    if (isStartimes || isShowmax) {
      return `Purchase ${serviceName} ${selectedVariation?.name || "subscription"}`;
    }
    return `Purchase ${serviceName} subscription`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Row: Smartcard Number (left) and Phone Number (right) */}
      {!isShowmax && (
        <div className="grid grid-cols-2 gap-4">
          {/* Smartcard Input (Left) */}
          <SmartcardInput
            value={smartcardNumber}
            onChange={setSmartcardNumber}
            error={errors.smartcard}
            disabled={isSubmitting || !!verificationData}
            label="Smartcard Number"
            placeholder="1212121212"
            maxLength={10}
          />

          {/* Phone Number Input (Right) */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-slate-700">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="08012345678"
                value={phoneNumber}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, "");
                  const formatted = input.slice(0, 11);
                  setPhoneNumber(formatted);
                }}
                disabled={isSubmitting}
                className={`w-full bg-transparent text-base py-2 border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors placeholder:text-brand-text-secondary/50 ${
                  errors.phoneNumber
                    ? "border-red-500 focus:border-red-500"
                    : phoneNumber.length === 11
                    ? "border-green-500 focus:border-green-500"
                    : "border-gray-300 focus:border-brand-bg-primary"
                }`}
                maxLength={11}
              />
              {phoneNumber.length === 11 && !errors.phoneNumber && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
            {errors.phoneNumber && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errors.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phone Number Input for Showmax (Full Width) */}
      {isShowmax && (
        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, "");
                const formatted = input.slice(0, 11);
                setPhoneNumber(formatted);
              }}
              disabled={isSubmitting}
              className={`w-full bg-transparent text-base py-2 border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors placeholder:text-brand-text-secondary/50 ${
                errors.phoneNumber
                  ? "border-red-500 focus:border-red-500"
                  : phoneNumber.length === 11
                  ? "border-green-500 focus:border-green-500"
                  : "border-gray-300 focus:border-brand-bg-primary"
              }`}
              maxLength={11}
            />
            {phoneNumber.length === 11 && !errors.phoneNumber && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
          {errors.phoneNumber && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.phoneNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Second Row: Selected Plan (left) and Summary (right) */}
      {selectedVariation && (
        <div className="grid grid-cols-2 gap-4">
          {/* Selected Plan (Left) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Selected Plan</label>
            <div className="p-3 rounded-lg border border-gray-200 bg-white">
              <div className="font-semibold text-sm mb-1">{selectedVariation.name}</div>
              <div className="text-sm font-bold text-brand-bg-primary">
                {isDSTVOrGOTV && verificationData?.Renewal_Amount ? (
                  (() => {
                    const amountStr = String(verificationData.Renewal_Amount).replace(/[,\s]/g, "").trim();
                    const parsed = parseFloat(amountStr);
                    if (!isNaN(parsed) && isFinite(parsed)) {
                      return `₦${parsed.toLocaleString()}`;
                    }
                    return `₦${verificationData.Renewal_Amount}`;
                  })()
                ) : (
                  `₦${parseFloat(selectedVariation.variation_amount).toLocaleString()}`
                )}
              </div>
            </div>
            {/* Checkbox for DSTV/GOTV */}
            {isDSTVOrGOTV && verificationData && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="renew-current-plan"
                    checked={subscriptionType === "renew"}
                    onChange={(e) => {
                      setSubscriptionType(e.target.checked ? "renew" : "change");
                      setErrors((prev) => ({ ...prev, subscriptionType: undefined }));
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-brand-bg-primary focus:ring-brand-bg-primary focus:ring-2"
                  />
                  <label
                    htmlFor="renew-current-plan"
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    This is my current plan, renew it
                  </label>
                </div>
                {errors.subscriptionType && (
                  <p className="text-xs text-red-600">{errors.subscriptionType}</p>
                )}
              </>
            )}
          </div>

          {/* Summary Section (Right) */}
          <div className="flex items-start">
            {/* Current Bouquet (for DSTV/GOTV renew) */}
            {isDSTVOrGOTV && subscriptionType === "renew" && (
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-600 mb-0.5">Current Bouquet</p>
                    <p className="font-semibold text-sm text-emerald-800">
                      {selectedVariation.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-emerald-600 mb-0.5">Renewal Amount</p>
                    <p className="text-lg font-bold text-emerald-800">
                      {verificationData?.Renewal_Amount ? (
                        (() => {
                          const amountStr = String(verificationData.Renewal_Amount).replace(/[,\s]/g, "").trim();
                          const parsed = parseFloat(amountStr);
                          if (!isNaN(parsed) && isFinite(parsed)) {
                            return `₦${parsed.toLocaleString()}`;
                          }
                          return `₦${verificationData.Renewal_Amount}`;
                        })()
                      ) : (
                        `₦${parseFloat(selectedVariation.variation_amount).toLocaleString()}`
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Plan Summary (for Startimes, Showmax, or DSTV/GOTV change) */}
            {((isDSTVOrGOTV && subscriptionType === "change") || isStartimes || isShowmax) && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">Selected Plan</p>
                    <p className="font-semibold text-sm text-slate-800">{selectedVariation.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600 mb-0.5">Amount</p>
                    <p className="text-lg font-bold text-slate-800">
                      ₦{parseFloat(selectedVariation.variation_amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phone Number Input for Showmax */}
      {isShowmax && (
        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, "");
                const formatted = input.slice(0, 11);
                setPhoneNumber(formatted);
              }}
              disabled={isSubmitting}
              className={`w-full bg-transparent text-base py-2 border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors placeholder:text-brand-text-secondary/50 ${
                errors.phoneNumber
                  ? "border-red-500 focus:border-red-500"
                  : phoneNumber.length === 11
                  ? "border-green-500 focus:border-green-500"
                  : "border-gray-300 focus:border-brand-bg-primary"
              }`}
              maxLength={11}
            />
            {phoneNumber.length === 11 && !errors.phoneNumber && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
          {errors.phoneNumber && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.phoneNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Server Error */}
      {serverError && (
        <div>
          <FormError message={serverError} />
        </div>
      )}



      {/* Submit Button */}
      <Button
        type="submit"
        disabled={
          isSubmitting ||
          (isDSTVOrGOTV && !subscriptionType) ||
          (!isShowmax && (!smartcardNumber || (() => {
            const cleaned = smartcardNumber.replace(/[\s-]/g, "");
            return cleaned.length < 10 || cleaned.length > 11;
          })())) ||
          (isShowmax && (!phoneNumber || phoneNumber.length !== 11)) ||
          // Only require selectedVariation for "change" subscription or Startimes/Showmax
          // For "renew", we don't need selectedVariation
          ((isDSTVOrGOTV && subscriptionType === "change") || isStartimes || isShowmax ? !selectedVariation : false)
        }
        className="w-full bg-brand-bg-primary hover:bg-brand-bg-primary/90"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          getPurchaseDescription()
        )}
      </Button>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong>{" "}
          {isShowmax
            ? "Your Showmax voucher code will be displayed after successful purchase."
            : `Your ${serviceName} subscription will be activated on the smartcard number provided.`}
        </p>
      </div>

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPurchase}
        serviceName={serviceName}
        planName={
          isDSTVOrGOTV && subscriptionType === "renew"
            ? selectedVariation?.name || "Current Plan"
            : selectedVariation?.name || "Selected Plan"
        }
        smartcardNumber={isShowmax ? phoneNumber : smartcardNumber}
        amount={amount}
        subscriptionType={subscriptionType || undefined}
        isLoading={isSubmitting}
        isShowmax={isShowmax}
      />
    </form>
  );
}
