"use client";

import { useState, useEffect } from "react";
import { WalletAnalysisCards } from "@/components/dashboard/WalletAnalysisCards";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { NetworkSelector } from "../data-components/data/NetworkSelector";
import { DataPlanSelector } from "../data-components/data/DataPlanSelector";
import { DataPurchaseForm } from "../data-components/data/DataPurchaseForm";
import { TransactionStatusModal } from "../data-components/data/TransactionStatusModal";
import { useVtpassDataServiceIds } from "@/hooks/vtpass/vtu/useVtpassDataServiceIds";
import { useVtpassDataVariationCodes } from "@/hooks/vtpass/vtu/useVtpassDataVariationCodes";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { FormError } from "@/components/auth/FormError";
import type { VtpassDataVariation, VtpassDataPurchaseResponse } from "@/types/vtpass/vtu/vtpass-data";

export default function VtpassDataPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { dashboardData, refetch } = useDashboard();
  const { serviceIds: allServices, isLoading: loadingServices, error: servicesError } = useVtpassDataServiceIds();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedVariationCode, setSelectedVariationCode] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<VtpassDataVariation | null>(null);
  const [showPurchaseView, setShowPurchaseView] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "success" | "processing" | "error" | null
  >(null);
  const [transactionData, setTransactionData] = useState<VtpassDataPurchaseResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Fetch variation codes when a service is selected
  const { variationCodes, isLoading: loadingVariations, error: variationsError } = useVtpassDataVariationCodes(selectedServiceId);

  // Get wallet balance from cached dashboard data
  const walletBalance = dashboardData
    ? parseFloat(dashboardData.wallet_card.current_balance.replace(/,/g, ""))
    : 0;

  // Filter out non-standard providers if needed (similar to airtime)
  const services = allServices.filter(
    (service) => {
      // Keep only standard network providers for now
      const standardProviders = ["mtn-data", "glo-data", "airtel-data", "etisalat-data"];
      return standardProviders.includes(service.serviceID);
    }
  );

  // Auto-select first service when services are loaded
  useEffect(() => {
    if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].serviceID);
    }
  }, [services, selectedServiceId]);

  // Reset selected variation and purchase view when service changes
  useEffect(() => {
    setSelectedVariationCode(null);
    setSelectedVariation(null);
    setShowPurchaseView(false);
  }, [selectedServiceId]);

  const handleSelectPlan = (variation: VtpassDataVariation) => {
    setSelectedVariationCode(variation.variation_code);
    setSelectedVariation(variation);
    setShowPurchaseView(true); // Navigate to purchase view
  };

  const handleBackToPlans = () => {
    setShowPurchaseView(false);
    // Keep the selection so user can see what they selected if they come back
  };

  const handleTransactionSuccess = (data: VtpassDataPurchaseResponse) => {
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

  // Get selected variation object
  const getSelectedVariation = (): VtpassDataVariation | null => {
    if (!selectedVariationCode || !variationCodes) return null;
    
    const allVariations = Object.values(variationCodes.variations_categorized)
      .flatMap((cat) => cat.variations);
    
    return allVariations.find((v) => v.variation_code === selectedVariationCode) || null;
  };

  const currentVariation = selectedVariation || getSelectedVariation();
  const selectedService = services.find((s) => s.serviceID === selectedServiceId);

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
              <h1 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Buy Data
              </h1>
              <p className="text-sm text-brand-text-secondary mt-1">
                Purchase data bundles using VTPass provider
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
          {!showPurchaseView ? (
            <>
              {/* Network Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                  Select Network Provider
                </h2>
                
                {servicesError && (
                  <div className="mb-4">
                    <FormError message={servicesError} />
                  </div>
                )}

                <NetworkSelector
                  services={services}
                  selectedServiceId={selectedServiceId}
                  onSelect={setSelectedServiceId}
                  isLoading={loadingServices}
                />

                {selectedServiceId && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Selected:</strong> {services.find(s => s.serviceID === selectedServiceId)?.name || "N/A"}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Next step: Select a data plan for this network
                    </p>
                  </div>
                )}
              </div>

              {/* Data Plan Selection */}
              {selectedServiceId && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
                  {variationsError && (
                    <div className="mb-4">
                      <FormError message={variationsError} />
                    </div>
                  )}
                  
                  <DataPlanSelector
                    variationCodes={variationCodes}
                    isLoading={loadingVariations}
                    error={variationsError}
                    onSelectPlan={handleSelectPlan}
                    selectedVariationCode={selectedVariationCode}
                  />
                </div>
              )}
            </>
          ) : (
            /* Purchase View - Mini Page */
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
              {/* Back Button and Title */}
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToPlans}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <h2 className="text-lg font-semibold text-slate-800">
                  Complete Purchase
                </h2>
              </div>

              {/* Selected Plan Summary */}
              {currentVariation && selectedService && (
                <div className="bg-gradient-to-r from-brand-bg-primary/5 to-indigo-50 rounded-lg p-4 mb-6 border border-brand-bg-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Network</p>
                      <p className="font-semibold text-slate-800">
                        {selectedService.name.replace(" Data", "").replace(" (SME)", "")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Data Plan</p>
                      <p className="font-semibold text-slate-800">{currentVariation.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 mb-1">Amount</p>
                      <p className="text-xl font-bold text-brand-bg-primary">
                        ₦{parseFloat(currentVariation.variation_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Purchase Form */}
              {currentVariation && selectedServiceId && selectedService && (
                <DataPurchaseForm
                  selectedServiceId={selectedServiceId}
                  selectedVariation={currentVariation}
                  serviceName={selectedService.name}
                  onSuccess={handleTransactionSuccess}
                  onError={handleTransactionError}
                  walletBalance={walletBalance}
                />
              )}
            </div>
          )}
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
