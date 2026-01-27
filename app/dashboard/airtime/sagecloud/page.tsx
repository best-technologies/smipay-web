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
              <h1 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
                <Smartphone className="h-6 w-6" />
                Buy Airtime - Sagecloud
              </h1>
              <p className="text-sm text-brand-text-secondary mt-1">
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
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-4">
                <Smartphone className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-brand-text-primary mb-2">
                Sagecloud Provider
              </h2>
              <p className="text-brand-text-secondary mb-6">
                This is the Sagecloud airtime purchase page. The form and fields will be implemented based on Sagecloud API requirements.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
                <span className="text-sm font-semibold text-purple-700">
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
