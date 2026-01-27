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
  onSuccess: (data: VtpassDataPurchaseResponse) => void;
  onError: (error: string) => void;
  walletBalance: number;
}

export function DataPurchaseForm({
  selectedServiceId,
  selectedVariation,
  serviceName,
  onSuccess,
  onError,
  walletBalance,
}: DataPurchaseFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{
    phoneNumber?: string;
  }>({});
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
      // Generate request ID for idempotency (format: YYYYMMDDHHII<random>)
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 16).replace(/[-:T]/g, "");
      const randomStr = Math.random().toString(36).substring(2, 8);
      const requestId = `${dateStr}${randomStr}`;

      const response = await vtpassDataApi.purchaseData({
        serviceID: selectedServiceId,
        billersCode: phoneNumber,
        variation_code: selectedVariation.variation_code,
        amount: amount,
        phone: phoneNumber,
        request_id: requestId,
      });

      if (response.success) {
        onSuccess(response.data);
        // Reset form on success
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Phone Number Input */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <PhoneNumberInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            error={errors.phoneNumber}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div>
          <FormError message={serverError} />
        </div>
      )}

      {/* Selected Plan Info */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Selected Plan</p>
            <p className="font-semibold text-slate-800">{selectedVariation.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 mb-1">Amount</p>
            <p className="text-xl font-bold text-slate-800">₦{amount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !phoneNumber || phoneNumber.length !== 11}
        className="w-full bg-brand-bg-primary hover:bg-brand-bg-primary/90"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Purchase Data"
        )}
      </Button>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Data will be delivered instantly to the phone number
          provided. Make sure the number is correct before proceeding.
        </p>
      </div>

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPurchase}
        networkName={serviceName}
        planName={selectedVariation.name}
        phoneNumber={phoneNumber}
        amount={amount}
        isLoading={isSubmitting}
      />
    </form>
  );
}
