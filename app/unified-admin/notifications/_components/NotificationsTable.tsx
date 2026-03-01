import Link from "next/link";
import { RotateCcw, Ban } from "lucide-react";
import type { NotificationCampaign } from "@/types/admin/notifications";
import { NotificationStatusBadge } from "./NotificationStatusBadge";

interface NotificationsTableProps {
  campaigns: NotificationCampaign[];
  actionLoadingId: string | null;
  onCancel: (id: string) => void;
  onResendFailed: (id: string) => void;
}

function formatDate(val?: string | null): string {
  if (!val) return "—";
  return new Date(val).toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getProgress(campaign: NotificationCampaign): number {
  if (!campaign.total_recipients) return 0;
  const done = campaign.sent_count + campaign.failed_count;
  return Math.min(100, Math.round((done / campaign.total_recipients) * 100));
}

export function NotificationsTable({
  campaigns,
  actionLoadingId,
  onCancel,
  onResendFailed,
}: NotificationsTableProps) {
  return (
    <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="bg-dashboard-bg/70 border-b border-dashboard-border/60">
            <tr className="text-left">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                Campaign
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                Audience
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                Status
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                Progress
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                Schedule/Sent
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                Created
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-dashboard-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-dashboard-muted">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => {
                const progress = getProgress(campaign);
                const canCancel = campaign.status === "scheduled";
                const canResend =
                  (campaign.status === "sent" || campaign.status === "failed") &&
                  campaign.failed_count > 0;
                const loadingThis = actionLoadingId === campaign.id;

                return (
                  <tr
                    key={campaign.id}
                    className="border-t border-dashboard-border/40 hover:bg-dashboard-bg/40 transition-colors"
                  >
                    <td className="px-4 py-3 align-top">
                      <Link
                        href={`/unified-admin/notifications/${campaign.id}`}
                        className="text-sm font-semibold text-dashboard-heading hover:text-brand-bg-primary transition-colors"
                      >
                        {campaign.title}
                      </Link>
                      <p className="text-xs text-dashboard-muted mt-0.5 line-clamp-1">
                        {campaign.subject}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="text-sm text-dashboard-heading capitalize">{campaign.target_type}</p>
                      <p className="text-xs text-dashboard-muted mt-0.5">
                        {campaign.total_recipients.toLocaleString()} recipients
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <NotificationStatusBadge status={campaign.status} />
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="w-44">
                        <div className="h-2 rounded-full bg-dashboard-border/60 overflow-hidden">
                          <div
                            className="h-full bg-brand-bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-dashboard-muted mt-1">
                          {campaign.sent_count}/{campaign.total_recipients} sent •{" "}
                          {campaign.failed_count} failed
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="text-xs text-dashboard-heading">
                        {campaign.scheduled_for ? formatDate(campaign.scheduled_for) : "Immediate"}
                      </p>
                      <p className="text-[11px] text-dashboard-muted mt-0.5">
                        Sent: {formatDate(campaign.sent_at)}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-dashboard-muted">
                      {formatDate(campaign.createdAt)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        {canCancel && (
                          <button
                            type="button"
                            disabled={loadingThis}
                            onClick={() => onCancel(campaign.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        )}
                        {canResend && (
                          <button
                            type="button"
                            disabled={loadingThis}
                            onClick={() => onResendFailed(campaign.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Resend Failed
                          </button>
                        )}
                        {!canCancel && !canResend && (
                          <span className="text-[11px] text-dashboard-muted">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
