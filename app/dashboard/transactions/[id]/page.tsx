"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  Copy,
  Check,
  Calendar,
  Hash,
  User,
  Phone,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { transactionApi } from "@/services/transaction-api";
import type { TransactionDetail } from "@/types/transaction";
import { getNetworkLogo } from "@/lib/network-logos";

export default function TransactionDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const transactionId = params.id as string;
  const providerFromQuery =
    (searchParams.get("provider") as string | null) || null;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const getTransactionLogo = (tx: TransactionDetail): string | null => {
    const providerKey = (tx.provider || providerFromQuery || "").toLowerCase();
    if (providerKey) {
      const logo = getNetworkLogo(providerKey);
      if (logo) return logo;
    }
    if (tx.icon) return tx.icon;
    return null;
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        setError(null);
        const response =
          await transactionApi.getTransactionById(transactionId);

        if (response.success && response.data) {
          setTransaction(response.data);
        } else {
          setError("Transaction not found");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) fetchTransaction();
  }, [transactionId]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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

  const statusConfig: Record<
    string,
    { icon: typeof CheckCircle2; color: string; bg: string; ring: string }
  > = {
    success: {
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    pending: {
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
    },
    failed: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-500/10",
      ring: "ring-red-500/20",
    },
    cancelled: {
      icon: Ban,
      color: "text-slate-500",
      bg: "bg-slate-500/10",
      ring: "ring-slate-500/20",
    },
  };

  const getStatus = (status: string) =>
    statusConfig[status] ?? statusConfig.cancelled;

  /* ── Loading ─────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-bg-primary mx-auto mb-3" />
          <p className="text-sm text-dashboard-muted">Loading details…</p>
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────── */
  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <div className="px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-dashboard-muted hover:text-dashboard-heading transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex flex-col items-center py-16">
            <XCircle className="h-10 w-10 text-red-400/60 mb-3" />
            <p className="text-sm text-red-500 mb-4">
              {error || "Transaction not found"}
            </p>
            <button
              onClick={() => router.push("/dashboard/transactions")}
              className="text-sm font-medium text-brand-bg-primary hover:underline"
            >
              View all transactions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatus(transaction.status);
  const StatusIcon = status.icon;
  const logo = getTransactionLogo(transaction);

  const infoRows: {
    icon: typeof Hash;
    label: string;
    value: string;
    mono?: boolean;
    copyable?: boolean;
    copyKey?: string;
  }[] = [
    {
      icon: Hash,
      label: "Reference",
      value: transaction.tx_reference,
      mono: true,
      copyable: true,
      copyKey: "ref",
    },
    {
      icon: Wallet,
      label: "Type",
      value: transaction.type.replace(/_/g, " "),
    },
    {
      icon: Calendar,
      label: "Created",
      value: formatDate(transaction.created_on),
    },
    ...(transaction.updated_on
      ? [
          {
            icon: Calendar,
            label: "Updated",
            value: formatDate(transaction.updated_on),
          },
        ]
      : []),
    ...(transaction.sender
      ? [{ icon: User, label: "Sender", value: transaction.sender }]
      : []),
    ...(transaction.recipient_mobile
      ? [
          {
            icon: Phone,
            label: "Recipient",
            value: transaction.recipient_mobile,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* ── Sticky compact header ──────────────── */}
      <header className="sticky top-0 z-30 bg-dashboard-surface/80 backdrop-blur-md border-b border-dashboard-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-dashboard-muted hover:text-dashboard-heading transition-colors touch-manipulation"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <h1 className="text-sm font-semibold text-dashboard-heading">
            Transaction
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4">
        {/* ── Status hero card ─────────────────── */}
        <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface p-5 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-3">
            {transaction.credit_debit === "credit" ? (
              <div className="p-2.5 rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
                <ArrowDownLeft className="h-7 w-7 text-blue-500" />
              </div>
            ) : logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={transaction.description}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-dashboard-border/40"
              />
            ) : (
              <div
                className={`p-2.5 rounded-full ${status.bg} ring-1 ${status.ring}`}
              >
                <StatusIcon className={`h-7 w-7 ${status.color}`} />
              </div>
            )}
          </div>

          {/* Badge */}
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${status.bg} ${status.color} ring-1 ${status.ring}`}
          >
            {transaction.status}
          </span>

          {/* Amount */}
          <p className="text-2xl sm:text-3xl font-bold text-dashboard-heading mt-3">
            ₦{Number(String(transaction.amount).replace(/,/g, "")).toLocaleString()}
          </p>

          {/* Description */}
          <p className="text-[13px] text-dashboard-muted mt-1.5 leading-snug max-w-xs mx-auto">
            {transaction.description}
          </p>
        </div>

        {/* ── Details list ─────────────────────── */}
        <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
          <div className="px-4 py-2.5 border-b border-dashboard-border/40">
            <h2 className="text-[13px] font-semibold text-dashboard-heading">
              Details
            </h2>
          </div>

          <div className="divide-y divide-dashboard-border/30">
            {infoRows.map((row) => (
              <div
                key={row.label}
                className="flex items-start gap-3 px-4 py-3"
              >
                <row.icon className="h-4 w-4 text-dashboard-muted/60 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-dashboard-muted uppercase tracking-wider mb-0.5">
                    {row.label}
                  </p>
                  <p
                    className={`text-[13px] font-medium text-dashboard-heading leading-snug ${
                      row.mono ? "font-mono break-all" : "capitalize"
                    }`}
                  >
                    {row.value}
                  </p>
                </div>
                {row.copyable && (
                  <button
                    onClick={() =>
                      copyToClipboard(row.value, row.copyKey ?? row.label)
                    }
                    className="p-1.5 -mr-1 rounded-lg hover:bg-dashboard-bg/60 transition-colors shrink-0 touch-manipulation"
                    title="Copy"
                  >
                    {copiedField === (row.copyKey ?? row.label) ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-dashboard-muted/50" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick actions ────────────────────── */}
        <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
          <button
            onClick={() => router.push("/dashboard/transactions")}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-dashboard-heading hover:bg-dashboard-bg/40 transition-colors touch-manipulation"
          >
            View all transactions
            <ChevronRight className="h-4 w-4 text-dashboard-muted/50" />
          </button>
          <div className="border-t border-dashboard-border/30" />
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-brand-bg-primary hover:bg-brand-bg-primary/[0.04] transition-colors touch-manipulation"
          >
            Back to Dashboard
            <ChevronRight className="h-4 w-4 text-brand-bg-primary/50" />
          </button>
        </div>
      </div>
    </div>
  );
}
