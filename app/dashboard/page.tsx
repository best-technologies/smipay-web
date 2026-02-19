"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FundWalletModal } from "@/components/dashboard/FundWalletModal";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Phone,
  Wifi,
  Tv,
  Receipt,
  Copy,
  Check,
  Loader2,
  Landmark,
  Hash,
  Send,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
// import { WalletAnalysisCards } from "@/components/dashboard/WalletAnalysisCards";
import type { Transaction as DashboardTransaction } from "@/types/dashboard";
import { getNetworkLogo } from "@/lib/network-logos";
import { motion } from "motion/react";

const TRANSFER_ACTIONS = [
  { id: "to-smipay", name: "To Smipay", icon: Send, href: "/dashboard/transfer/smipay", comingSoon: true, bg: "var(--quick-action-1-bg)", color: "var(--quick-action-1)" },
  { id: "to-bank", name: "To Bank", icon: Landmark, href: "/dashboard/transfer/bank", comingSoon: true, bg: "var(--quick-action-4-bg)", color: "var(--quick-action-4)" },
  { id: "to-tag", name: "To Tag", icon: Hash, href: "/dashboard/transfer/tag", comingSoon: true, bg: "var(--quick-action-2-bg)", color: "var(--quick-action-2)" },
];

const SERVICE_ACTIONS = [
  { id: "airtime", name: "Airtime", icon: Phone, href: "/dashboard/airtime", bg: "var(--quick-action-3-bg)", color: "var(--quick-action-3)" },
  { id: "data", name: "Data", icon: Wifi, href: "/dashboard/data", bg: "var(--quick-action-2-bg)", color: "var(--quick-action-2)" },
  { id: "cable", name: "Cable TV", icon: Tv, href: "/dashboard/cabletv", bg: "var(--quick-action-5-bg)", color: "var(--quick-action-5)" },
  { id: "electricity", name: "Electricity", icon: Zap, href: "/dashboard/electricity", bg: "var(--quick-action-4-bg)", color: "var(--quick-action-4)" },
  { id: "transactions", name: "History", icon: Receipt, href: "/dashboard/transactions", bg: "var(--quick-action-6-bg)", color: "var(--quick-action-6)" },
];

