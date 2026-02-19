"use client";

import { X, Smartphone, Wallet, CheckCircle2, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  networkName: string;
  planName: string;
  phoneNumber: string;
  amount: number;
  isLoading?: boolean;
}

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  networkName,
  planName,
  phoneNumber,
  amount,
  isLoading = false,
}: PurchaseConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-dashboard-surface rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full border border-dashboard-border/80 overflow-hidden max-h-[90dvh] sm:max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-brand-bg-primary p-4 sm:p-5 text-white shrink-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 -m-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 pr-10">
            <div className="p-2 bg-white/20 rounded-xl">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Confirm purchase</h2>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5">Review details before paying</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          <div className="rounded-xl border border-dashboard-border/80 bg-dashboard-bg/60 p-4 space-y-4">
            {/* Network */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-quick-action-1-bg rounded-xl shrink-0">
                <Wifi className="h-5 w-5 text-quick-action-1" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-dashboard-muted">Network</p>
                <p className="font-semibold text-dashboard-heading truncate">
                  {networkName.replace(" Data", "").replace(" (SME)", "") || "N/A"}
                </p>
              </div>
            </div>
            {/* Plan */}
            <div className="flex items-center gap-3 min-w-0 pt-3 border-t border-dashboard-border/80">
              <div className="p-2 bg-quick-action-2-bg rounded-xl shrink-0">
                <Wifi className="h-5 w-5 text-quick-action-2" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-dashboard-muted">Data Plan</p>
                <p className="font-semibold text-dashboard-heading truncate">{planName || "N/A"}</p>
              </div>
            </div>
            {/* Phone */}
            <div className="flex items-center gap-3 min-w-0 pt-3 border-t border-dashboard-border/80">
              <div className="p-2 bg-quick-action-4-bg rounded-xl shrink-0">
                <Smartphone className="h-5 w-5 text-quick-action-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-dashboard-muted">Phone</p>
                <p className="font-semibold text-dashboard-heading font-mono truncate">{phoneNumber || "N/A"}</p>
              </div>
            </div>
            {/* Amount */}
            <div className="flex items-center gap-3 min-w-0 pt-3 border-t border-dashboard-border/80">
              <div className="p-2 bg-quick-action-3-bg rounded-xl shrink-0">
                <Wallet className="h-5 w-5 text-quick-action-3" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-dashboard-muted">Amount</p>
                <p className="font-semibold text-dashboard-heading text-lg">₦{amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-dashboard-border/80 bg-dashboard-bg/50 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-dashboard-muted">
              <strong className="text-dashboard-heading">{planName}</strong> for{" "}
              <strong className="text-dashboard-heading">{phoneNumber}</strong> on{" "}
              <strong className="text-dashboard-heading">{networkName.replace(" Data", "").replace(" (SME)", "") || "N/A"}</strong> –{" "}
              <strong className="text-dashboard-heading">₦{amount.toLocaleString()}</strong>.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 min-h-12 rounded-xl border-dashboard-border text-dashboard-heading touch-manipulation"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 min-h-12 rounded-xl bg-brand-bg-primary hover:bg-brand-bg-primary/90 touch-manipulation"
            >
              {isLoading ? "Processing…" : "Pay ₦" + amount.toLocaleString()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
