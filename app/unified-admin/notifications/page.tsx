"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BellRing, RefreshCw, Plus } from "lucide-react";
import { useAdminNotifications } from "@/hooks/admin/useAdminNotifications";
import { adminNotificationsApi } from "@/services/admin/notifications-api";
import { NOTIFICATION_CAMPAIGN_STATUSES } from "@/types/admin/notifications";
import { NotificationsSkeleton } from "./_components/NotificationsSkeleton";
import { NotificationsTable } from "./_components/NotificationsTable";
import { NotificationsPagination } from "./_components/NotificationsPagination";

export default function NotificationsPage() {
  const {
    campaigns,
    rawCampaigns,
    meta,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch,
    search,
    setSearch,
  } = useAdminNotifications();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const hasSendingCampaign = useMemo(
    () => rawCampaigns.some((c) => c.status === "sending"),
    [rawCampaigns],
  );

  useEffect(() => {
    if (!hasSendingCampaign) return;
    const id = setInterval(() => {
      refetch();
    }, 6000);
    return () => clearInterval(id);
  }, [hasSendingCampaign, refetch]);

  const handleCancel = async (id: string) => {
    setActionError(null);
    setActionLoadingId(id);
    try {
      await adminNotificationsApi.cancelCampaign(id);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to cancel campaign");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResendFailed = async (id: string) => {
    setActionError(null);
    setActionLoadingId(id);
    try {
      await adminNotificationsApi.resendFailed(id);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to resend failed deliveries");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading && !meta) return <NotificationsSkeleton />;

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <header className="bg-dashboard-surface border-b border-dashboard-border/60 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-bg-primary flex items-center justify-center">
              <BellRing className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-dashboard-heading">Notification Campaigns</h1>
              <p className="text-xs text-dashboard-muted">
                Create, schedule, track and retry email campaigns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refetch}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-dashboard-border/60 text-dashboard-heading hover:bg-dashboard-bg disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/unified-admin/notifications/new"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-brand-bg-primary text-white hover:bg-brand-bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New Campaign
            </Link>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 space-y-3">
        {(error || actionError) && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {actionError || error}
          </div>
        )}

        <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface p-3">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject or campaign ID..."
              className="h-10 rounded-lg border border-dashboard-border/60 bg-dashboard-bg px-3 text-sm outline-none focus:ring-2 focus:ring-brand-bg-primary/20"
            />
            <select
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="h-10 min-w-[180px] rounded-lg border border-dashboard-border/60 bg-dashboard-bg px-3 text-sm outline-none focus:ring-2 focus:ring-brand-bg-primary/20"
            >
              <option value="">All statuses</option>
              {NOTIFICATION_CAMPAIGN_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <NotificationsTable
          campaigns={campaigns}
          actionLoadingId={actionLoadingId}
          onCancel={handleCancel}
          onResendFailed={handleResendFailed}
        />

        {meta && (
          <NotificationsPagination
            page={meta.page}
            pages={meta.pages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
