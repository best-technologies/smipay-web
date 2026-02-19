"use client";

import { useState, useEffect } from "react";
import { WalletAnalysisCards } from "@/components/dashboard/WalletAnalysisCards";
import { Tv, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getNetworkLogo } from "@/lib/network-logos";
import { useRouter } from "next/navigation";
import { ProviderSelector } from "../cable-components/cable/ProviderSelector";
import { PlanSelector } from "../cable-components/cable/PlanSelector";
import { SmartcardVerificationForm } from "../cable-components/cable/SmartcardVerificationForm";
import { CablePurchaseForm } from "../cable-components/cable/CablePurchaseForm";
import { TransactionStatusModal } from "../cable-components/cable/TransactionStatusModal";
import { useVtpassCableServiceIds } from "@/hooks/vtpass/vtu/useVtpassCableServiceIds";
import { useVtpassCableVariationCodes } from "@/hooks/vtpass/vtu/useVtpassCableVariationCodes";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { FormError } from "@/components/auth/FormError";
import type { 
  VtpassCableVariation, 
  VtpassCablePurchaseResponse,
  VtpassCableVerifyContent 
} from "@/types/vtpass/vtu/vtpass-cable";

interface VtpassCabletvPageProps {
  initialServiceId?: string;
}

export default function VtpassCabletvPage({ initialServiceId }: VtpassCabletvPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { dashboardData, refetch } = useDashboard();
  const { serviceIds: allServices, isLoading: loadingServices, error: servicesError } = useVtpassCableServiceIds();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedVariationCode, setSelectedVariationCode] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<VtpassCableVariation | null>(null);
  const [showPurchaseView, setShowPurchaseView] = useState(false);
  const [verificationData, setVerificationData] = useState<VtpassCableVerifyContent | null>(null);
  const [verifiedSmartcardNumber, setVerifiedSmartcardNumber] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<
    "success" | "processing" | "error" | null
  >(null);
  const [transactionData, setTransactionData] = useState<VtpassCablePurchaseResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Fetch variation codes when a service is selected
  const { variationCodes, isLoading: loadingVariations, error: variationsError } = useVtpassCableVariationCodes(selectedServiceId);

  // Get wallet balance from cached dashboard data
  const walletBalance = dashboardData
    ? parseFloat(dashboardData.wallet_card.current_balance.replace(/,/g, ""))
    : 0;

  // Determine if provider supports verification
  const serviceIdLower = selectedServiceId?.toLowerCase() || "";
  const supportsVerification = serviceIdLower === "dstv" || serviceIdLower === "gotv" || serviceIdLower === "startimes";
  const isShowmax = serviceIdLower === "showmax";

  // Auto-select service when services are loaded
  useEffect(() => {
    if (allServices.length > 0 && !selectedServiceId) {
      // If initialServiceId is provided, try to find and select it
      if (initialServiceId) {
        const foundService = allServices.find(
          (s) => s.serviceID.toLowerCase() === initialServiceId.toLowerCase()
        );
        if (foundService) {
          setSelectedServiceId(foundService.serviceID);
          return;
        }
      }
      // Otherwise, select first service
      setSelectedServiceId(allServices[0].serviceID);
    }
  }, [allServices, selectedServiceId, initialServiceId]);

  // Reset selected variation and purchase view when service changes
  useEffect(() => {
    setSelectedVariationCode(null);
    setSelectedVariation(null);
    setShowPurchaseView(false);
    setVerificationData(null);
    setVerifiedSmartcardNumber("");
  }, [selectedServiceId]);

  const handleSelectPlan = (variation: VtpassCableVariation) => {
    setSelectedVariationCode(variation.variation_code);
    setSelectedVariation(variation);
    setShowPurchaseView(true); // Navigate to purchase view
  };

  const handleBackToPlans = () => {
    setShowPurchaseView(false);
    // Keep verification data and smartcard number so user doesn't have to re-verify
    // Keep the selection so user can see what they selected if they come back
  };

  const handleVerificationSuccess = (data: VtpassCableVerifyContent, smartcardNumber: string) => {
    setVerificationData(data);
    setVerifiedSmartcardNumber(smartcardNumber);
  };

  const handleVerificationError = (error: string) => {
    // Verification errors should not trigger transaction modal
    // Just show error in the form itself
    console.error("Verification error:", error);
  };

  const handleTransactionSuccess = (data: VtpassCablePurchaseResponse) => {
    setTransactionData(data);

    // Determine status based on response
    if (
      data.status === "processing" ||
      data.content?.transactions?.status === "pending" ||
      data.content?.transactions?.status === "initiated"
    ) {
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
  const getSelectedVariation = (): VtpassCableVariation | null => {
    if (!selectedVariationCode || !variationCodes) return null;
    
    const allVariations = variationCodes.variations || (variationCodes as any).varations || [];
    return allVariations.find((v) => v.variation_code === selectedVariationCode) || null;
  };

  const currentVariation = selectedVariation || getSelectedVariation();
  const selectedService = allServices.find((s) => s.serviceID === selectedServiceId);

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
                <Tv className="h-5 w-5 sm:h-6 sm:w-6" />
                Cable TV
              </h1>
              <p className="text-xs sm:text-sm text-brand-text-secondary mt-0.5 sm:mt-1">
                Pay cable TV bills using VTPass provider
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="hidden sm:block">
          <WalletAnalysisCards />
        </div>
        
        <div className="max-w-4xl">
          {!showPurchaseView ? (
            <>
              {/* Provider Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                  Select Cable TV Provider
                </h2>
                
                {servicesError && (
                  <div className="mb-4">
                    <FormError message={servicesError} />
                  </div>
                )}

                <ProviderSelector
                  services={allServices}
                  selectedServiceId={selectedServiceId}
                  onSelect={setSelectedServiceId}
                  isLoading={loadingServices}
                />

                {selectedServiceId && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Selected:</strong> {allServices.find(s => s.serviceID === selectedServiceId)?.name || "N/A"}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Next step: Select a subscription plan for this provider
                    </p>
                  </div>
                )}
              </div>

              {/* Plan Selection */}
              {selectedServiceId && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
                  {variationsError && (
                    <div className="mb-4">
                      <FormError message={variationsError} />
                    </div>
                  )}
                  
                  <PlanSelector
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
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
              {/* Back Button and Title */}
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToPlans}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <h2 className="text-base font-semibold text-slate-800">
                  Complete Purchase
                </h2>
              </div>

              {/* Compact Summary and Verification Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Selected Plan Summary */}
                {currentVariation && selectedService && selectedServiceId && (() => {
                  const logoPath = getNetworkLogo(selectedServiceId as string);
                  return (
                    <div className="bg-gradient-to-r from-brand-bg-primary/5 to-indigo-50 rounded-lg p-4 border border-brand-bg-primary/20">
                      <div className="flex items-center gap-3 mb-2">
                        {logoPath && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={logoPath}
                              alt={selectedService.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 mb-1">Selected Plan</p>
                          <p className="font-semibold text-slate-800">{currentVariation.name}</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-brand-bg-primary">
                        ₦{parseFloat(currentVariation.variation_amount).toLocaleString()}
                      </p>
                    </div>
                  );
                })()}

                {/* Verification Status (Compact) */}
                {selectedServiceId && supportsVerification && verificationData && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-semibold text-green-800">Verified</p>
                    </div>
                    <div className="text-xs text-green-700 space-y-1">
                      <p><span className="font-medium">Name:</span> {verificationData.Customer_Name || "N/A"}</p>
                      <p><span className="font-medium">Status:</span> <span className={`px-1.5 py-0.5 rounded text-xs ${
                        verificationData.Status === "ACTIVE" 
                          ? "bg-green-200 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>{verificationData.Status || "N/A"}</span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Form (DSTV/GOTV/Startimes only) */}
              {selectedServiceId && supportsVerification && !verificationData && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3">Verify Smartcard</h3>
                  <SmartcardVerificationForm
                    serviceID={selectedServiceId}
                    serviceName={selectedService?.name || ""}
                    onVerified={handleVerificationSuccess}
                    onError={handleVerificationError}
                  />
                </div>
              )}

              {/* Purchase Form */}
              {selectedServiceId && selectedService && (
                <div>
                  {/* Show purchase form if:
                      - Showmax (no verification needed)
                      - DSTV/GOTV/Startimes and verification is complete OR verification not required
                  */}
                  {(isShowmax || (supportsVerification && verificationData) || !supportsVerification) && (
                    <>
                      {supportsVerification && !verificationData && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800">
                            <strong>Note:</strong> Please verify your smartcard first to see renewal options.
                          </p>
                        </div>
                      )}
                      {(!supportsVerification || verificationData) && (
                        <CablePurchaseForm
                          selectedServiceId={selectedServiceId}
                          selectedVariation={currentVariation}
                          serviceName={selectedService.name}
                          verificationData={verificationData || undefined}
                          verifiedSmartcardNumber={verifiedSmartcardNumber}
                          onSuccess={handleTransactionSuccess}
                          onError={handleTransactionError}
                          walletBalance={walletBalance}
                        />
                      )}
                    </>
                  )}
                </div>
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
