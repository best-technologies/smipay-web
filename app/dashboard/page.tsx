"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FundWalletModal } from "@/components/dashboard/FundWalletModal";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Zap,
  Smartphone,
  Tv,
  FileText,
  ChevronRight,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { WalletAnalysisCards } from "@/components/dashboard/WalletAnalysisCards";
import type { DashboardData, Transaction as DashboardTransaction } from "@/types/dashboard";
import { getNetworkLogo } from "@/lib/network-logos";
import { motion } from "motion/react";

const QUICK_ACTIONS = [
  { id: "airtime", name: "Buy Airtime", icon: Smartphone, hue: 217, href: "/dashboard/airtime" },
  { id: "data", name: "Buy Data", icon: Zap, hue: 270, href: "/dashboard/data" },
  { id: "cable", name: "Cable TV", icon: Tv, hue: 24, href: "/dashboard/cable" },
  { id: "electricity", name: "Electricity", icon: Zap, hue: 142, href: "/dashboard/electricity" },
  { id: "transfer", name: "Transfer", icon: ArrowUpRight, hue: 239, href: "/dashboard/transfer" },
  { id: "transactions", name: "Transactions", icon: FileText, hue: 330, href: "/dashboard/transactions" },
];

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 * i },
  }),
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const { dashboardData, isLoading: loading, error, refetch } = useDashboard();
  const [isFundWalletModalOpen, setIsFundWalletModalOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (payment === "callback" && reference) {
      setPaymentReference(reference);
      setIsFundWalletModalOpen(true);
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

  const parseBalance = (balance: string): number => {
    return parseFloat(balance.replace(/,/g, ""));
  };

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

  const getTransactionLogo = (transaction: DashboardTransaction): string | null => {
    if (transaction.provider) {
      const logo = getNetworkLogo(transaction.provider);
      if (logo) return logo;
    }
    if (transaction.icon) return transaction.icon;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-dashboard-accent mx-auto mb-3" />
          <p className="text-dashboard-muted text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-sm">{error || "Failed to load dashboard"}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const primaryAccount = dashboardData.accounts[0];

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-dashboard-surface border-b border-dashboard-border/80 sticky top-0 z-10 backdrop-blur-sm bg-dashboard-surface/95"
      >
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-dashboard-heading tracking-tight">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-dashboard-muted mt-0.5">
                Welcome back, {dashboardData.user.first_name}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="bg-brand-bg-primary hover:bg-brand-bg-primary/90 text-white text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 shadow-sm"
                onClick={() => setIsFundWalletModalOpen(true)}
              >
                <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                Fund Wallet
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="px-3 sm:px-4 py-4 sm:py-6 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <WalletAnalysisCards />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Virtual Account Card */}
          <div className="lg:col-span-2">
            {primaryAccount ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                whileHover={{ y: -2 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-5 sm:p-6 md:p-8 text-white shadow-xl shadow-slate-900/20"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(148,163,184,0.15),transparent)] pointer-events-none" />
                <div className="relative flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm mb-0.5">Bank Account</p>
                    <p className="text-base sm:text-xl font-semibold text-white">{primaryAccount.bank_name}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                      primaryAccount.isActive
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {primaryAccount.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="relative space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm mb-0.5">Account Number</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg sm:text-2xl md:text-3xl font-mono font-semibold tracking-wider text-white">
                        {primaryAccount.account_number}
                      </p>
                      <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyAccountNumber(primaryAccount.account_number)}
                          className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy account number"
                        >
                        {copied ? (
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm mb-0.5">Account Name</p>
                    <p className="text-sm sm:text-lg font-medium text-white">
                      {primaryAccount.account_holder_name}
                    </p>
                  </div>
                </div>

                <div className="relative pt-4 sm:pt-6 border-t border-white/10">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-slate-400 text-xs sm:text-sm mb-0.5">Account Balance</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white tabular-nums">
                        ₦{parseBalance(primaryAccount.balance).toLocaleString()}
                      </p>
                    </div>
                    <CreditCard className="h-8 w-8 sm:h-10 sm:w-10 text-white/20" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-8 text-center text-slate-400"
              >
                No bank account available
              </motion.div>
            )}
          </div>

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="hidden lg:block"
          >
            <div className="bg-dashboard-surface rounded-2xl border border-dashboard-border/80 shadow-sm p-5 h-full">
              <div className="flex items-center gap-3 mb-5">
                {dashboardData.user.profile_image ? (
                  <img
                    src={dashboardData.user.profile_image}
                    alt={dashboardData.user.name}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover ring-2 ring-dashboard-border"
                  />
                ) : (
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-lg font-semibold">
                    {dashboardData.user.first_name[0]}
                    {dashboardData.user.last_name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-dashboard-heading text-sm truncate">
                    {dashboardData.user.first_name} {dashboardData.user.last_name}
                  </p>
                  <p className="text-xs text-dashboard-muted truncate">@{dashboardData.user.smipay_tag}</p>
                </div>
              </div>
              <div className="space-y-0 border-t border-dashboard-border/80 pt-4">
                <div className="flex items-center justify-between py-2.5 border-b border-dashboard-border/60">
                  <span className="text-xs text-dashboard-muted">Email</span>
                  <span
                    className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
                      dashboardData.user.is_email_verified
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {dashboardData.user.is_email_verified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-dashboard-border/60">
                  <span className="text-xs text-dashboard-muted">KYC</span>
                  <span
                    className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
                      dashboardData.kyc_verification.is_verified
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {dashboardData.kyc_verification.status}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-dashboard-muted">Tier</span>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium bg-sky-50 text-sky-700">
                    {dashboardData.current_tier.tier}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-sm font-semibold text-dashboard-heading mb-3"
          >
            Quick Actions
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3"
          >
            {QUICK_ACTIONS.map((action, index) => (
              <motion.button
                key={action.id}
                variants={item}
                onClick={() => router.push(action.href)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                className="bg-dashboard-surface rounded-xl border border-dashboard-border/80 p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-dashboard-border transition-all duration-200 group text-left"
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-105"
                  style={{
                    backgroundColor: `hsl(${action.hue}, 55%, 94%)`,
                    color: `hsl(${action.hue}, 55%, 40%)`,
                  }}
                >
                  <action.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-dashboard-heading leading-tight">
                  {action.name}
                </p>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-dashboard-surface rounded-2xl border border-dashboard-border/80 shadow-sm overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 sm:p-5 border-b border-dashboard-border/80 flex items-center justify-between"
          >
            <h2 className="text-sm font-semibold text-dashboard-heading">Recent Transactions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/transactions")}
              className="text-dashboard-accent hover:text-dashboard-accent/90 hover:bg-sky-50 text-xs h-8"
            >
              View All
              <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </motion.div>
          <div className="divide-y divide-dashboard-border/60">
            {dashboardData.transaction_history.length > 0 ? (
              dashboardData.transaction_history.slice(0, 5).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-3 sm:p-4 hover:bg-dashboard-bg/60 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/transactions/${transaction.id}${transaction.provider ? `?provider=${transaction.provider}` : ""}`
                    )
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {getTransactionLogo(transaction) ? (
                        <img
                          src={getTransactionLogo(transaction) as string}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div
                          className={`p-2 rounded-lg flex-shrink-0 ${
                            transaction.credit_debit === "credit" ? "bg-emerald-50" : "bg-red-50"
                          }`}
                        >
                          {transaction.credit_debit === "credit" ? (
                            <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-dashboard-heading text-sm truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-dashboard-muted">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`font-semibold text-sm tabular-nums ${
                          transaction.credit_debit === "credit" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {transaction.credit_debit === "credit" ? "+" : "-"}₦{transaction.amount}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          transaction.status === "success"
                            ? "bg-emerald-50 text-emerald-700"
                            : transaction.status === "pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-10 text-center text-dashboard-muted">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FundWalletModal
        isOpen={isFundWalletModalOpen}
        onClose={() => {
          setIsFundWalletModalOpen(false);
          setPaymentReference(null);
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-dashboard-accent" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
