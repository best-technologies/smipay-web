"use client";

import { X, Tv, Wallet, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  planName: string;
  smartcardNumber: string;
  amount: number;
  subscriptionType?: "change" | "renew";
  isLoading?: boolean;
  isShowmax?: boolean;
}

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  planName,
  smartcardNumber,
  amount,
  subscriptionType,
  isLoading = false,
  isShowmax = false,
}: PurchaseConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border-2 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-bg-primary to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Confirm Purchase</h2>
          </div>
          <p className="text-blue-100 text-sm">
            Please review your purchase details before proceeding
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Purchase Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            {/* Provider */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Tv className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-text-secondary">Provider</p>
                  <p className="font-semibold text-brand-text-primary">
                    {serviceName.replace(" Subscription", "")}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Plan */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Tv className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-text-secondary">
                    {subscriptionType === "renew" ? "Current Plan" : "Subscription Plan"}
                  </p>
                  <p className="font-semibold text-brand-text-primary">
                    {planName || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Smartcard/Phone Number */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-text-secondary">
                    {isShowmax ? "Phone Number" : "Smartcard Number"}
                  </p>
                  <p className="font-semibold text-brand-text-primary font-mono">
                    {smartcardNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Wallet className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-text-secondary">Amount</p>
                  <p className="font-semibold text-brand-text-primary text-lg">
                    ₦{amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>You are {subscriptionType === "renew" ? "renewing" : "purchasing"}:</strong>{" "}
              {subscriptionType === "renew" ? (
                <>
                  Renewal of <strong>{planName}</strong> for <strong>{smartcardNumber}</strong> on{" "}
                  <strong>{serviceName.replace(" Subscription", "")}</strong> for{" "}
                  <strong>₦{amount.toLocaleString()}</strong>.
                </>
              ) : (
                <>
                  <strong>{planName}</strong> subscription for{" "}
                  <strong>{smartcardNumber}</strong> on{" "}
                  <strong>{serviceName.replace(" Subscription", "")}</strong> for{" "}
                  <strong>₦{amount.toLocaleString()}</strong>.
                </>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-brand-bg-primary hover:bg-brand-bg-primary/90"
            >
              {isLoading ? "Processing..." : "Confirm Purchase"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
