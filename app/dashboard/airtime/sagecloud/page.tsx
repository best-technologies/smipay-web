"use client";

import { WalletAnalysisCard } from "@/components/dashboard/WalletAnalysisCard";
import { Smartphone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SagecloudAirtimePage() {
  const router = useRouter();

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
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6" />
                Buy Airtime - Sagecloud
              </h1>
              <p className="text-xs sm:text-sm text-brand-text-secondary mt-0.5 sm:mt-1">
                Purchase airtime using Sagecloud provider
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Wallet Analysis Card */}
          <WalletAnalysisCard />

          {/* Provider Content */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100">
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-purple-100 mb-3 sm:mb-4">
                <Smartphone className="h-7 w-7 sm:h-10 sm:w-10 text-purple-600" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-brand-text-primary mb-2">
                Sagecloud Provider
              </h2>
              <p className="text-sm sm:text-base text-brand-text-secondary mb-4 sm:mb-6">
                This is the Sagecloud airtime purchase page. The form and fields will be implemented based on Sagecloud API requirements.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-50 rounded-full">
                <span className="text-xs sm:text-sm font-semibold text-purple-700">
                  Provider: Sagecloud
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
