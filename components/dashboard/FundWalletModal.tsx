"use client";

import { useState, useEffect } from "react";
import { X, Building2, CreditCard, Tag, ArrowLeft, Copy, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFundingAmount } from "./CardFundingAmount";
import { PaymentVerification } from "./PaymentVerification";
import { walletApi } from "@/services/wallet-api";
import { setPaymentInProgress, clearPaymentInProgress } from "@/lib/auth-storage";
import type { BankAccount } from "@/types/dashboard";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccounts: BankAccount[];
  initialReference?: string | null;
}

type FundingMethod = "bank-transfer" | "card" | "smipay-tag";
type Step = "select-method" | "bank-transfer" | "card-funding" | "card-verification" | "smipay-tag";

export function FundWalletModal({ 
  isOpen, 
  onClose, 
  bankAccounts, 
  initialReference = null 
}: FundWalletModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("select-method");
  const [selectedMethod, setSelectedMethod] = useState<FundingMethod | null>(null);
  void selectedMethod; // used by step flow via setSelectedMethod
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(initialReference);
  const [error, setError] = useState<string | null>(null);

  const primaryAccount = bankAccounts[0]; // Use first account as primary

  // Handle initial reference (from Paystack callback)
  useEffect(() => {
    if (initialReference && isOpen) {
      queueMicrotask(() => {
        setPaymentReference(initialReference);
        setCurrentStep("card-verification");
      });
    }
  }, [initialReference, isOpen]);

  const handleMethodSelect = (method: FundingMethod) => {
    setSelectedMethod(method);
    if (method === "bank-transfer") {
      setCurrentStep("bank-transfer");
    } else if (method === "card") {
      setCurrentStep("card-funding");
    } else {
      setCurrentStep("smipay-tag");
    }
  };

  const handleBack = () => {
    if (currentStep === "card-verification") {
      // Don't allow going back during verification
      return;
    }
    setCurrentStep("select-method");
    setSelectedMethod(null);
    setError(null);
  };

  const handleClose = () => {
    if (isProcessing || currentStep === "card-verification") {
      // Don't allow closing during processing or verification
      return;
    }
    setCurrentStep("select-method");
    setSelectedMethod(null);
    setCopiedField(null);
    setPaymentReference(null);
    setError(null);
    setIsProcessing(false);
    onClose();
  };

  const handleCardFundingContinue = async (amount: number) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Build callback URL - redirect back to dashboard with reference
      const callbackUrl = `${window.location.origin}/dashboard?payment=callback`;

      // Initialize payment
      const response = await walletApi.initializePaystackFunding(callbackUrl, amount);

      if (response.success && response.data) {
        // Store reference for verification
        setPaymentReference(response.data.reference);

        // Mark payment in progress to prevent auto-logout
        setPaymentInProgress();

        // Redirect to Paystack
        window.location.href = response.data.authorization_url;
      } else {
        setError(response.message || "Failed to initialize payment");
        setIsProcessing(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize payment";
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleCardFundingCancel = () => {
    setCurrentStep("select-method");
    setSelectedMethod(null);
    setError(null);
  };

  const handleVerificationSuccess = () => {
    // Clear payment flag
    clearPaymentInProgress();
    
    // Close modal and potentially refresh dashboard data
    setTimeout(() => {
      handleClose();
      window.location.reload(); // Refresh to show updated balance
    }, 2000);
  };

  const handleVerificationError = (message: string) => {
    setError(message);
  };

  const handleVerificationRetry = () => {
    // Clear payment flag on retry
    clearPaymentInProgress();
    
    setCurrentStep("card-funding");
    setPaymentReference(null);
    setError(null);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {currentStep !== "select-method" && currentStep !== "card-verification" && (
                <button
                  onClick={handleBack}
                  disabled={isProcessing}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Fund Wallet</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {currentStep === "select-method" && "Choose your preferred funding method"}
                  {currentStep === "bank-transfer" && "Transfer to your account"}
                  {currentStep === "card-funding" && "Fund with card"}
                  {currentStep === "card-verification" && "Verifying payment"}
                  {currentStep === "smipay-tag" && "Fund via Smipay Tag"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing || currentStep === "card-verification"}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
            {/* Step 1: Select Method */}
            {currentStep === "select-method" && (
              <div className="space-y-4">
                {/* Bank Transfer */}
                <button
                  onClick={() => handleMethodSelect("bank-transfer")}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-brand-bg-primary hover:bg-brand-bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-brand-bg-primary/10 transition-colors">
                      <Building2 className="h-8 w-8 text-blue-600 group-hover:text-brand-bg-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Bank Transfer
                      </h3>
                      <p className="text-sm text-gray-600">
                        Transfer from any bank to your virtual account
                      </p>
                    </div>
                    <div className="text-gray-400 group-hover:text-brand-bg-primary">
                      →
                    </div>
                  </div>
                </button>

                {/* Card Funding */}
                <button
                  onClick={() => handleMethodSelect("card")}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-brand-bg-primary hover:bg-brand-bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-green-100 rounded-xl group-hover:bg-brand-bg-primary/10 transition-colors">
                      <CreditCard className="h-8 w-8 text-green-600 group-hover:text-brand-bg-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Card Funding
                      </h3>
                      <p className="text-sm text-gray-600">
                        Instant funding with your debit/credit card
                      </p>
                    </div>
                    <div className="text-gray-400 group-hover:text-brand-bg-primary">
                      →
                    </div>
                  </div>
                </button>

                {/* Smipay Tag - Coming Soon */}
                <div className="relative">
                  <button
                    disabled
                    className="w-full p-6 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed opacity-60"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-purple-100 rounded-xl">
                        <Tag className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Smipay Tag
                          </h3>
                          <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
                            COMING SOON
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Receive funds via your unique Smipay Tag
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Bank Transfer */}
            {currentStep === "bank-transfer" && primaryAccount && (
              <div className="space-y-6">
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">How to fund via Bank Transfer:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Copy your account details below</li>
                      <li>Open your bank app or visit any bank branch</li>
                      <li>Transfer your desired amount to this account</li>
                      <li>Your wallet will be credited instantly (usually within 2 minutes)</li>
                    </ol>
                  </div>
                </div>

                {/* Account Details Card */}
                <div className="bg-gradient-to-br from-brand-bg-primary to-indigo-700 rounded-2xl p-8 text-white">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Virtual Account</p>
                      <p className="text-2xl font-bold">{primaryAccount.bank_name}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      primaryAccount.isActive ? "bg-green-500" : "bg-red-500"
                    }`}>
                      {primaryAccount.isActive ? "ACTIVE" : "INACTIVE"}
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-blue-100 text-sm mb-2">Account Number</p>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-3xl font-mono font-bold tracking-wider flex-1">
                          {primaryAccount.account_number}
                        </p>
                        <button
                          onClick={() => copyToClipboard(primaryAccount.account_number, "account_number")}
                          className="p-3 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                          title="Copy account number"
                        >
                          {copiedField === "account_number" ? (
                            <Check className="h-5 w-5 text-green-300" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Account Name */}
                    <div>
                      <p className="text-blue-100 text-sm mb-2">Account Name</p>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-xl font-semibold flex-1">
                          {primaryAccount.account_holder_name}
                        </p>
                        <button
                          onClick={() => copyToClipboard(primaryAccount.account_holder_name, "account_name")}
                          className="p-3 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                          title="Copy account name"
                        >
                          {copiedField === "account_name" ? (
                            <Check className="h-5 w-5 text-green-300" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Bank Name */}
                    <div>
                      <p className="text-blue-100 text-sm mb-2">Bank Name</p>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-xl font-semibold flex-1">
                          {primaryAccount.bank_name}
                        </p>
                        <button
                          onClick={() => copyToClipboard(primaryAccount.bank_name, "bank_name")}
                          className="p-3 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                          title="Copy bank name"
                        >
                          {copiedField === "bank_name" ? (
                            <Check className="h-5 w-5 text-green-300" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="font-semibold text-orange-900 mb-2">⚠️ Important Notes:</p>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• This account is unique to you and can only credit your Smipay wallet</li>
                    <li>• Minimum deposit: ₦100</li>
                    <li>• Transfers are typically credited within 1-2 minutes</li>
                    <li>• Do not share these details with anyone requesting payment</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleClose}
                    className="flex-1 bg-brand-bg-primary hover:bg-brand-bg-primary/90"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Card Funding - Amount Input */}
            {currentStep === "card-funding" && (
              <>
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <CardFundingAmount
                  onContinue={handleCardFundingContinue}
                  onCancel={handleCardFundingCancel}
                  isLoading={isProcessing}
                />
              </>
            )}

            {/* Step 4: Card Verification */}
            {currentStep === "card-verification" && paymentReference && (
              <PaymentVerification
                reference={paymentReference}
                onSuccess={handleVerificationSuccess}
                onError={handleVerificationError}
                onRetry={handleVerificationRetry}
              />
            )}

            {/* Step 4: Smipay Tag (Placeholder) */}
            {currentStep === "smipay-tag" && (
              <div className="text-center py-12">
                <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Smipay Tag
                </h3>
                <p className="text-gray-600">
                  Smipay Tag funding coming soon...
                </p>
              </div>
            )}

            {/* No Account Available */}
            {currentStep === "bank-transfer" && !primaryAccount && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Bank Account Available
                </h3>
                <p className="text-gray-600">
                  Please contact support to set up your virtual account.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