const container = {
  hidden: { opacity: 0 },
  visible: (_i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
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
  // const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const { dashboardData, isLoading: loading, error, refetch } = useDashboard();
  const [isFundWalletModalOpen, setIsFundWalletModalOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (payment === "callback" && reference) {
      queueMicrotask(() => {
        setPaymentReference(reference);
        setIsFundWalletModalOpen(true);
      });
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
          {/* Wallet card skeleton */}
          <div
            className="rounded-2xl overflow-hidden shadow-xl animate-pulse"
            style={{ background: "linear-gradient(152deg, #14532d 0%, #052e1c 100%)" }}
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

          {/* Transfer actions skeleton */}
          <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface p-3 sm:p-4 animate-pulse">
            <div className="grid grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-dashboard-border/50" />
                  <div className="h-2.5 w-12 mt-2 rounded bg-dashboard-border/40" />
                </div>
              ))}
            </div>
          </div>

          {/* Service actions skeleton */}
          <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface px-2 py-3 sm:px-4 sm:py-4 animate-pulse">
            <div className="grid grid-cols-5 gap-y-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-dashboard-border/50" />
                  <div className="h-2.5 w-10 mt-2 rounded bg-dashboard-border/40" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions skeleton */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="h-3.5 w-32 bg-dashboard-border/60 rounded animate-pulse" />
                <div className="h-2.5 w-20 mt-1.5 bg-dashboard-border/40 rounded animate-pulse" />
              </div>
              <div className="h-3 w-12 bg-dashboard-border/50 rounded animate-pulse" />
            </div>
            <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 ${i > 1 ? "border-t border-dashboard-border/40" : ""}`}>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-dashboard-border/50 animate-pulse shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="h-3 w-28 sm:w-36 bg-dashboard-border/50 rounded animate-pulse" />
                    <div className="h-2.5 w-20 bg-dashboard-border/40 rounded animate-pulse" />
                  </div>
                  <div className="text-right space-y-1.5">
                    <div className="h-3 w-12 bg-dashboard-border/50 rounded animate-pulse ml-auto" />
                    <div className="h-2.5 w-10 bg-dashboard-border/40 rounded animate-pulse ml-auto" />
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
                className="relative overflow-hidden rounded-2xl shadow-xl"
                style={{
                  background: "linear-gradient(152deg, #14532d 0%, #0a3622 45%, #052e1c 100%)",
                  boxShadow: "0 25px 50px -12px rgba(5, 46, 28, 0.45), 0 0 0 1px rgba(255,255,255,0.07) inset",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 130% 90% at 85% -10%, rgba(234, 88, 12, 0.22) 0%, transparent 50%), radial-gradient(ellipse 90% 70% at 5% 105%, rgba(5, 150, 105, 0.12) 0%, transparent 45%)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

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
                  // eslint-disable-next-line @next/next/no-img-element -- dynamic user avatar URL
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

        {/* Transfer Actions – 3 across, circular icons, no header */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface p-3 sm:p-4"
        >
          <div className="grid grid-cols-3">
            {TRANSFER_ACTIONS.map((action) => (
              <motion.div key={action.id} variants={item} className="flex flex-col items-center">
                <div className="relative">
                  <button
                    type="button"
                    disabled
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full opacity-75 cursor-not-allowed transition-transform"
                    style={{ backgroundColor: action.bg, color: action.color }}
                  >
                    <action.icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={1.8} />
                  </button>
                  <span className="absolute -top-1.5 -right-1.5 px-1 py-px rounded-full bg-amber-500 text-white text-[7px] sm:text-[8px] font-bold uppercase leading-none tracking-wide">
                    Soon
                  </span>
                </div>
                <span className="mt-1.5 text-[11px] sm:text-xs font-medium text-dashboard-heading leading-tight text-center">
                  {action.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Service Actions – compact grid, circular icons, no header */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface px-2 py-3 sm:px-4 sm:py-4"
        >
          <div className="grid grid-cols-5 gap-y-1">
            {SERVICE_ACTIONS.map((action) => (
              <motion.div key={action.id} variants={item} className="flex flex-col items-center">
                <motion.button
                  type="button"
                  onClick={() => router.push(action.href)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-accent touch-manipulation"
                  style={{ backgroundColor: action.bg, color: action.color }}
                >
                  <action.icon className="h-[17px] w-[17px] sm:h-[19px] sm:w-[19px]" strokeWidth={1.8} />
                </motion.button>
                <span className="mt-1.5 text-[10px] sm:text-[11px] font-medium text-dashboard-heading leading-tight text-center">
                  {action.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recent Transactions – no header, just the list */}
        <section>

          <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface overflow-hidden">
            {dashboardData.transaction_history.length > 0 ? (
              <div>
                {dashboardData.transaction_history.slice(0, 5).map((transaction, idx) => {
                  const logo = getTransactionLogo(transaction);
                  const isCredit = transaction.credit_debit === "credit";
                  const statusStyle =
                    transaction.status === "success"
                      ? "text-[var(--tx-success-text)]"
                      : transaction.status === "pending"
                        ? "text-[var(--tx-pending-text)]"
                        : "text-[var(--tx-failed-text)]";
                  return (
                    <button
                      key={transaction.id}
                      type="button"
                      className={`flex w-full items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 text-left hover:bg-dashboard-bg/50 active:bg-dashboard-bg/70 transition-colors focus:outline-none focus-visible:bg-dashboard-bg/50 touch-manipulation ${
                        idx > 0 ? "border-t border-dashboard-border/40" : ""
                      }`}
                      onClick={() =>
                        router.push(
                          `/dashboard/transactions/${transaction.id}${transaction.provider ? `?provider=${transaction.provider}` : ""}`
                        )
                      }
                    >
                      <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-dashboard-bg/80">
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element -- dynamic network/transaction logo
                          <img
                            src={logo}
                            alt=""
                            className="h-full w-full object-contain p-[5px]"
                          />
                        ) : (
                          <span className="flex items-center justify-center">
                            {isCredit ? (
                              <ArrowDownLeft className="h-3.5 w-3.5 text-[var(--tx-success-text)]" />
                            ) : (
                              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--tx-failed-text)]" />
                            )}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-dashboard-heading text-xs sm:text-[13px] truncate leading-tight">
                          {transaction.description}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-dashboard-muted mt-0.5 leading-tight">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        <p
                          className={`text-xs sm:text-[13px] font-semibold tabular-nums leading-tight ${
                            isCredit ? "text-[var(--tx-success-text)]" : "text-dashboard-heading"
                          }`}
                        >
                          {isCredit ? "+" : "−"}₦{Number(transaction.amount).toLocaleString()}
                        </p>
                        <span
                          className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider ${statusStyle}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dashboard-bg text-dashboard-muted">
                  <Receipt className="h-4.5 w-4.5" />
                </div>
                <p className="mt-2.5 text-xs font-medium text-dashboard-heading">No transactions yet</p>
                <p className="mt-0.5 text-[11px] text-dashboard-muted">Your recent activity will appear here</p>
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
