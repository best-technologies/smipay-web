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
  { id: "cable", name: "Cable TV", icon: Tv, hue: 24, href: "/dashboard/cabletv" },
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
      <div className="min-h-screen bg-dashboard-bg">
        {/* Header skeleton */}
        <header className="bg-dashboard-surface border-b border-dashboard-border/60 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
            <div className="min-w-0 pr-12 lg:pr-0">
              <div className="h-5 w-24 sm:w-28 bg-dashboard-border/70 rounded animate-pulse" />
              <div className="h-3.5 w-36 mt-2 bg-dashboard-border/50 rounded animate-pulse" />
            </div>
          </div>
        </header>

        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Wallet card skeleton – premium dark card */}
          <div
            className="rounded-2xl overflow-hidden shadow-xl animate-pulse"
            style={{ background: "linear-gradient(152deg, #1e293b 0%, #0f172a 100%)" }}
          >
            <div className="p-4 sm:p-5">
              <div className="flex justify-between mb-4">
                <div className="h-3 w-20 bg-white/10 rounded" />
                <div className="h-5 w-14 bg-white/10 rounded-full" />
              </div>
              <div className="h-3 w-24 bg-white/10 rounded mb-2" />
              <div className="h-8 w-28 bg-white/15 rounded mb-4" />
              <div className="h-3 w-28 bg-white/10 rounded mb-1" />
              <div className="h-4 w-36 bg-white/15 rounded mb-3" />
              <div className="h-3 w-44 bg-white/10 rounded mb-4" />
              <div className="h-11 w-full bg-white/20 rounded-xl" />
            </div>
          </div>

          {/* Analysis cards skeleton */}
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-dashboard-surface rounded-xl border border-dashboard-border/60 p-3 sm:p-4 animate-pulse"
              >
                <div className="h-8 w-8 sm:h-9 sm:w-9 bg-dashboard-border/60 rounded-lg mb-2" />
                <div className="h-2.5 w-16 sm:w-20 bg-dashboard-border/50 rounded mb-2" />
                <div className="h-5 w-14 sm:w-20 bg-dashboard-border/60 rounded" />
              </div>
            ))}
          </div>

          {/* Quick actions skeleton */}
          <section>
            <div className="h-4 w-24 bg-dashboard-border/60 rounded mb-3 animate-pulse" />
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-dashboard-surface rounded-xl border border-dashboard-border/60 p-3 sm:p-4 animate-pulse"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-dashboard-border/60 mb-2" />
                  <div className="h-3 w-full max-w-[60px] bg-dashboard-border/50 rounded" />
                </div>
              ))}
            </div>
          </section>

          {/* Recent transactions skeleton */}
          <section className="bg-dashboard-surface rounded-2xl border border-dashboard-border/60 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-dashboard-border/60 flex items-center justify-between">
              <div className="h-4 w-36 bg-dashboard-border/60 rounded animate-pulse" />
              <div className="h-8 w-16 bg-dashboard-border/50 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-dashboard-border/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-3 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-dashboard-border/60 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-32 sm:w-40 bg-dashboard-border/50 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-dashboard-border/40 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="h-3.5 w-14 bg-dashboard-border/50 rounded animate-pulse ml-auto" />
                    <div className="h-5 w-14 bg-dashboard-border/40 rounded-full animate-pulse ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </section>
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
      {/* Header – on mobile: title only; hamburger is top-right (Sidebar). Fund Wallet is inside wallet card. */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-dashboard-surface border-b border-dashboard-border/60 sticky top-0 z-10"
      >
        <div className="flex items-stretch w-full">
          <div className="flex-1 min-w-0 flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
            <div className="min-w-0 pr-12 lg:pr-0">
              <h1 className="text-lg sm:text-xl font-semibold text-dashboard-heading tracking-tight truncate">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-dashboard-muted mt-0.5">
                Welcome back, {dashboardData.user.first_name}
              </p>
            </div>
            {/* Fund Wallet is inside the wallet card only */}
          </div>
        </div>
      </motion.header>

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Virtual Account Card - shown first on mobile */}
          <div className="lg:col-span-2 order-1">
            {primaryAccount ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="relative overflow-hidden rounded-2xl shadow-xl shadow-slate-900/20"
                style={{
                  background: "linear-gradient(152deg, #1e293b 0%, #0f172a 45%, #0c1222 100%)",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06) inset",
                }}
              >
                {/* Premium gradient overlay – warm glow (ALAT/OPay/Kuda style) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 120% 100% at 80% -20%, rgba(234, 88, 12, 0.18) 0%, transparent 45%), radial-gradient(ellipse 80% 60% at 20% 100%, rgba(14, 165, 233, 0.08) 0%, transparent 40%)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

                <div className="relative p-4 sm:p-5">
                  {/* Row 1: Bank + status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-slate-400">{primaryAccount.bank_name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        primaryAccount.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {primaryAccount.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Hero: Balance */}
                  <p className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Available balance
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight mb-4">
                    ₦{parseBalance(dashboardData.wallet_card.current_balance).toLocaleString()}
                  </p>

                  {/* Account number + copy */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500">Account number</span>
                    <button
                      onClick={() => copyAccountNumber(primaryAccount.account_number)}
                      className="p-1 -m-1 rounded hover:bg-white/10 transition-colors"
                      title="Copy"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-mono font-semibold text-white tracking-wider mb-3">
                    {primaryAccount.account_number}
                  </p>
                  <p className="text-xs text-slate-500 truncate mb-4">{primaryAccount.account_holder_name}</p>

                  {/* CTA */}
                  <Button
                    onClick={() => setIsFundWalletModalOpen(true)}
                    className="w-full h-11 rounded-xl font-semibold text-sm bg-white text-slate-900 hover:bg-slate-100 shadow-lg border-0"
                  >
                    <ArrowDownLeft className="h-4 w-4 mr-2" />
                    Fund Wallet
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="rounded-2xl border border-dashboard-border bg-dashboard-surface p-6 text-center text-dashboard-muted text-sm"
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
            className="hidden lg:block order-2"
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

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <WalletAnalysisCards />
        </motion.section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-semibold text-dashboard-heading mb-3">
            Quick Actions
          </h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3"
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
        </section>

        {/* Recent Transactions */}
        <section className="bg-dashboard-surface rounded-2xl border border-dashboard-border/60 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-dashboard-border/60 flex items-center justify-between">
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
          </div>
          <div className="divide-y divide-dashboard-border/50">
            {dashboardData.transaction_history.length > 0 ? (
              dashboardData.transaction_history.slice(0, 5).map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="p-3 sm:p-4 hover:bg-dashboard-bg/50 active:bg-dashboard-bg/70 transition-colors cursor-pointer"
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
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-dashboard-muted">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No transactions yet</p>
              </div>
            )}
          </div>
        </section>
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
