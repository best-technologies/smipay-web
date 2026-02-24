"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, UserPlus, Settings, Loader2 } from "lucide-react";
import { useAdminReferrals } from "@/hooks/admin/useAdminReferrals";
import { adminReferralsApi } from "@/services/admin/referrals-api";
import { ReferralsAnalytics } from "./_components/ReferralsAnalytics";
import { ReferralsFilters } from "./_components/ReferralsFilters";
import { ReferralsTable } from "./_components/ReferralsTable";
import { ReferralsPagination } from "./_components/ReferralsPagination";
import { ReferralsSkeleton } from "./_components/ReferralsSkeleton";
import { TopReferrers } from "./_components/TopReferrers";
import { ReferralConfigModal } from "./_components/ReferralConfigModal";
import { REFERRAL_STATUSES } from "@/types/admin/referrals";

export default function ReferralsPage() {
  const {
    referrals,
    meta,
    analytics,
    filters,
    isLoading,
    error,
    updateFilters,
    debouncedSearch,
    setPage,
    resetFilters,
    leaderboard,
    leaderboardLoading,
    refetch,
  } = useAdminReferrals();

  const [configOpen, setConfigOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await adminReferralsApi.approve(id);
      refetch();
    } catch {
      /* handled in UI */
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setRejectSubmitting(true);
    try {
      await adminReferralsApi.reject(rejectTarget, { reason: rejectReason.trim() });
      setRejectTarget(null);
      setRejectReason("");
      refetch();
    } catch {
      /* handled */
    } finally {
      setRejectSubmitting(false);
    }
  };

  if (isLoading && !analytics) return <ReferralsSkeleton />;

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <header className="bg-dashboard-surface border-b border-dashboard-border/60 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-bg-primary flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-dashboard-heading">Referral Management</h1>
              <p className="text-xs text-dashboard-muted">Track and manage referral program</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analytics?.config && (
              <button
                type="button"
                onClick={() => setConfigOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-dashboard-border/60 text-dashboard-heading hover:bg-dashboard-bg transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </button>
            )}
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

        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-3">
              <ReferralsAnalytics analytics={analytics} />
            </div>
            <TopReferrers leaderboard={leaderboard} loading={leaderboardLoading} />
          </div>
        )}

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
            All{analytics ? ` (${analytics.overview.total_referrals.toLocaleString()})` : ""}
          </button>
          {REFERRAL_STATUSES.map(({ value, label, color }) => {
            const count = analytics?.by_status[value] ?? 0;
            const active = filters.status === value;
            const colorMap: Record<string, string> = {
              amber: active ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700 border border-amber-200",
              blue: active ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-700 border border-blue-200",
              emerald: active ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200",
              orange: active ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-700 border border-orange-200",
              slate: active ? "bg-slate-500 text-white" : "bg-slate-100 text-slate-600 border border-slate-200",
              red: active ? "bg-red-500 text-white" : "bg-red-50 text-red-700 border border-red-200",
            };
            const cls = colorMap[color] ?? colorMap.slate;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateFilters({ status: active ? "" : value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${cls}`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        <ReferralsFilters
          filters={filters}
          onSearch={debouncedSearch}
          onFilterChange={updateFilters}
          onReset={resetFilters}
          total={meta?.total ?? 0}
        />

        {meta && <ReferralsPagination meta={meta} onPageChange={setPage} />}

        <div className="relative">
          {actionLoading && (
            <div className="absolute inset-0 bg-dashboard-surface/60 z-10 flex items-center justify-center rounded-xl">
              <Loader2 className="h-6 w-6 text-brand-bg-primary animate-spin" />
            </div>
          )}
          <ReferralsTable
            referrals={referrals}
            onApprove={handleApprove}
            onReject={(id) => setRejectTarget(id)}
          />
        </div>
      </div>

      {/* Config modal */}
      {analytics?.config && (
        <ReferralConfigModal
          config={analytics.config}
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          onSaved={refetch}
        />
      )}

      {/* Reject confirmation dialog */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dashboard-surface rounded-xl border border-dashboard-border/60 shadow-2xl w-full max-w-md p-6"
          >
            <h3 className="text-sm font-bold text-dashboard-heading mb-2">Reject Referral</h3>
            <p className="text-xs text-dashboard-muted mb-4">
              Provide a reason for rejecting this referral. This prevents rewards from being issued.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm bg-dashboard-bg border border-dashboard-border/60 rounded-lg text-dashboard-heading placeholder:text-dashboard-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-bg-primary/20 resize-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                className="px-4 py-2 text-xs font-medium border border-dashboard-border/60 rounded-lg hover:bg-dashboard-bg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim() || rejectSubmitting}
                className="px-4 py-2 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {rejectSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject Referral"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
