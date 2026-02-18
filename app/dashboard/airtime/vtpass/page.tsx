"use client";

import { useState, useEffect } from "react";
import { WalletAnalysisCards } from "@/components/dashboard/WalletAnalysisCards";
import { AirtimeForm } from "@/app/dashboard/airtime/airtime-components/airtime/AirtimeForm";
import { TransactionStatusModal } from "@/app/dashboard/airtime/airtime-components/airtime/TransactionStatusModal";
import { Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import type { VtpassPurchaseResponse } from "@/services/vtpass/vtu/vtpass-airtime-api";
import { Loader2 } from "lucide-react";

export default function VtpassAirtimePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { dashboardData, refetch } = useDashboard();
  const [transactionStatus, setTransactionStatus] = useState<
    "success" | "processing" | "error" | null
  >(null);
  const [transactionData, setTransactionData] = useState<VtpassPurchaseResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Get wallet balance from cached dashboard data
  const walletBalance = dashboardData
    ? parseFloat(dashboardData.wallet_card.current_balance.replace(/,/g, ""))
    : 0;

  const handleTransactionSuccess = (data: VtpassPurchaseResponse) => {
    setTransactionData(data);

    // Determine status based on response
    if (data.status === "processing" || data.content?.transactions?.status === "pending" || data.content?.transactions?.status === "initiated") {
      setTransactionStatus("processing");
    } else if (
      data.code === "000" &&
      data.content?.transactions?.status === "delivered"
    ) {
      setTransactionStatus("success");
    } else {
      setTransactionStatus("error");
      setErrorMessage(data.response_description || "Transaction failed");
    }

    // Refresh wallet balance after transaction - invalidate cache
    refetch();
  };

  const handleTransactionError = (error: string) => {
    setErrorMessage(error);
    setTransactionStatus("error");
  };

  const handleModalClose = () => {
    setTransactionStatus(null);
    setTransactionData(null);
    setErrorMessage("");
    // Refresh wallet balance - invalidate cache to get latest data
    refetch();
  };

  const handleRetry = () => {
    setTransactionStatus(null);
    setTransactionData(null);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-text-primary flex items-center gap-2">
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6" />
                Buy Airtime
              </h1>
              <p className="text-xs sm:text-sm text-brand-text-secondary mt-0.5 sm:mt-1">
                Purchase airtime for any network provider
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Wallet Analysis Cards - Global Component */}
        <WalletAnalysisCards />
        
        <div className="max-w-4xl">

          {/* Airtime Purchase Form */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100">
            <AirtimeForm
              onSuccess={handleTransactionSuccess}
              onError={handleTransactionError}
              walletBalance={walletBalance}
            />
          </div>
        </div>
      </div>

      {/* Transaction Status Modal */}
      {transactionStatus && (
        <TransactionStatusModal
          isOpen={!!transactionStatus}
          onClose={handleModalClose}
          status={transactionStatus}
          transactionData={transactionData || undefined}
          errorMessage={errorMessage || undefined}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
