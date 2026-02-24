"use client";

import { useState, useEffect, useMemo } from "react";
import { NetworkSelector } from "./NetworkSelector";
import { PhoneNumberInput } from "./PhoneNumberInput";
import { AmountInput } from "./AmountInput";
import { FormError } from "@/components/auth/FormError";
import { Loader2, Zap, ShieldCheck } from "lucide-react";
import { useVtpassServiceIds } from "@/hooks/vtpass/vtu/useVtpassServiceIds";
import { vtpassAirtimeApi } from "@/services/vtpass/vtu/vtpass-airtime-api";
import { PurchaseConfirmationModal } from "./PurchaseConfirmationModal";
import type { VtpassPurchaseResponse } from "@/services/vtpass/vtu/vtpass-airtime-api";

interface AirtimeFormProps {
  onSuccess: (data: VtpassPurchaseResponse) => void;
  onError: (error: string) => void;
  walletBalance: number;
}

export function AirtimeForm({ onSuccess, onError, walletBalance }: AirtimeFormProps) {
  const { serviceIds: allServices, isLoading: loadingServices, error: servicesError } = useVtpassServiceIds();

  const services = useMemo(
    () => allServices.filter(
      (service) => service.serviceID !== "foreign-airtime" && service.serviceID !== "international"
    ),
    [allServices],
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

  useEffect(() => {
    if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].serviceID);
    }
  }, [services, selectedServiceId]);

  useEffect(() => {
    if (selectedServiceId && services.length > 0) {
      const service = services.find((s) => s.serviceID === selectedServiceId);
      if (service) {
        const minAmount = parseFloat(service.minimium_amount);
        const maxAmount = parseFloat(service.maximum_amount);
        const currentAmount = parseFloat(amount) || 0;

        if (currentAmount > 0 && (currentAmount < minAmount || currentAmount > maxAmount)) {
          setAmount("");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId, services]);

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
            newErrors.amount = `Minimum ₦${minAmount.toLocaleString()}`;
          } else if (numericAmount > maxAmount) {
            newErrors.amount = `Maximum ₦${maxAmount.toLocaleString()}`;
          } else if (numericAmount > walletBalance) {
            newErrors.amount = "Insufficient balance";
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

      const response = await vtpassAirtimeApi.purchaseAirtime({
        serviceID: selectedServiceId!,
        amount: parseFloat(amount),
        phone: phoneNumber,
        request_id: requestId,
      });

      if (response.success) {
        onSuccess(response.data);
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

  const isFormReady = selectedServiceId && phoneNumber && amount && !isSubmitting && !loadingServices;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && <FormError message={serverError} />}

      {/* Row 1: Network dropdown + Phone number */}
      <div>
        <div className="flex items-end gap-3">
          <NetworkSelector
            services={services}
            selectedServiceId={selectedServiceId}
            onSelect={setSelectedServiceId}
            isLoading={loadingServices}
          />
          <PhoneNumberInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            error={errors.phoneNumber}
            disabled={isSubmitting || loadingServices}
          />
        </div>
        {errors.serviceId && (
          <p className="text-[12px] text-red-500 font-medium mt-1.5">{errors.serviceId}</p>
        )}
      </div>

      {/* Row 2: Amount */}
      <AmountInput
        value={amount}
        onChange={setAmount}
        error={errors.amount}
        disabled={isSubmitting || loadingServices}
        min={minAmount}
        max={maxAmount}
        presetAmounts={[100, 200, 500, 1000, 2000, 5000]}
      />

      {/* Pay button */}
      <button
        type="submit"
        disabled={!isFormReady}
        className="w-full flex items-center justify-center gap-2 h-12 sm:h-[52px] rounded-xl bg-brand-bg-primary text-white font-semibold text-[15px] sm:text-base transition-all active:scale-[0.99] touch-manipulation shadow-lg shadow-brand-bg-primary/20 hover:shadow-xl hover:shadow-brand-bg-primary/25 hover:bg-brand-bg-primary/90 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Zap className="h-4 w-4" strokeWidth={2.5} />
            Purchase Airtime
          </>
        )}
      </button>

      {/* Info footer */}
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <p className="text-[12px] text-dashboard-muted">
          Instant delivery &middot; Double-check number before paying
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
        walletBalance={walletBalance}
        isLoading={isSubmitting}
      />
    </form>
  );
}
