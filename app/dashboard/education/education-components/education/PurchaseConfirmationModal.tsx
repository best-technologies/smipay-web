"use client";

import { X, Wallet, CheckCircle2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  variationName: string;
  phone: string;
  amount: number;
  quantity: number;
  profileId?: string;
  customerName?: string;
  walletBalance?: number;
  isLoading?: boolean;
}

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  variationName,
  phone,
  amount,
  quantity,
  profileId,
  customerName,
  walletBalance,
  isLoading = false,
}: PurchaseConfirmationModalProps) {
  if (!isOpen) return null;

  const totalAmount = amount * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-dashboard-surface rounded-2xl shadow-xl max-w-md w-full border border-dashboard-border/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-bg-primary p-5 text-white relative">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-white/20 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">Confirm Purchase</h2>
          </div>
          <p className="text-white/70 text-xs ml-12">
            Review details before proceeding
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-dashboard-border/80 bg-dashboard-bg/60 p-4 space-y-3">
            {/* Product */}
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] text-dashboard-muted">Product</p>
                <p className="font-semibold text-sm text-dashboard-heading">
                  {productName}
                </p>
              </div>
            </div>

            {/* Variation */}
            <div className="pt-3 border-t border-dashboard-border/60">
              <p className="text-[10px] text-dashboard-muted">Plan</p>
              <p className="font-semibold text-sm text-dashboard-heading">
                {variationName}
              </p>
            </div>

            {/* JAMB profile */}
            {profileId && (
              <div className="pt-3 border-t border-dashboard-border/60">
                <p className="text-[10px] text-dashboard-muted">
                  JAMB Profile ID
                </p>
                <p className="font-semibold text-sm text-dashboard-heading font-mono">
                  {profileId}
                </p>
                {customerName && (
                  <p className="text-xs text-dashboard-muted mt-0.5">
                    {customerName}
                  </p>
                )}
              </div>
            )}

            {/* Phone */}
            <div className="pt-3 border-t border-dashboard-border/60">
              <p className="text-[10px] text-dashboard-muted">Phone Number</p>
              <p className="font-semibold text-sm text-dashboard-heading font-mono">
                {phone}
              </p>
            </div>

            {/* Quantity */}
            {quantity > 1 && (
              <div className="pt-3 border-t border-dashboard-border/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-dashboard-muted">Quantity</p>
                  <p className="font-semibold text-sm text-dashboard-heading">
                    {quantity} × ₦{amount.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Amount */}
            <div className="pt-3 border-t border-dashboard-border/60">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-quick-action-4-bg rounded-lg">
                  <Wallet className="h-4 w-4 text-quick-action-4" />
                </div>
                <div>
                  <p className="text-[10px] text-dashboard-muted">
                    Total Amount
                  </p>
                  <p className="font-bold text-lg text-brand-bg-primary tabular-nums">
                    ₦{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {walletBalance !== undefined && (
              <div className="pt-3 border-t border-dashboard-border/60">
                <p className="text-[10px] text-dashboard-muted">
                  Wallet Balance:{" "}
                  <span className="font-semibold text-dashboard-heading">
                    ₦{walletBalance.toLocaleString()}
                  </span>
                  {totalAmount <= walletBalance && (
                    <span className="ml-2 text-green-600 font-medium">
                      Sufficient
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl h-11 border-dashboard-border text-dashboard-heading hover:bg-dashboard-bg"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-xl h-11 bg-brand-bg-primary hover:bg-brand-bg-primary/90 text-white font-semibold"
            >
              {isLoading ? "Processing…" : "Confirm"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
