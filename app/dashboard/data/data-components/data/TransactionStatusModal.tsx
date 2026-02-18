"use client";

import { X, CheckCircle2, Clock, AlertCircle, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { VtpassDataPurchaseResponse } from "@/types/vtpass/vtu/vtpass-data";

interface TransactionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "processing" | "error";
  transactionData?: VtpassDataPurchaseResponse;
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
          title: "Data Purchase Successful!",
          description: "Your data bundle has been successfully credited to the phone number.",
        };
      case "processing":
        return {
          icon: Clock,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          title: "Transaction Processing",
          description:
            "Your transaction is being processed. This may take a few minutes. You'll receive a notification once it's completed. You don't need to wait on this page.",
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
        <div className={`${config.bgColor} p-4 sm:p-6 text-center relative`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
          <div className="flex justify-center mb-3 sm:mb-4">
            {status === "processing" ? (
              <Loader2 className={`h-12 w-12 sm:h-16 sm:w-16 ${config.iconColor} animate-spin`} />
            ) : (
              <Icon className={`h-12 w-12 sm:h-16 sm:w-16 ${config.iconColor}`} />
            )}
          </div>
          <h2 className={`text-lg sm:text-2xl font-bold ${config.iconColor.replace("text-", "text-")} mb-1.5 sm:mb-2`}>
            {config.title}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">{config.description}</p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {status === "success" && transactionData?.content?.transactions && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2.5 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Product:</span>
                <span className="font-semibold text-sm sm:text-base text-gray-900">
                  {transactionData.content.transactions.product_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Phone Number:</span>
                <span className="font-semibold text-sm sm:text-base text-gray-900 font-mono">
                  {transactionData.content.transactions.unique_element}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Amount:</span>
                <span className="font-semibold text-sm sm:text-base text-gray-900">
                  ₦{parseFloat(String(transactionData.content.transactions.amount)).toLocaleString()}
                </span>
              </div>
              {transactionId && (
                <div className="flex justify-between items-center pt-2.5 sm:pt-3 border-t border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Transaction ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] sm:text-xs text-gray-700 truncate max-w-[100px] sm:max-w-[120px]">
                      {transactionId}
                    </span>
                    <button
                      onClick={copyTransactionId}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copy Transaction ID"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "processing" && transactionData && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-yellow-800 mb-1.5 sm:mb-2">
                <strong>Request ID:</strong> {transactionData.requestId}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3 mt-2 sm:mt-3">
                <p className="text-[10px] sm:text-xs text-blue-800">
                  <strong>Note:</strong> You can close this window and continue using the app. 
                  You'll receive a notification once the transaction is completed.
                </p>
              </div>
            </div>
          )}

          {status === "error" && errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-red-800 font-medium mb-0.5 sm:mb-1">Error Details:</p>
              <p className="text-xs sm:text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3 pt-2">
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
              className={status === "error" && onRetry ? "flex-1" : "w-full"}
            >
              {status === "processing" ? "Close & Continue" : "Close"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
