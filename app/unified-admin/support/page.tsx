"use client";

import { motion } from "motion/react";
import { Headphones, RefreshCw } from "lucide-react";
import { useAdminSupport } from "@/hooks/admin/useAdminSupport";
import { SUPPORT_STATUSES, SUPPORT_PRIORITIES } from "@/types/admin/support";
import { SupportAnalytics } from "./_components/SupportAnalytics";
import { SupportFilters } from "./_components/SupportFilters";
import { SupportTable } from "./_components/SupportTable";
import { SupportPagination } from "./_components/SupportPagination";
import { SupportSkeleton } from "./_components/SupportSkeleton";

const STATUS_PILL_COLORS: Record<string, { active: string; inactive: string }> = {
  amber: {
    active: "bg-amber-500 text-white",
    inactive: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  blue: {
    active: "bg-blue-500 text-white",
    inactive: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  orange: {
    active: "bg-orange-500 text-white",
    inactive: "bg-orange-50 text-orange-700 border border-orange-200",
  },
  emerald: {
    active: "bg-emerald-500 text-white",
    inactive: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  slate: {
    active: "bg-slate-500 text-white",
    inactive: "bg-slate-100 text-slate-600 border border-slate-200",
  },
  red: {
    active: "bg-red-500 text-white",
    inactive: "bg-red-50 text-red-700 border border-red-200",
  },
};

export default function SupportPage() {
  const {
    tickets,
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
  } = useAdminSupport();

  if (isLoading && !analytics) return <SupportSkeleton />;

  const handleSort = (field: string) => {
    if (filters.sort_by === field) {
      updateFilters({ sort_order: filters.sort_order === "asc" ? "desc" : "asc" });
    } else {
      updateFilters({ sort_by: field, sort_order: "desc" });
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <header className="bg-dashboard-surface border-b border-dashboard-border/60 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-bg-primary flex items-center justify-center">
              <Headphones className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-dashboard-heading">Support Tickets</h1>
              <p className="text-xs text-dashboard-muted">Manage and resolve customer issues</p>
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
            <button type="button" onClick={refetch} className="ml-2 underline font-medium">
              Retry
            </button>
          </motion.div>
        )}

        {analytics && <SupportAnalytics analytics={analytics} />}

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
            All{analytics ? ` (${analytics.overview.total_tickets.toLocaleString()})` : ""}
          </button>
          {SUPPORT_STATUSES.map(({ value, label, color }) => {
            const count = analytics?.by_status[value] ?? 0;
            const active = filters.status === value;
            const colors = STATUS_PILL_COLORS[color] ?? STATUS_PILL_COLORS.slate;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateFilters({ status: active ? "" : value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active ? colors.active : colors.inactive
                }`}
              >
                {label} ({count.toLocaleString()})
              </button>
            );
          })}
        </div>

        {/* Priority pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-dashboard-muted uppercase tracking-wider mr-1">
            Priority:
          </span>
          <button
            type="button"
            onClick={() => updateFilters({ priority: "" })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !filters.priority
                ? "bg-brand-bg-primary text-white"
                : "bg-dashboard-surface border border-dashboard-border/60 text-dashboard-muted hover:text-dashboard-heading"
            }`}
          >
            All
          </button>
          {SUPPORT_PRIORITIES.map(({ value, label, color }) => {
            const count = analytics?.by_priority[value] ?? 0;
            const active = filters.priority === value;
            const colors = STATUS_PILL_COLORS[color] ?? STATUS_PILL_COLORS.slate;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateFilters({ priority: active ? "" : value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active ? colors.active : colors.inactive
                }`}
              >
                {label} ({count.toLocaleString()})
              </button>
            );
          })}
        </div>

        <SupportFilters
          filters={filters}
          onSearch={debouncedSearch}
          onFilterChange={updateFilters}
          onReset={resetFilters}
          total={meta?.total ?? 0}
        />

        {meta && <SupportPagination meta={meta} onPageChange={setPage} />}

        <SupportTable
          tickets={tickets}
          sortBy={filters.sort_by}
          sortOrder={filters.sort_order}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}
