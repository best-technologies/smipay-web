"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function PhoneNumberInput({
  value,
  onChange,
  error,
  disabled = false,
  required = true,
}: PhoneNumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const input = e.target.value.replace(/\D/g, "");
    // Limit to 11 digits
    const formatted = input.slice(0, 11);
    onChange(formatted);
  };

  const formatDisplay = (phone: string) => {
    if (!phone) return "";
    // Format as 0801 234 5678
    if (phone.length <= 4) return phone;
    if (phone.length <= 7) return `${phone.slice(0, 4)} ${phone.slice(4)}`;
    return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
  };

  const isValid = value.length === 11 && value.startsWith("0");

  return (
    <div className="space-y-2">
      <Label htmlFor="phone" className="label-auth text-dashboard-heading">
        Phone number
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <div className="relative">
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="0801 234 5678"
          value={formatDisplay(value)}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "w-full rounded-xl border-2 bg-dashboard-bg/80 py-3 px-4 text-base text-dashboard-heading placeholder:text-dashboard-muted shadow-sm transition-all duration-200",
            "focus:outline-none hover:border-dashboard-border",
            error
              ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
              : isValid && !error
                ? "border-[var(--tx-success-text)] focus:border-[var(--tx-success-text)] focus:shadow-[0_0_0_4px_rgba(5,150,105,0.12)]"
                : "border-dashboard-border focus:border-dashboard-accent focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]"
          )}
          maxLength={13}
          aria-invalid={!!error}
          aria-describedby={error ? "phone-error" : undefined}
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
        <div id="phone-error" className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {!error && value && !isValid && (
        <p className="text-xs text-dashboard-muted">Enter a valid 11-digit number starting with 0</p>
      )}
    </div>
  );
}
