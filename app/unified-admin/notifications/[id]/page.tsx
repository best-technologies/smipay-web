"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RefreshCw, RotateCcw, Ban } from "lucide-react";
import { adminNotificationsApi } from "@/services/admin/notifications-api";
import type {
  NotificationCampaign,
  NotificationDeliveryLog,
} from "@/types/admin/notifications";
import { NotificationStatusBadge } from "../_components/NotificationStatusBadge";

interface LogsMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function fmtDate(val?: string | null) {
  if (!val) return "—";
  return new Date(val).toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function progressOf(campaign: NotificationCampaign): number {
  if (!campaign.total_recipients) return 0;
  const done = campaign.sent_count + campaign.failed_count;
  return Math.min(100, Math.round((done / campaign.total_recipients) * 100));
}

export default function NotificationCampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [campaign, setCampaign] = useState<NotificationCampaign | null>(null);
  const [logs, setLogs] = useState<NotificationDeliveryLog[]>([]);
  const [logsMeta, setLogsMeta] = useState<LogsMeta>({
    total: 0,
    page: 1,
    limit: 50,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadCampaign = async () => {
    if (!id) return;
    const res = await adminNotificationsApi.getCampaign(id);
    const data = res.data;
    if (!data) throw new Error("Campaign not found");
    setCampaign(data);
  };

  const loadLogs = async (page = logsMeta.page) => {
    if (!id) return;
    setLogsLoading(true);
    try {
      const res = await adminNotificationsApi.getDeliveryLogs(id, page, logsMeta.limit);
      const payload = res.data;
      setLogs(payload.logs ?? []);
      setLogsMeta({
        total: payload.total ?? 0,
        page: payload.page ?? page,
        limit: payload.limit ?? logsMeta.limit,
        pages: payload.pages ?? 0,
      });
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchAll = async () => {
    if (!id) return;
    setError(null);
    setActionMessage(null);
    setIsLoading(true);
    try {
      await Promise.all([loadCampaign(), loadLogs(1)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaign");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!campaign || campaign.status !== "sending") return;
    const intervalId = setInterval(() => {
      loadCampaign().catch(() => undefined);
      loadLogs().catch(() => undefined);
    }, 6000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.status, id, logsMeta.page, logsMeta.limit]);

  const canCancel = campaign?.status === "scheduled";
  const canResend =
    !!campaign &&
    (campaign.status === "sent" || campaign.status === "failed") &&
    campaign.failed_count > 0;
  const progress = useMemo(
    () => (campaign ? progressOf(campaign) : 0),
    [campaign],
  );

  const handleCancel = async () => {
    if (!campaign || !id) return;
    setActionLoading(true);
    setActionMessage(null);
    setError(null);
    try {
      await adminNotificationsApi.cancelCampaign(id);
      setActionMessage("Campaign cancelled successfully.");
      await fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel campaign");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendFailed = async () => {
    if (!campaign || !id) return;
    setActionLoading(true);
    setActionMessage(null);
    setError(null);
    try {
      const res = await adminNotificationsApi.resendFailed(id);
      setActionMessage(res.data.message || res.message || "Resend started.");
      await fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend failed deliveries");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-brand-bg-primary" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-dashboard-bg p-6">
        <p className="text-sm text-red-600">Campaign not found.</p>
        <Link href="/unified-admin/notifications" className="text-sm text-brand-bg-primary underline">
          Back to campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <header className="bg-dashboard-surface border-b border-dashboard-border/60 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/unified-admin/notifications"
              className="h-9 w-9 rounded-lg border border-dashboard-border/60 bg-dashboard-bg flex items-center justify-center text-dashboard-heading hover:bg-dashboard-border/30 transition-colors"
              aria-label="Back to campaigns"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-dashboard-heading">{campaign.title}</h1>
              <p className="text-xs text-dashboard-muted">{campaign.subject}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchAll}
            disabled={isLoading || actionLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-dashboard-border/60 text-dashboard-heading hover:bg-dashboard-bg disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 space-y-3">
        {(error || actionMessage) && (
          <div
            className={`rounded-xl px-4 py-3 text-sm border ${
              error
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            {error || actionMessage}
          </div>
        )}

        <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface p-4">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <NotificationStatusBadge status={campaign.status} />
            <p className="text-xs text-dashboard-muted">
              Created: <span className="text-dashboard-heading">{fmtDate(campaign.createdAt)}</span>
            </p>
            <p className="text-xs text-dashboard-muted">
              Scheduled: <span className="text-dashboard-heading">{fmtDate(campaign.scheduled_for)}</span>
            </p>
            <p className="text-xs text-dashboard-muted">
              Sent: <span className="text-dashboard-heading">{fmtDate(campaign.sent_at)}</span>
            </p>
          </div>

          <div className="h-2 rounded-full bg-dashboard-border/60 overflow-hidden">
            <div className="h-full bg-brand-bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-dashboard-muted">
            {campaign.sent_count}/{campaign.total_recipients} sent • {campaign.failed_count} failed • {progress}%
            complete
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase text-dashboard-muted">Target Type</p>
              <p className="text-sm text-dashboard-heading capitalize mt-0.5">{campaign.target_type}</p>
            </div>
            {campaign.target_type === "individual" && campaign.target_emails && (
              <div className="sm:col-span-2 lg:col-span-2">
                <p className="text-[11px] font-semibold uppercase text-dashboard-muted">Target Emails</p>
                <p className="text-xs text-dashboard-heading mt-0.5 break-all">
                  {campaign.target_emails.join(", ")}
                </p>
              </div>
            )}
            {campaign.target_type === "filtered" && campaign.target_filters && (
              <div className="sm:col-span-2 lg:col-span-2">
                <p className="text-[11px] font-semibold uppercase text-dashboard-muted">Filters Applied</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Object.entries(campaign.target_filters)
                    .filter(([, v]) => v !== undefined && v !== null && v !== "")
                    .map(([key, val]) => (
                      <span
                        key={key}
                        className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {key.replace(/_/g, " ")}: {String(val)}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
              >
                <Ban className="h-3.5 w-3.5" />
                Cancel Scheduled Campaign
              </button>
            )}
            {canResend && (
              <button
                type="button"
                onClick={handleResendFailed}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Resend Failed ({campaign.failed_count})
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface p-4">
            <h3 className="text-sm font-bold text-dashboard-heading mb-2">Markdown Source</h3>
            <pre className="rounded-lg bg-dashboard-bg border border-dashboard-border/60 p-3 text-xs whitespace-pre-wrap text-dashboard-heading">
              {campaign.content_markdown}
            </pre>
          </div>

          <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface p-4">
            <h3 className="text-sm font-bold text-dashboard-heading mb-2">Rendered Email Preview</h3>
            {campaign.content_html ? (
              <iframe
                title="Email preview"
                className="w-full h-[420px] rounded-lg border border-dashboard-border/60 bg-white"
                srcDoc={campaign.content_html}
              />
            ) : (
              <p className="text-xs text-dashboard-muted">No HTML preview available.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-dashboard-border/60 flex items-center justify-between">
            <h3 className="text-sm font-bold text-dashboard-heading">Delivery Logs</h3>
            <p className="text-xs text-dashboard-muted">
              {logsMeta.total.toLocaleString()} total entries
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-dashboard-bg/70 border-b border-dashboard-border/60">
                <tr className="text-left">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                    Email
                  </th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                    Error
                  </th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {logsLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-dashboard-muted">
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-dashboard-muted">
                      No delivery logs yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-t border-dashboard-border/40">
                      <td className="px-4 py-2.5 text-xs text-dashboard-heading">{log.email}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            log.status === "sent"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-dashboard-muted">
                        {log.error_message || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-dashboard-muted">{fmtDate(log.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {logsMeta.pages > 1 && (
            <div className="px-4 py-3 border-t border-dashboard-border/60 flex items-center justify-between">
              <button
                type="button"
                disabled={logsMeta.page <= 1 || logsLoading}
                onClick={() => loadLogs(Math.max(1, logsMeta.page - 1))}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-dashboard-border/60 text-dashboard-heading disabled:opacity-40 hover:bg-dashboard-bg transition-colors"
              >
                Previous
              </button>
              <p className="text-xs text-dashboard-muted">
                Page {logsMeta.page} of {logsMeta.pages}
              </p>
              <button
                type="button"
                disabled={logsMeta.page >= logsMeta.pages || logsLoading}
                onClick={() => loadLogs(Math.min(logsMeta.pages, logsMeta.page + 1))}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-dashboard-border/60 text-dashboard-heading disabled:opacity-40 hover:bg-dashboard-bg transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
