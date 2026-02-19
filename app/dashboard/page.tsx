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
  Phone,
  Wifi,
  Tv,
  ArrowRightLeft,
  Receipt,
  FileText,
  ChevronRight,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
// import { WalletAnalysisCards } from "@/components/dashboard/WalletAnalysisCards";
import type { DashboardData, Transaction as DashboardTransaction } from "@/types/dashboard";
import { getNetworkLogo } from "@/lib/network-logos";
import { motion } from "motion/react";

const QUICK_ACTIONS = [
  { id: "transfer", name: "Transfer", icon: ArrowRightLeft, href: "/dashboard/transfer", comingSoon: true },
  { id: "airtime", name: "Buy Airtime", icon: Phone, href: "/dashboard/airtime" },
  { id: "data", name: "Buy Data", icon: Wifi, href: "/dashboard/data" },
  { id: "cable", name: "Cable TV", icon: Tv, href: "/dashboard/cabletv" },
  { id: "electricity", name: "Electricity", icon: Zap, href: "/dashboard/electricity" },
  { id: "transactions", name: "Transactions", icon: Receipt, href: "/dashboard/transactions" },
];

const QUICK_ACTION_COLORS = [
  { bg: "var(--quick-action-1-bg)", icon: "var(--quick-action-1)" },
  { bg: "var(--quick-action-2-bg)", icon: "var(--quick-action-2)" },
  { bg: "var(--quick-action-3-bg)", icon: "var(--quick-action-3)" },
  { bg: "var(--quick-action-4-bg)", icon: "var(--quick-action-4)" },
  { bg: "var(--quick-action-5-bg)", icon: "var(--quick-action-5)" },
  { bg: "var(--quick-action-6-bg)", icon: "var(--quick-action-6)" },
] as const;

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
                  {/* Row 1: Bank name (left) | Active + Fund Wallet pills (right) */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-medium text-slate-400">{primaryAccount.bank_name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                          primaryAccount.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {primaryAccount.isActive ? "Active" : "Inactive"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsFundWalletModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                      >
                        <ArrowDownLeft className="h-3 w-3" />
                        Fund
                      </button>
                    </div>
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
                  <p className="text-xs text-slate-500 truncate">{primaryAccount.account_holder_name}</p>
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

        {/* Wallet analysis section – commented out for now */}
        {/* <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <WalletAnalysisCards />
        </motion.section> */}

        {/* Quick Actions – icon on top, text below, 3 per row, colored from globals */}
        <section>
          <h2 className="text-base font-semibold text-dashboard-heading tracking-tight mb-1">
            Quick actions
          </h2>
          <p className="text-xs text-dashboard-muted mb-4">
            Airtime, data, bills & transfers
          </p>
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-3"
          >
            {QUICK_ACTIONS.map((action, index) => {
              const colors = QUICK_ACTION_COLORS[index % QUICK_ACTION_COLORS.length];
              const isDisabled = "comingSoon" in action && action.comingSoon;
              return (
                <motion.div key={action.id} variants={item} className="relative w-full overflow-hidden rounded-xl">
                  {isDisabled && (
                    <div className="absolute top-0 left-0 right-0 rounded-t-xl bg-amber-500 px-1.5 py-0.5 text-center text-[9px] font-semibold uppercase tracking-wide text-white z-10">
                      Coming soon
                    </div>
                  )}
                  <motion.button
                    type="button"
                    onClick={() => !isDisabled && router.push(action.href)}
                    whileHover={isDisabled ? undefined : { y: -2 }}
                    whileTap={isDisabled ? undefined : { scale: 0.98 }}
                    disabled={isDisabled}
                    className={`group flex w-full flex-col items-center rounded-xl border border-dashboard-border/80 bg-dashboard-surface p-4 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-dashboard-accent focus:ring-offset-2 ${
                      isDisabled
                        ? "cursor-not-allowed opacity-80 pt-5"
                        : "hover:shadow-md hover:border-dashboard-border"
                    }`}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl mb-3 transition-transform duration-200 group-hover:scale-105"
                      style={{ backgroundColor: colors.bg, color: colors.icon }}
                    >
                      <action.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <span className="text-center text-sm font-medium text-dashboard-heading leading-tight">
                      {action.name}
                    </span>
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Recent Transactions */}
        <section className="rounded-2xl border border-dashboard-border bg-dashboard-surface shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-4 border-b border-dashboard-border">
            <div>
              <h2 className="text-base font-semibold text-dashboard-heading tracking-tight">
                Recent transactions
              </h2>
              <p className="text-xs text-dashboard-muted mt-0.5">
                Your latest activity
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/transactions")}
              className="text-dashboard-accent hover:bg-dashboard-accent/10 text-xs h-8 shrink-0"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
          <div className="divide-y divide-dashboard-border">
            {dashboardData.transaction_history.length > 0 ? (
              dashboardData.transaction_history.slice(0, 5).map((transaction) => {
                const logo = getTransactionLogo(transaction);
                const isCredit = transaction.credit_debit === "credit";
                const statusStyle =
                  transaction.status === "success"
                    ? "bg-[var(--tx-success-bg)] text-[var(--tx-success-text)]"
                    : transaction.status === "pending"
                      ? "bg-[var(--tx-pending-bg)] text-[var(--tx-pending-text)]"
                      : "bg-[var(--tx-failed-bg)] text-[var(--tx-failed-text)]";
                return (
                  <button
                    key={transaction.id}
                    type="button"
                    className="flex w-full items-center gap-4 px-4 py-3.5 sm:px-5 sm:py-4 text-left hover:bg-dashboard-bg/60 active:bg-dashboard-bg/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-accent focus-visible:ring-inset"
                    onClick={() =>
                      router.push(
                        `/dashboard/transactions/${transaction.id}${transaction.provider ? `?provider=${transaction.provider}` : ""}`
                      )
                    }
                  >
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-dashboard-bg ring-1 ring-dashboard-border/80">
                      {logo ? (
                        <img
                          src={logo}
                          alt=""
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <span className="flex items-center justify-center">
                          {isCredit ? (
                            <ArrowDownLeft className="h-5 w-5 text-[var(--tx-success-text)]" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-[var(--tx-failed-text)]" />
                          )}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-dashboard-heading text-sm truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-dashboard-muted mt-0.5">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          isCredit ? "text-[var(--tx-success-text)]" : "text-dashboard-heading"
                        }`}
                      >
                        {isCredit ? "+" : "−"}₦{Number(transaction.amount).toLocaleString()}
                      </p>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusStyle}`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dashboard-border/50 text-dashboard-muted">
                  <Receipt className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-medium text-dashboard-heading">No transactions yet</p>
                <p className="mt-1 text-xs text-dashboard-muted">Your recent activity will appear here</p>
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
