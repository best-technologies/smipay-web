"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { walletApi } from "@/services/wallet-api";

interface PaymentVerificationProps {
  reference: string;
  onSuccess: (data: {
    amount: string;
    balance_after?: string;
  }) => void;
  onError: (message: string) => void;
  onRetry: () => void;
}

type VerificationState = "verifying" | "success" | "failed" | "error";

export function PaymentVerification({
  reference,
  onSuccess,
  onError,
  onRetry,
}: PaymentVerificationProps) {
  const [state, setState] = useState<VerificationState>("verifying");
  const [message, setMessage] = useState<string>("");
  const [verificationData, setVerificationData] = useState<{
    amount: string;
    balance_after?: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    const verifyPayment = async () => {
      try {
        const response = await walletApi.verifyPaystackFunding(reference);

        if (!isMounted) return;

        if (response.success && response.data) {
          setState("success");
          setMessage(response.message);
          setVerificationData({
            amount: response.data.amount,
            balance_after: response.data.balance_after,
          });
          
          // Notify parent of success
          onSuccess({
            amount: response.data.amount,
            balance_after: response.data.balance_after,
          });
        } else {
          // Payment verification failed but API call succeeded
          setState("failed");
          setMessage(response.message || "Payment verification failed");
          onError(response.message || "Payment verification failed");
        }
      } catch (error) {
        if (!isMounted) return;

        // Retry logic for network errors or timeout
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(() => {
            if (isMounted) {
              verifyPayment();
            }
          }, retryDelay);
        } else {
          setState("error");
          const errorMessage = error instanceof Error ? error.message : "Failed to verify payment";
          setMessage(errorMessage);
          onError(errorMessage);
        }
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [reference, onSuccess, onError]);

  return (
    <div className="space-y-6 py-4">
      {/* Status Icon */}
      <div className="flex justify-center">
        {state === "verifying" && (
          <div className="p-4 bg-blue-100 rounded-full">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        )}
        {state === "success" && (
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        )}
        {state === "failed" && (
          <div className="p-4 bg-red-100 rounded-full">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
        )}
        {state === "error" && (
          <div className="p-4 bg-orange-100 rounded-full">
            <AlertTriangle className="h-12 w-12 text-orange-600" />
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="text-center">
        {state === "verifying" && (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Payment
            </h3>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </>
        )}
        {state === "success" && (
          <>
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-4">Deposit verified successfully</p>
            {verificationData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-900 mb-1">
                  <span className="font-semibold">Amount Credited:</span>
                </p>
                <p className="text-2xl font-bold text-green-700">
                  ₦{verificationData.amount}
                </p>
                {verificationData.balance_after && (
                  <p className="text-sm text-green-800 mt-2">
                    New Balance: ₦{verificationData.balance_after}
                  </p>
                )}
              </div>
            )}
          </>
        )}
        {state === "failed" && (
          <>
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Payment Failed
            </h3>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        {state === "error" && (
          <>
            <h3 className="text-xl font-semibold text-orange-700 mb-2">
              Verification Error
            </h3>
            <p className="text-gray-600 mb-2">{message}</p>
            <p className="text-sm text-gray-500">
              We couldn&apos;t verify your payment at this time. Please try again.
            </p>
          </>
        )}
      </div>

      {/* Additional Information */}
      {state === "verifying" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-semibold mb-1">What&apos;s happening?</p>
          <ul className="space-y-1">
            <li>• Confirming payment with Paystack</li>
            <li>• Updating your wallet balance</li>
            <li>• Recording transaction</li>
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      {(state === "failed" || state === "error") && (
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onRetry}
            className="flex-1 bg-brand-bg-primary hover:bg-brand-bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Reference Display */}
      <div className="text-center text-xs text-gray-500">
        Reference: {reference}
      </div>
    </div>
  );
}

