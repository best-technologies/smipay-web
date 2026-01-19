"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, AlertCircle } from "lucide-react";

interface CardFundingAmountProps {
  onContinue: (amount: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 1000000;

export function CardFundingAmount({
  onContinue,
  onCancel,
  isLoading = false,
}: CardFundingAmountProps) {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
    
    if (error) {
      setError("");
    }
  };

  const handleQuickAmountClick = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    if (error) {
      setError("");
    }
  };

  const validateAndContinue = () => {
    const numericAmount = parseInt(amount, 10);

    if (!amount || isNaN(numericAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    if (numericAmount < MIN_AMOUNT) {
      setError(`Minimum amount is ₦${MIN_AMOUNT.toLocaleString()}`);
      return;
    }

    if (numericAmount > MAX_AMOUNT) {
      setError(`Maximum amount is ₦${MAX_AMOUNT.toLocaleString()}`);
      return;
    }

    onContinue(numericAmount);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && amount && !error) {
      validateAndContinue();
    }
  };

  return (
    <div className="space-y-6">
      {/* Icon Header */}
      <div className="flex justify-center">
        <div className="p-4 bg-green-100 rounded-full">
          <CreditCard className="h-10 w-10 text-green-600" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Enter Amount to Fund
        </h3>
        <p className="text-sm text-gray-600">
          Fund your wallet instantly with your debit or credit card
        </p>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (₦)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">
            ₦
          </span>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className={`pl-10 text-2xl h-14 font-semibold ${
              error ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Quick Amount Buttons */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</p>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_AMOUNTS.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => handleQuickAmountClick(quickAmount)}
              disabled={isLoading}
              className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                amount === quickAmount.toString()
                  ? "border-brand-bg-primary bg-brand-bg-primary/5 text-brand-bg-primary"
                  : "border-gray-200 text-gray-700 hover:border-brand-bg-primary/50 hover:bg-gray-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              ₦{quickAmount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-semibold mb-1">Payment Information:</p>
        <ul className="space-y-1 text-sm">
          <li>• Minimum: ₦{MIN_AMOUNT.toLocaleString()}</li>
          <li>• Maximum: ₦{MAX_AMOUNT.toLocaleString()}</li>
          <li>• Instant credit after successful payment</li>
          <li>• Secure payment powered by Paystack</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={validateAndContinue}
          disabled={isLoading || !amount}
          className="flex-1 bg-brand-bg-primary hover:bg-brand-bg-primary/90"
        >
          {isLoading ? "Processing..." : "Continue to Payment"}
        </Button>
      </div>
    </div>
  );
}

