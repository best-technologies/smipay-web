"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FundWalletModal } from "@/components/dashboard/FundWalletModal";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, CreditCard, Zap, Smartphone, Tv, FileText, Users, ChevronRight, Copy, Check, Loader2 } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { WalletAnalysisCards } from "@/components/dashboard/WalletAnalysisCards";
import type { DashboardData, Transaction as DashboardTransaction } from "@/types/dashboard";
import { getNetworkLogo } from "@/lib/network-logos";

const QUICK_ACTIONS = [
  { id: "airtime", name: "Buy Airtime", icon: Smartphone, color: "bg-blue-500", href: "/dashboard/airtime" },
  { id: "data", name: "Buy Data", icon: Zap, color: "bg-purple-500", href: "/dashboard/data" },
  { id: "cable", name: "Cable TV", icon: Tv, color: "bg-orange-500", href: "/dashboard/cable" },
  { id: "electricity", name: "Electricity", icon: Zap, color: "bg-green-500", href: "/dashboard/electricity" },
  { id: "transfer", name: "Transfer", icon: ArrowUpRight, color: "bg-indigo-500", href: "/dashboard/transfer" },
  { id: "transactions", name: "Transactions", icon: FileText, color: "bg-pink-500", href: "/dashboard/transactions" },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const { dashboardData, isLoading: loading, error, refetch } = useDashboard();
  const [isFundWalletModalOpen, setIsFundWalletModalOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  // Handle Paystack callback
  useEffect(() => {
    const payment = searchParams.get("payment");
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (payment === "callback" && reference) {
      // User returned from Paystack, trigger verification
      setPaymentReference(reference);
      setIsFundWalletModalOpen(true);
      
      // Don't clean up URL immediately - wait for modal to open
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("payment");
        url.searchParams.delete("reference");
        url.searchParams.delete("trxref");
        router.replace(url.pathname, { scroll: false });
      }, 500);
    }
  }, [searchParams, router]);

  const copyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper function to parse balance string to number
  const parseBalance = (balance: string): number => {
    return parseFloat(balance.replace(/,/g, ""));
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to resolve a logo for a transaction based on provider or icon
  const getTransactionLogo = (transaction: DashboardTransaction): string | null => {
    if (transaction.provider) {
      const logo = getNetworkLogo(transaction.provider);
      if (logo) return logo;
    }
    if (transaction.icon) {
      return transaction.icon;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-bg-primary mx-auto mb-4" />
          <p className="text-brand-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Failed to load dashboard"}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const primaryAccount = dashboardData.accounts[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-text-primary">
                Dashboard
              </h1>
              <p className="text-sm text-brand-text-secondary mt-1">
                Welcome back, {dashboardData.user.first_name}! 👋
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-brand-bg-primary hover:bg-brand-bg-primary/90"
                onClick={() => setIsFundWalletModalOpen(true)}
              >
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Fund Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Wallet Analysis Cards - Global Component */}
        <WalletAnalysisCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Virtual Account Card */}
          <div className="lg:col-span-2">
            {primaryAccount ? (
              <div className="bg-gradient-to-br from-brand-bg-primary to-indigo-700 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Bank Account</p>
                    <p className="text-2xl font-bold">{primaryAccount.bank_name}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    primaryAccount.isActive ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {primaryAccount.isActive ? "ACTIVE" : "INACTIVE"}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Account Number</p>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-mono font-bold tracking-wider">
                        {primaryAccount.account_number}
                      </p>
                      <button
                        onClick={() => copyAccountNumber(primaryAccount.account_number)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Copy account number"
                      >
                        {copied ? (
                          <Check className="h-5 w-5 text-green-300" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-blue-100 text-sm mb-1">Account Name</p>
                    <p className="text-xl font-semibold">
                      {primaryAccount.account_holder_name}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/20">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Account Balance</p>
                      <p className="text-3xl font-bold">
                        ₦{parseBalance(primaryAccount.balance).toLocaleString()}
                      </p>
                    </div>
                    <CreditCard className="h-12 w-12 text-white/30" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-brand-bg-primary to-indigo-700 rounded-xl shadow-lg p-8 text-white flex items-center justify-center">
                <p>No bank account available</p>
              </div>
            )}
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              {dashboardData.user.profile_image ? (
                <img 
                  src={dashboardData.user.profile_image} 
                  alt={dashboardData.user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-brand-bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  {dashboardData.user.first_name[0]}{dashboardData.user.last_name[0]}
                </div>
              )}
              <div>
                <p className="font-semibold text-brand-text-primary text-lg">
                  {dashboardData.user.first_name} {dashboardData.user.last_name}
                </p>
                <p className="text-sm text-brand-text-secondary">
                  @{dashboardData.user.smipay_tag}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-brand-text-secondary">Email</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  dashboardData.user.is_email_verified 
                    ? "bg-green-50 text-green-700" 
                    : "bg-orange-50 text-orange-700"
                }`}>
                  {dashboardData.user.is_email_verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-brand-text-secondary">KYC Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  dashboardData.kyc_verification.is_verified 
                    ? "bg-green-50 text-green-700" 
                    : "bg-orange-50 text-orange-700"
                }`}>
                  {dashboardData.kyc_verification.status}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-brand-text-secondary">Account Tier</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                  {dashboardData.current_tier.tier}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-text-primary">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => router.push(action.href)}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-brand-text-primary text-left">
                  {action.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-text-primary">
                Recent Transactions
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/dashboard/transactions")}
                className="text-brand-bg-primary hover:text-brand-bg-primary/80"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {dashboardData.transaction_history.length > 0 ? (
              dashboardData.transaction_history.slice(0, 5).map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/transactions/${transaction.id}${transaction.provider ? `?provider=${transaction.provider}` : ""}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getTransactionLogo(transaction) ? (
                        <img 
                          src={getTransactionLogo(transaction) as string} 
                          alt={transaction.description} 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className={`p-2 rounded-lg ${
                          transaction.credit_debit === "credit" 
                            ? "bg-green-50" 
                            : "bg-red-50"
                        }`}>
                          {transaction.credit_debit === "credit" ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-brand-text-primary">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-brand-text-secondary">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.credit_debit === "credit" 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {transaction.credit_debit === "credit" ? "+" : "-"}₦{transaction.amount}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === "success" 
                          ? "bg-green-50 text-green-700"
                          : transaction.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-brand-text-secondary">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fund Wallet Modal */}
      <FundWalletModal
        isOpen={isFundWalletModalOpen}
        onClose={() => {
          setIsFundWalletModalOpen(false);
          setPaymentReference(null);
          // Refresh dashboard data after closing modal (in case payment was successful)
          refetch();
        }}
        bankAccounts={dashboardData?.accounts || []}
        initialReference={paymentReference}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-bg-primary" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
