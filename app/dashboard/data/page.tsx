"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const getProvider = () => {
  const provider = (process.env.NEXT_PUBLIC_DATA_PROVIDER || process.env.NEXT_PUBLIC_AIRTIME_PROVIDER || "vtpass")
    .toLowerCase()
    .trim();
  const validProviders = ["vtpass", "sagecloud"];
  return validProviders.includes(provider) ? provider : "vtpass";
};

const VtpassData = dynamic(
  () => import("./vtpass/page"),
  {
    loading: () => (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-dashboard-accent mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-dashboard-muted">Loading…</p>
        </div>
      </div>
    ),
  }
);

const SagecloudData = dynamic(
  () => import("./sagecloud/page"),
  {
    loading: () => (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-dashboard-accent mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-dashboard-muted">Loading…</p>
        </div>
      </div>
    ),
  }
);

export default function DataPage() {
  const provider = getProvider();
  if (provider === "sagecloud") return <SagecloudData />;
  return <VtpassData />;
}
