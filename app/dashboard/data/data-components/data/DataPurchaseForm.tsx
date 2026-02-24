"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneNumberInput } from "@/app/dashboard/airtime/airtime-components/airtime/PhoneNumberInput";
import { FormError } from "@/components/auth/FormError";
import { Loader2 } from "lucide-react";
import { vtpassDataApi } from "@/services/vtpass/vtu/vtpass-data-api";
import type { VtpassDataVariation, VtpassDataPurchaseResponse } from "@/types/vtpass/vtu/vtpass-data";
import { PurchaseConfirmationModal } from "./PurchaseConfirmationModal";

interface DataPurchaseFormProps {
  selectedServiceId: string;
  selectedVariation: VtpassDataVariation;
  serviceName: string;
  serviceImage?: string;
  onSuccess: (data: VtpassDataPurchaseResponse) => void;
  onError: (error: string) => void;
  walletBalance: number;
}

export function DataPurchaseForm({
  selectedServiceId,
  selectedVariation,
  serviceName,
  serviceImage,
  onSuccess,
  onError,
  walletBalance,
}: DataPurchaseFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ phoneNumber?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const amount = parseFloat(selectedVariation.variation_amount);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (phoneNumber.length !== 11) {
      newErrors.phoneNumber = "Phone number must be 11 digits";
    } else if (!phoneNumber.startsWith("0")) {
      newErrors.phoneNumber = "Phone number must start with 0";
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
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);
    try {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 16).replace(/[-:T]/g, "");
      const randomStr = Math.random().toString(36).substring(2, 8);
      const requestId = `${dateStr}${randomStr}`;

      const response = await vtpassDataApi.purchaseData({
        serviceID: selectedServiceId,
        billersCode: phoneNumber,
        variation_code: selectedVariation.variation_code,
        amount,
        phone: phoneNumber,
        request_id: requestId,
      });

      if (response.success) {
        onSuccess(response.data);
        setPhoneNumber("");
        setErrors({});
      } else {
        const errorMsg = response.message || "Transaction failed. Please try again.";
        setServerError(errorMsg);
        onError(errorMsg);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again.";
      setServerError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <PhoneNumberInput
        value={phoneNumber}
        onChange={setPhoneNumber}
        error={errors.phoneNumber}
        disabled={isSubmitting}
      />

      {serverError && <FormError message={serverError} />}

      {/* Selected plan recap */}
      <div className="rounded-xl border border-dashboard-border/80 bg-dashboard-bg/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-dashboard-muted mb-0.5">Plan</p>
            <p className="font-semibold text-sm text-dashboard-heading truncate">{selectedVariation.name}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-dashboard-muted mb-0.5">Amount</p>
            <p className="text-base sm:text-lg font-bold text-dashboard-heading tabular-nums">₦{amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !phoneNumber || phoneNumber.length !== 11}
        className="w-full min-h-12 h-12 sm:min-h-[52px] sm:h-[52px] rounded-xl bg-brand-bg-primary hover:bg-brand-bg-primary/90 text-white text-base sm:text-lg font-semibold shadow-sm transition-all active:scale-[0.99] touch-manipulation"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing…
          </>
        ) : (
          "Purchase Data"
        )}
      </Button>

      <div className="rounded-xl border border-dashboard-border/80 bg-dashboard-bg/80 p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-dashboard-muted">
          <strong className="text-dashboard-heading">Note:</strong> Data is delivered instantly. Double-check the number before paying.
        </p>
      </div>

      <PurchaseConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPurchase}
        networkName={serviceName}
        serviceID={selectedServiceId}
        networkImage={serviceImage}
        planName={selectedVariation.name}
        phoneNumber={phoneNumber}
        amount={amount}
        walletBalance={walletBalance}
        isLoading={isSubmitting}
      />
    </form>
  );
}
