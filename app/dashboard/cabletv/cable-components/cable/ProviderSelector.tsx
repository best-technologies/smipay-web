"use client";

import { cn } from "@/lib/utils";
import { getNetworkLogo } from "@/lib/network-logos";
import type { VtpassCableService } from "@/types/vtpass/vtu/vtpass-cable";
import Image from "next/image";

interface ProviderSelectorProps {
  services: VtpassCableService[];
  selectedServiceId: string | null;
  onSelect: (serviceId: string) => void;
  isLoading?: boolean;
}

export function ProviderSelector({
  services,
  selectedServiceId,
  onSelect,
  isLoading = false,
}: ProviderSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border-2 border-gray-200 animate-pulse bg-gray-50"
          >
            <div className="h-12 w-12 rounded-lg bg-gray-200 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-brand-text-secondary">
        <p>No cable TV providers available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {services.map((service) => {
        const isSelected = selectedServiceId === service.serviceID;
        
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
              "p-4 rounded-xl border-2 transition-all text-left",
              "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-bg-primary focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected
                ? "border-brand-bg-primary bg-brand-bg-primary/5 shadow-md ring-2 ring-brand-bg-primary/20"
                : "border-gray-200 hover:border-gray-300 bg-white"
            )}
          >
            <div className="flex flex-col items-center text-center">
              {logoPath ? (
                <div className="relative h-12 w-12 mb-2">
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
                        parent.innerHTML = '<div class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center"><span class="text-2xl">📺</span></div>';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gray-100 mb-2 flex items-center justify-center">
                  <span className="text-2xl">📺</span>
                </div>
              )}
              <p className="font-semibold text-sm text-slate-800">
                {service.name.replace(" Subscription", "")}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
