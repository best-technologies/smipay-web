"use client";

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
      <Label htmlFor="amount" className="label-auth text-dashboard-heading">
        Amount (₦)
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dashboard-muted font-semibold text-base pointer-events-none">
          ₦
        </span>
        <input
          id="amount"
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "w-full rounded-xl border-2 bg-dashboard-bg/80 py-3 pl-9 pr-10 text-base text-dashboard-heading placeholder:text-dashboard-muted shadow-sm transition-all duration-200",
            "focus:outline-none hover:border-dashboard-border",
            error
              ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
              : isValid && !error
                ? "border-[var(--tx-success-text)] focus:border-[var(--tx-success-text)] focus:shadow-[0_0_0_4px_rgba(5,150,105,0.12)]"
                : "border-dashboard-border focus:border-dashboard-accent focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]"
          )}
          aria-invalid={!!error}
          aria-describedby={error ? "amount-error" : undefined}
        />
        {isValid && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="h-5 w-5 text-[var(--tx-success-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <div id="amount-error" className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {!error && value && !isValid && (
        <p className="text-xs text-dashboard-muted">
          Between ₦{min.toLocaleString()} and ₦{max.toLocaleString()}
        </p>
      )}

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
                  "min-h-[44px] px-3 py-2.5 sm:px-4 sm:py-2 text-sm font-medium border-2 rounded-xl transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
                  value === amount.toString()
                    ? "border-brand-bg-primary bg-brand-bg-primary/10 text-brand-bg-primary"
                    : "border-dashboard-border/80 bg-dashboard-surface text-dashboard-heading hover:border-dashboard-border"
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
