"use client";

import { Wallet, TrendingUp, ArrowUpRight, FileText } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";

export function WalletAnalysisCards() {
  const { dashboardData, isLoading: loading, error } = useDashboard();

  // Helper function to parse balance string to number
  const parseBalance = (balance: string): number => {
    return parseFloat(balance.replace(/,/g, ""));
  };

  if (loading && !dashboardData) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
        <div className="hidden sm:block bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100 animate-pulse">
          <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-24 mb-2"></div>
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-20 sm:w-32"></div>
        </div>
        {[2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100 animate-pulse"
          >
            <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-24 mb-2"></div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-20 sm:w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <p className="text-red-600 text-sm">{error || "Failed to load wallet data"}</p>
      </div>
    );
  }

  const walletBalance = parseBalance(dashboardData.wallet_card.current_balance);
  const totalFunding = parseBalance(dashboardData.wallet_card.all_time_fuunding);
  const totalWithdrawn = parseBalance(dashboardData.wallet_card.all_time_withdrawn);
  const transactionCount = dashboardData.transaction_history.length;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
      {/* Wallet Balance - hidden on mobile since bank card shows balance */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
        </div>
        <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-secondary mb-0.5 sm:mb-1">Wallet Balance</p>
        <p className="text-base sm:text-lg md:text-2xl font-bold text-brand-text-primary">
          ₦{walletBalance.toLocaleString()}
        </p>
      </div>

      {/* Total Withdrawn */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="p-1.5 sm:p-2 bg-red-50 rounded-lg">
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
          </div>
        </div>
        <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-secondary mb-0.5 sm:mb-1">Total Withdrawn</p>
        <p className="text-base sm:text-lg md:text-2xl font-bold text-brand-text-primary">
          ₦{totalWithdrawn.toLocaleString()}
        </p>
      </div>

      {/* Total Funding */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
        </div>
        <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-secondary mb-0.5 sm:mb-1">Total Funding</p>
        <p className="text-base sm:text-lg md:text-2xl font-bold text-brand-text-primary">
          ₦{totalFunding.toLocaleString()}
        </p>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
        </div>
        <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-secondary mb-0.5 sm:mb-1">Total Transactions</p>
        <p className="text-base sm:text-lg md:text-2xl font-bold text-brand-text-primary">
          {transactionCount}
        </p>
      </div>
    </div>
  );
}
