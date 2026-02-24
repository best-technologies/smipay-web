"use client";

import { motion } from "motion/react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { useAdminTransactions } from "@/hooks/admin/useAdminTransactions";
import { TRANSACTION_STATUSES } from "@/types/admin/transactions";
import { TransactionsAnalytics } from "./_components/TransactionsAnalytics";
import { TransactionsFilters } from "./_components/TransactionsFilters";
import { TransactionsTable } from "./_components/TransactionsTable";
import { TransactionsPagination } from "./_components/TransactionsPagination";
import { TransactionsSkeleton } from "./_components/TransactionsSkeleton";

export default function TransactionsPage() {
  const {
    transactions,
    meta,
    analytics,
    filters,
    isLoading,
    error,
    updateFilters,
    debouncedSearch,
    setPage,
    resetFilters,
    refetch,
  } = useAdminTransactions();

  if (isLoading && !analytics) return <TransactionsSkeleton />;

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <header className="bg-dashboard-surface border-b border-dashboard-border/60 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-bg-primary flex items-center justify-center">
              <ArrowLeftRight className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-dashboard-heading">Transactions</h1>
              <p className="text-xs text-dashboard-muted">Monitor and manage all transactions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-dashboard-border/60 text-dashboard-heading hover:bg-dashboard-bg disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 space-y-3">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
          >
            {error}
            <button type="button" onClick={refetch} className="ml-2 underline font-medium">Retry</button>
          </motion.div>
        )}

        {analytics && <TransactionsAnalytics analytics={analytics} />}

        {/* Status pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => updateFilters({ status: "" })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !filters.status
                ? "bg-brand-bg-primary text-white"
                : "bg-dashboard-surface border border-dashboard-border/60 text-dashboard-muted hover:text-dashboard-heading"
            }`}
          >
            All{analytics ? ` (${analytics.overview.total_transactions.toLocaleString()})` : ""}
          </button>
          {TRANSACTION_STATUSES.map(({ value, label, color }) => {
            const count = analytics?.by_status[value]?.count ?? 0;
            const active = filters.status === value;
            const colorMap: Record<string, string> = {
              emerald: active ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200",
              amber: active ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700 border border-amber-200",
              red: active ? "bg-red-500 text-white" : "bg-red-50 text-red-700 border border-red-200",
              slate: active ? "bg-slate-500 text-white" : "bg-slate-100 text-slate-600 border border-slate-200",
            };
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateFilters({ status: active ? "" : value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${colorMap[color] ?? colorMap.slate}`}
              >
                {label} ({count.toLocaleString()})
              </button>
            );
          })}
        </div>

        <TransactionsFilters
          filters={filters}
          onSearch={debouncedSearch}
          onFilterChange={updateFilters}
          onReset={resetFilters}
          total={meta?.total ?? 0}
        />

        {meta && <TransactionsPagination meta={meta} onPageChange={setPage} />}

        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}
