"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  presetAmounts?: number[];
  required?: boolean;
}

export function AmountInput({
  value,
  onChange,
  error,
  disabled = false,
  min = 50,
  max = 100000,
  presetAmounts = [100, 200, 500, 1000, 2000, 5000],
  required = true,
}: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const input = e.target.value.replace(/\D/g, "");
    onChange(input);
  };

  const handlePresetClick = (amount: number) => {
    if (amount >= min && amount <= max) {
      onChange(amount.toString());
    }
  };

  const numericValue = parseFloat(value) || 0;
  const isValid = numericValue >= min && numericValue <= max && value !== "";

  return (
    <div className="space-y-2">
      <Label htmlFor="amount" className="text-base font-semibold">
        Amount (₦)
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-text-secondary font-semibold text-base">
          ₦
        </div>
        <input
          id="amount"
          type="text"
          inputMode="numeric"
          placeholder="Enter amount"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent text-base py-2 pl-6 border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors",
            "placeholder:text-brand-text-secondary/50",
            error 
              ? "border-red-500 focus:border-red-500" 
              : isValid && !error
              ? "border-green-500 focus:border-green-500"
              : "border-gray-300 focus:border-brand-bg-primary"
          )}
          aria-invalid={!!error}
          aria-describedby={error ? "amount-error" : undefined}
        />
        {isValid && !error && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <svg
              className="h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <div
          id="amount-error"
          className="flex items-center gap-2 text-sm text-red-600"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {!error && value && !isValid && (
        <p className="text-xs text-brand-text-secondary">
          Amount must be between ₦{min.toLocaleString()} and ₦{max.toLocaleString()}
        </p>
      )}

      {/* Preset Amount Buttons */}
      {presetAmounts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {presetAmounts
            .filter((amount) => amount >= min && amount <= max)
            .map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                disabled={disabled}
                className={cn(
                  "px-4 py-2 text-sm border rounded-lg transition-colors",
                  "hover:border-brand-bg-primary hover:bg-brand-bg-primary/5",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  value === amount.toString()
                    ? "border-brand-bg-primary bg-brand-bg-primary/10 text-brand-bg-primary font-semibold"
                    : "border-gray-300 text-brand-text-primary"
                )}
              >
                ₦{amount.toLocaleString()}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
