"use client";

import { cn } from "@/lib/utils";
import { getNetworkLogo } from "@/lib/network-logos";
import type { VtpassService } from "@/services/vtpass/vtu/vtpass-airtime-api";
import Image from "next/image";

interface NetworkSelectorProps {
  services: VtpassService[];
  selectedServiceId: string | null;
  onSelect: (serviceId: string) => void;
  isLoading?: boolean;
}

export function NetworkSelector({
  services,
  selectedServiceId,
  onSelect,
  isLoading = false,
}: NetworkSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-2.5 sm:p-4 rounded-xl border-2 border-gray-200 animate-pulse bg-gray-50"
          >
            <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-lg bg-gray-200 mb-1.5 sm:mb-2 mx-auto"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-brand-text-secondary">
        <p>No network providers available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
      {services.map((service) => {
        const isSelected = selectedServiceId === service.serviceID;
        const minAmount = parseFloat(service.minimium_amount);
        const maxAmount = parseFloat(service.maximum_amount);
        
        // Get local logo path, fallback to API image if local logo not found
        const localLogo = getNetworkLogo(service.serviceID);
        const logoPath = localLogo || service.image;

        return (
          <button
            key={service.serviceID}
            type="button"
            onClick={() => onSelect(service.serviceID)}
            disabled={isLoading}
            className={cn(
              "p-2.5 sm:p-4 rounded-xl border-2 transition-all text-left",
              "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-bg-primary focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected
                ? "border-brand-bg-primary bg-brand-bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-brand-bg-primary/50 bg-white"
            )}
          >
            <div className="flex flex-col items-center text-center">
              {logoPath ? (
                <div className="relative h-9 w-9 sm:h-12 sm:w-12 mb-1.5 sm:mb-2">
                  <Image
                    src={logoPath}
                    alt={service.name}
                    fill
                    className="object-contain rounded-lg"
                    unoptimized={!localLogo} // Only unoptimize for external URLs
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center"><span class="text-2xl">📱</span></div>';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-lg bg-gray-100 mb-1.5 sm:mb-2 flex items-center justify-center">
                  <span className="text-lg sm:text-2xl">📱</span>
                </div>
              )}
              <p className="font-semibold text-xs sm:text-sm text-brand-text-primary">
                {service.name.replace(" Airtime", "")}
              </p>
              <p className="text-[10px] sm:text-xs text-brand-text-secondary mt-0.5 sm:mt-1">
                ₦{minAmount.toLocaleString()} - ₦{maxAmount.toLocaleString()}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
