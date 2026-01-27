"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Get provider from env, default to 'vtpass'
const getProvider = () => {
  const provider = (process.env.NEXT_PUBLIC_AIRTIME_PROVIDER || "vtpass")
    .toLowerCase()
    .trim();
  
  const validProviders = ["vtpass", "sagecloud"];
  return validProviders.includes(provider) ? provider : "vtpass";
};

// Dynamically import the provider component
const VtpassCabletv = dynamic(
  () => import("./vtpass/page"),
  { 
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-bg-primary mx-auto mb-4" />
          <p className="text-brand-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }
);

const SagecloudCabletv = dynamic(
  () => import("./sagecloud/page"),
  { 
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-bg-primary mx-auto mb-4" />
          <p className="text-brand-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }
);

export default function CabletvPage() {
  const provider = getProvider();

  // Conditionally render the appropriate provider component
  if (provider === "sagecloud") {
    return <SagecloudCabletv />;
  }

  // Default to vtpass
  return <VtpassCabletv />;
}
