"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface SmartcardInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  maxLength?: number;
}

export function SmartcardInput({
  value,
  onChange,
  error,
  disabled = false,
  required = true,
  label = "Smartcard Number",
  placeholder = "1212121212",
  maxLength = 10,
}: SmartcardInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const input = e.target.value.replace(/\D/g, "");
    // Limit to maxLength digits
    const formatted = input.slice(0, maxLength);
    onChange(formatted);
  };

  const isValid = value.length === maxLength;

  return (
    <div className="space-y-2">
      <Label htmlFor="smartcard" className="text-base font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <input
          id="smartcard"
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent text-base py-2 border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors",
            "placeholder:text-brand-text-secondary/50",
            error 
              ? "border-red-500 focus:border-red-500" 
              : isValid && !error
              ? "border-green-500 focus:border-green-500"
              : "border-gray-300 focus:border-brand-bg-primary"
          )}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? "smartcard-error" : undefined}
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
          id="smartcard-error"
          className="flex items-center gap-2 text-sm text-red-600"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {!error && value && !isValid && (
        <p className="text-xs text-brand-text-secondary">
          Enter a valid {maxLength}-digit {label.toLowerCase()}
        </p>
      )}
    </div>
  );
}
