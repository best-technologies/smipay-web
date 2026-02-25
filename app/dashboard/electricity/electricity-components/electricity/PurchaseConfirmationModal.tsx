"use client";

import Image from "next/image";
import { X, Wallet, CheckCircle2, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNetworkLogo } from "@/lib/network-logos";
import type { MeterType } from "@/types/vtpass/vtu/vtpass-electricity";

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  serviceID: string;
  meterNumber: string;
  meterType: MeterType;
  customerName: string;
  amount: number;
  walletBalance?: number;
  isLoading?: boolean;
}

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  serviceID,
  meterNumber,
  meterType,
  customerName,
  amount,
  walletBalance,
  isLoading = false,
}: PurchaseConfirmationModalProps) {
  if (!isOpen) return null;

  const shortName = serviceName
    .replace(/Electric.*$/i, "")
    .replace(/Payment.*$/i, "")
    .replace(/-/g, " ")
    .trim();
  const logo = getNetworkLogo(serviceID);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
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
          <p className="text-white/70 text-xs ml-12">Review details before proceeding</p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-dashboard-border/80 bg-dashboard-bg/60 p-4 space-y-3">
            {/* Provider */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {logo ? (
                  <div className="relative h-9 w-9 rounded-xl overflow-hidden ring-1 ring-dashboard-border/40 shrink-0">
                    <Image src={logo} alt={shortName} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="p-1.5 bg-quick-action-4-bg rounded-lg">
                    <Zap className="h-5 w-5 text-quick-action-4" />
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-dashboard-muted">Provider</p>
                  <p className="font-semibold text-sm text-dashboard-heading">{shortName}</p>
                </div>
              </div>
            </div>

            {/* Customer */}
            <div className="pt-3 border-t border-dashboard-border/60">
              <p className="text-[10px] text-dashboard-muted">Customer</p>
              <p className="font-semibold text-sm text-dashboard-heading">{customerName}</p>
            </div>

            {/* Meter */}
            <div className="pt-3 border-t border-dashboard-border/60 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-dashboard-muted">Meter Number</p>
                <p className="font-semibold text-sm text-dashboard-heading font-mono">{meterNumber}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {meterType === "prepaid" ? (
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                )}
                <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                  meterType === "prepaid"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-blue-50 text-blue-700"
                }`}>
                  {meterType}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="pt-3 border-t border-dashboard-border/60">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-quick-action-4-bg rounded-lg">
                  <Wallet className="h-4 w-4 text-quick-action-4" />
                </div>
                <div>
                  <p className="text-[10px] text-dashboard-muted">Amount</p>
                  <p className="font-bold text-lg text-brand-bg-primary tabular-nums">
                    ₦{amount.toLocaleString()}
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
                  {amount <= walletBalance && (
                    <span className="ml-2 text-green-600 font-medium">Sufficient</span>
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
