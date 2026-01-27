"use client";

import { X, CheckCircle2, Clock, AlertCircle, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { VtpassPurchaseResponse } from "@/services/vtpass-airtime-api";

interface TransactionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "processing" | "error";
  transactionData?: VtpassPurchaseResponse;
  errorMessage?: string;
  onRetry?: () => void;
}

export function TransactionStatusModal({
  isOpen,
  onClose,
  status,
  transactionData,
  errorMessage,
  onRetry,
}: TransactionStatusModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyTransactionId = () => {
    if (transactionData?.content?.transactions?.transactionId) {
      navigator.clipboard.writeText(
        transactionData.content.transactions.transactionId
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: CheckCircle2,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          title: "Airtime Purchase Successful!",
          description: "Your airtime has been successfully credited to the phone number.",
        };
      case "processing":
        return {
          icon: Clock,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          title: "Transaction Processing",
          description:
            "Your transaction is being processed. This may take a few minutes. You'll receive a notification once it's completed.",
        };
      case "error":
        return {
          icon: AlertCircle,
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          title: "Transaction Failed",
          description: "An error occurred while processing your transaction.",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;
  const transactionId =
    transactionData?.content?.transactions?.transactionId ||
    transactionData?.requestId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={`bg-white rounded-xl shadow-xl max-w-md w-full ${config.borderColor} border-2 overflow-hidden`}
      >
        {/* Header */}
        <div className={`${config.bgColor} p-6 text-center relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            disabled={status === "processing"}
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex justify-center mb-4">
            {status === "processing" ? (
              <Loader2 className={`h-16 w-16 ${config.iconColor} animate-spin`} />
            ) : (
              <Icon className={`h-16 w-16 ${config.iconColor}`} />
            )}
          </div>
          <h2 className="text-2xl font-bold text-brand-text-primary mb-2">
            {config.title}
          </h2>
          <p className="text-sm text-brand-text-secondary">{config.description}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {status === "success" && transactionData?.content?.transactions && (
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-text-secondary">Phone Number:</span>
                <span className="font-semibold text-brand-text-primary">
                  {transactionData.content.transactions.unique_element}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-text-secondary">Amount:</span>
                <span className="font-semibold text-brand-text-primary">
                  ₦{parseFloat(transactionData.content.transactions.amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-text-secondary">Product:</span>
                <span className="font-semibold text-brand-text-primary">
                  {transactionData.content.transactions.product_name}
                </span>
              </div>
              {transactionId && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm text-brand-text-secondary">
                    Transaction ID:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-brand-text-primary">
                      {transactionId.slice(0, 12)}...
                    </span>
                    <button
                      onClick={copyTransactionId}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copy transaction ID"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-brand-text-secondary" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "processing" && transactionData && (
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-text-secondary">Request ID:</span>
                <span className="font-mono text-xs text-brand-text-primary">
                  {transactionData.requestId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-text-secondary">Amount:</span>
                <span className="font-semibold text-brand-text-primary">
                  ₦{transactionData.amount.toLocaleString()}
                </span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Processing transactions may take a few minutes.
                  You'll receive a notification once the transaction is completed.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{config.description}</p>
              {errorMessage?.includes("Insufficient") && (
                <Button
                  onClick={() => {
                    onClose();
                    // Navigate to fund wallet - you might want to pass a callback
                    window.location.href = "/dashboard";
                  }}
                  className="mt-3 w-full bg-brand-bg-primary hover:bg-brand-bg-primary/90"
                >
                  Fund Wallet
                </Button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {status === "error" && onRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                className="flex-1"
              >
                Try Again
              </Button>
            )}
            <Button
              onClick={onClose}
              className={`flex-1 ${
                status === "success"
                  ? "bg-brand-bg-primary hover:bg-brand-bg-primary/90"
                  : status === "processing"
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-brand-bg-primary hover:bg-brand-bg-primary/90"
              }`}
              disabled={status === "processing"}
            >
              {status === "processing" ? "Processing..." : "Close"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
