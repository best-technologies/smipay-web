"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NetworkSelector } from "./NetworkSelector";
import { PhoneNumberInput } from "./PhoneNumberInput";
import { AmountInput } from "./AmountInput";
import { FormError } from "@/components/auth/FormError";
import { Loader2 } from "lucide-react";
import { useVtpassServiceIds } from "@/hooks/vtpass/vtu/useVtpassServiceIds";
import { vtpassAirtimeApi } from "@/services/vtpass/vtu/vtpass-airtime-api";
import type { VtpassService } from "@/services/vtpass/vtu/vtpass-airtime-api";
import { PurchaseConfirmationModal } from "./PurchaseConfirmationModal";

interface AirtimeFormProps {
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
  walletBalance: number;
}

export function AirtimeForm({ onSuccess, onError, walletBalance }: AirtimeFormProps) {
  const { serviceIds: allServices, isLoading: loadingServices, error: servicesError } = useVtpassServiceIds();
  
  // Filter out international/foreign-airtime provider for now
  const services = allServices.filter(
    (service) => service.serviceID !== "foreign-airtime" && service.serviceID !== "international"
  );
  
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{
    serviceId?: string;
    phoneNumber?: string;
    amount?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Auto-select first service when services are loaded
  useEffect(() => {
    if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].serviceID);
    }
  }, [services, selectedServiceId]);

  // Update amount limits when service changes
  useEffect(() => {
    if (selectedServiceId && services.length > 0) {
      const service = services.find((s) => s.serviceID === selectedServiceId);
      if (service) {
        const minAmount = parseFloat(service.minimium_amount);
        const maxAmount = parseFloat(service.maximum_amount);
        const currentAmount = parseFloat(amount) || 0;

        // Clear amount if it's outside new limits
        if (currentAmount > 0 && (currentAmount < minAmount || currentAmount > maxAmount)) {
          setAmount("");
        }
      }
    }
  }, [selectedServiceId, services, amount]);

  // Set server error if services failed to load
  useEffect(() => {
    if (servicesError) {
      setServerError(servicesError);
      onError(servicesError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicesError]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!selectedServiceId) {
      newErrors.serviceId = "Please select a network provider";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (phoneNumber.length !== 11) {
      newErrors.phoneNumber = "Phone number must be 11 digits";
    } else if (!phoneNumber.startsWith("0")) {
      newErrors.phoneNumber = "Phone number must start with 0";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
      } else {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
          newErrors.amount = "Please enter a valid amount";
        } else if (services.length > 0) {
          const service = services.find((s) => s.serviceID === selectedServiceId);
          if (service) {
            const minAmount = parseFloat(service.minimium_amount);
            const maxAmount = parseFloat(service.maximum_amount);
            if (numericAmount < minAmount) {
              newErrors.amount = `Minimum amount is ₦${minAmount.toLocaleString()}`;
            } else if (numericAmount > maxAmount) {
              newErrors.amount = `Maximum amount is ₦${maxAmount.toLocaleString()}`;
            } else if (numericAmount > walletBalance) {
              newErrors.amount = "Insufficient wallet balance";
            }
          }
        }
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

      const response = await vtpassAirtimeApi.purchaseAirtime({
        serviceID: selectedServiceId!,
        amount: parseFloat(amount),
        phone: phoneNumber,
        request_id: requestId,
      });

      if (response.success) {
        onSuccess(response.data);
        // Reset form on success
        setPhoneNumber("");
        setAmount("");
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

  const selectedService = services.find((s) => s.serviceID === selectedServiceId);
  const minAmount = selectedService ? parseFloat(selectedService.minimium_amount) : 50;
  const maxAmount = selectedService ? parseFloat(selectedService.maximum_amount) : 100000;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Server Error */}
      {serverError && <FormError message={serverError} />}

      {/* Network Selection */}
      <div>
        <label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block text-brand-text-primary">
          Select Network Provider
          <span className="text-red-500 ml-1">*</span>
        </label>
        <NetworkSelector
          services={services}
          selectedServiceId={selectedServiceId}
          onSelect={setSelectedServiceId}
          isLoading={loadingServices}
        />
        {errors.serviceId && (
          <p className="text-xs text-red-600 mt-2">{errors.serviceId}</p>
        )}
      </div>

      {/* Phone Number and Amount - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <PhoneNumberInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          error={errors.phoneNumber}
          disabled={isSubmitting || loadingServices}
        />

        <AmountInput
          value={amount}
          onChange={setAmount}
          error={errors.amount}
          disabled={isSubmitting || loadingServices}
          min={minAmount}
          max={maxAmount}
          presetAmounts={[100, 200, 500, 1000, 2000, 5000]}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-10 sm:h-12 bg-brand-bg-primary hover:bg-brand-bg-primary/90 text-sm sm:text-lg font-semibold"
        disabled={
          isSubmitting ||
          loadingServices ||
          !selectedServiceId ||
          !phoneNumber ||
          !amount
        }
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Purchase Airtime"
        )}
      </Button>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-blue-800">
          <strong>Note:</strong> Airtime will be delivered instantly to the phone number
          provided. Make sure the number is correct before proceeding.
        </p>
      </div>

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPurchase}
        network={selectedService || null}
        phoneNumber={phoneNumber}
        amount={parseFloat(amount) || 0}
        isLoading={isSubmitting}
      />
    </form>
  );
}
