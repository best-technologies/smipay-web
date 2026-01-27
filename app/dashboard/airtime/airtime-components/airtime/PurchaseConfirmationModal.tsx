"use client";

import { X, Smartphone, Wallet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VtpassService } from "@/services/vtpass-airtime-api";

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  network: VtpassService | null;
  phoneNumber: string;
  amount: number;
  isLoading?: boolean;
}

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  network,
  phoneNumber,
  amount,
  isLoading = false,
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
            {/* Network */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-text-secondary">Network Provider</p>
                  <p className="font-semibold text-brand-text-primary">
                    {network?.name.replace(" Airtime", "") || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-text-secondary">Phone Number</p>
                  <p className="font-semibold text-brand-text-primary font-mono">
                    {phoneNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Wallet className="h-5 w-5 text-purple-600" />
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
              <strong>You are purchasing:</strong> ₦{amount.toLocaleString()} airtime for{" "}
              <strong>{phoneNumber}</strong> on{" "}
              <strong>{network?.name.replace(" Airtime", "") || "N/A"}</strong> network.
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
