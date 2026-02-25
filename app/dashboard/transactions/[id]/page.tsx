"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
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
  Zap,
  Tv,
  Wifi,
  MapPin,
  CreditCard,
  ArrowUpDown,
  Receipt,
  Smartphone,
} from "lucide-react";
import { transactionApi } from "@/services/transaction-api";
import type {
  TransactionDetail,
  ElectricityMeta,
  CableMeta,
  DataMeta,
  AirtimeMeta,
} from "@/types/transaction";
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

  const statusConfig: Record<
    string,
    { icon: typeof CheckCircle2; color: string; bg: string; ring: string; textColor: string }
  > = {
    success: {
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
      textColor: "text-emerald-700",
    },
    pending: {
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
      textColor: "text-amber-700",
    },
    failed: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-500/10",
      ring: "ring-red-500/20",
      textColor: "text-red-700",
    },
    cancelled: {
      icon: Ban,
      color: "text-slate-500",
      bg: "bg-slate-500/10",
      ring: "ring-slate-500/20",
      textColor: "text-slate-600",
    },
  };

  const getStatus = (status: string) =>
    statusConfig[status] ?? statusConfig.cancelled;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "electricity":
        return Zap;
      case "cable":
        return Tv;
      case "data":
        return Wifi;
      case "airtime":
        return Phone;
      default:
        return Receipt;
    }
  };

  const parseAmount = (amount: string | number): number => {
    if (typeof amount === "number") return amount;
    return Number(String(amount).replace(/[₦,]/g, "")) || 0;
  };

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
  const TypeIcon = getTypeIcon(transaction.type);
  const logo = getTransactionLogo(transaction);
  const meta = transaction.meta || {};
  const isElectricity = transaction.type === "electricity";
  const isCable = transaction.type === "cable";
  const isData = transaction.type === "data";
  const isAirtime = transaction.type === "airtime";

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
            Transaction Details
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-3.5 pb-8">
        {/* ── Status hero card ─────────────────── */}
        <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface p-5 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-3">
            {transaction.credit_debit === "credit" ? (
              <div className="p-2.5 rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
                <ArrowDownLeft className="h-7 w-7 text-blue-500" />
              </div>
            ) : logo ? (
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-dashboard-border/40">
                <Image
                  src={logo}
                  alt={transaction.description}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className={`p-2.5 rounded-full ${status.bg} ring-1 ${status.ring}`}
              >
                <TypeIcon className={`h-7 w-7 ${status.color}`} />
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
            ₦{parseAmount(transaction.amount).toLocaleString()}
          </p>

          {/* Description */}
          <p className="text-[13px] text-dashboard-muted mt-1.5 leading-snug max-w-xs mx-auto">
            {transaction.description}
          </p>
        </div>

        {/* ── Electricity Token Card (prominent) ── */}
        {isElectricity && "electricity_token" in meta && (meta as ElectricityMeta).electricity_token && (
          <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-100">
                <Zap className="h-4 w-4 text-amber-700" />
              </div>
              <p className="text-sm font-bold text-amber-900">Electricity Token</p>
            </div>

            <div className="flex items-center justify-between bg-white rounded-xl p-3.5 sm:p-4 border border-amber-200 shadow-sm">
              <span className="font-mono font-bold text-lg sm:text-2xl text-amber-900 tracking-wider break-all leading-relaxed">
                {(meta as ElectricityMeta).electricity_token}
              </span>
              <button
                onClick={() =>
                  copyToClipboard(
                    (meta as ElectricityMeta).electricity_token,
                    "token"
                  )
                }
                className="p-2.5 hover:bg-amber-100 rounded-xl transition-colors ml-3 shrink-0"
                title="Copy token"
              >
                {copiedField === "token" ? (
                  <Check className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Copy className="h-5 w-5 text-amber-700" />
                )}
              </button>
            </div>

            {(meta as ElectricityMeta).units && (
              <div className="flex items-center gap-1.5 mt-3">
                <Zap className="h-3.5 w-3.5 text-amber-600" />
                <p className="text-sm font-semibold text-amber-800">
                  Units: {(meta as ElectricityMeta).units}
                </p>
              </div>
            )}
            <p className="text-[11px] text-amber-600 mt-2">
              Save this token. You need it to load electricity on your meter.
            </p>
          </div>
        )}

        {/* ── Type-specific details ────────────── */}
        {isElectricity && "meter_number" in meta && (
          <ElectricityDetails meta={meta as ElectricityMeta} />
        )}

        {isCable && "smartcard_number" in meta && (
          <CableDetails meta={meta as CableMeta} />
        )}

        {isData && "plan" in meta && (
          <DataDetails meta={meta as DataMeta} logo={logo} />
        )}

        {isAirtime && "phone" in meta && "network" in meta && !("plan" in meta) && (
          <AirtimeDetails meta={meta as AirtimeMeta} logo={logo} />
        )}

        {/* ── Transaction Info ─────────────────── */}
        <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
          <div className="px-4 py-2.5 border-b border-dashboard-border/40">
            <h2 className="text-[13px] font-semibold text-dashboard-heading">
              Transaction Info
            </h2>
          </div>

          <div className="divide-y divide-dashboard-border/30">
            <InfoRow
              icon={Hash}
              label="Reference"
              value={transaction.tx_reference}
              mono
              copyable
              copyKey="ref"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />
            {transaction.transaction_number && (
              <InfoRow
                icon={Receipt}
                label="Transaction Number"
                value={transaction.transaction_number}
                mono
                copyable
                copyKey="txnum"
                copiedField={copiedField}
                onCopy={copyToClipboard}
              />
            )}
            <InfoRow
              icon={Wallet}
              label="Type"
              value={transaction.type.replace(/_/g, " ")}
            />
            {transaction.payment_method && (
              <InfoRow
                icon={CreditCard}
                label="Payment Method"
                value={transaction.payment_method}
              />
            )}
            <InfoRow
              icon={Calendar}
              label="Date"
              value={transaction.created_on}
            />
            {transaction.updated_on && transaction.updated_on !== transaction.created_on && (
              <InfoRow
                icon={Calendar}
                label="Updated"
                value={transaction.updated_on}
              />
            )}
            {transaction.sender && (
              <InfoRow
                icon={User}
                label="Sender"
                value={transaction.sender}
              />
            )}
            {transaction.recipient_mobile && (
              <InfoRow
                icon={Phone}
                label="Recipient"
                value={transaction.recipient_mobile}
              />
            )}
          </div>
        </div>

        {/* ── Balance Info ──────────────────────── */}
        {(transaction.balance_before !== undefined || transaction.balance_after !== undefined) && (
          <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
            <div className="px-4 py-2.5 border-b border-dashboard-border/40">
              <h2 className="text-[13px] font-semibold text-dashboard-heading">
                Balance
              </h2>
            </div>
            <div className="divide-y divide-dashboard-border/30">
              {transaction.balance_before !== undefined && (
                <InfoRow
                  icon={Wallet}
                  label="Before"
                  value={`₦${transaction.balance_before.toLocaleString()}`}
                />
              )}
              {transaction.balance_after !== undefined && (
                <InfoRow
                  icon={Wallet}
                  label="After"
                  value={`₦${transaction.balance_after.toLocaleString()}`}
                />
              )}
              {transaction.fee !== undefined && transaction.fee > 0 && (
                <InfoRow
                  icon={ArrowUpDown}
                  label="Fee"
                  value={`₦${transaction.fee.toLocaleString()}`}
                />
              )}
            </div>
          </div>
        )}

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

/* ═══════════════════════════════════════════════════
   Type-specific detail components
   ═══════════════════════════════════════════════════ */

function ElectricityDetails({ meta }: { meta: ElectricityMeta }) {
  return (
    <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
      <div className="px-4 py-2.5 border-b border-dashboard-border/40 flex items-center gap-2">
        <Zap className="h-3.5 w-3.5 text-amber-600" />
        <h2 className="text-[13px] font-semibold text-dashboard-heading">
          Meter Details
        </h2>
      </div>
      <div className="divide-y divide-dashboard-border/30">
        {meta.customer_name && (
          <DetailRow label="Customer Name" value={meta.customer_name} />
        )}
        {meta.meter_number && (
          <DetailRow label="Meter Number" value={meta.meter_number} mono />
        )}
        {meta.meter_type && (
          <DetailRow label="Meter Type" value={meta.meter_type} capitalize />
        )}
        {meta.disco && (
          <DetailRow label="Distribution Company" value={meta.disco} />
        )}
        {meta.customer_address && (
          <DetailRow label="Address" value={meta.customer_address} icon={MapPin} />
        )}
      </div>
    </div>
  );
}

function CableDetails({ meta }: { meta: CableMeta }) {
  return (
    <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
      <div className="px-4 py-2.5 border-b border-dashboard-border/40 flex items-center gap-2">
        <Tv className="h-3.5 w-3.5 text-blue-600" />
        <h2 className="text-[13px] font-semibold text-dashboard-heading">
          Subscription Details
        </h2>
      </div>
      <div className="divide-y divide-dashboard-border/30">
        {meta.customer_name && (
          <DetailRow label="Customer Name" value={meta.customer_name} />
        )}
        {meta.bouquet && (
          <DetailRow label="Bouquet / Plan" value={meta.bouquet} />
        )}
        {meta.smartcard_number && (
          <DetailRow label="Smartcard Number" value={meta.smartcard_number} mono />
        )}
        {meta.subscription_type && (
          <DetailRow label="Subscription Type" value={meta.subscription_type} capitalize />
        )}
      </div>
    </div>
  );
}

function DataDetails({ meta, logo }: { meta: DataMeta; logo: string | null }) {
  return (
    <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
      <div className="px-4 py-2.5 border-b border-dashboard-border/40 flex items-center gap-2">
        <Wifi className="h-3.5 w-3.5 text-purple-600" />
        <h2 className="text-[13px] font-semibold text-dashboard-heading">
          Data Details
        </h2>
      </div>
      <div className="divide-y divide-dashboard-border/30">
        {meta.plan && (
          <DetailRow label="Plan" value={meta.plan} />
        )}
        {meta.phone && (
          <DetailRow label="Phone Number" value={meta.phone} mono />
        )}
        {meta.network && (
          <DetailRow
            label="Network"
            value={meta.network.replace(/-/g, " ").replace(/\bdata\b/i, "").trim()}
            capitalize
            logoSrc={logo}
          />
        )}
      </div>
    </div>
  );
}

function AirtimeDetails({ meta, logo }: { meta: AirtimeMeta; logo: string | null }) {
  return (
    <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
      <div className="px-4 py-2.5 border-b border-dashboard-border/40 flex items-center gap-2">
        <Smartphone className="h-3.5 w-3.5 text-green-600" />
        <h2 className="text-[13px] font-semibold text-dashboard-heading">
          Airtime Details
        </h2>
      </div>
      <div className="divide-y divide-dashboard-border/30">
        {meta.phone && (
          <DetailRow label="Phone Number" value={meta.phone} mono />
        )}
        {meta.network && (
          <DetailRow
            label="Network"
            value={meta.network.replace(/-/g, " ").trim()}
            capitalize
            logoSrc={logo}
          />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Reusable row components
   ═══════════════════════════════════════════════════ */

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
  copyable,
  copyKey,
  copiedField,
  onCopy,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
  copyKey?: string;
  copiedField?: string | null;
  onCopy?: (text: string, field: string) => void;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Icon className="h-4 w-4 text-dashboard-muted/60 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-dashboard-muted uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p
          className={`text-[13px] font-medium text-dashboard-heading leading-snug ${
            mono ? "font-mono break-all" : "capitalize"
          }`}
        >
          {value}
        </p>
      </div>
      {copyable && onCopy && (
        <button
          onClick={() => onCopy(value, copyKey ?? label)}
          className="p-1.5 -mr-1 rounded-lg hover:bg-dashboard-bg/60 transition-colors shrink-0 touch-manipulation"
          title="Copy"
        >
          {copiedField === (copyKey ?? label) ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-dashboard-muted/50" />
          )}
        </button>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
  capitalize: cap,
  icon: Icon,
  logoSrc,
}: {
  label: string;
  value: string;
  mono?: boolean;
  capitalize?: boolean;
  icon?: typeof MapPin;
  logoSrc?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      {Icon && <Icon className="h-4 w-4 text-dashboard-muted/60 mt-0.5 shrink-0" />}
      {!Icon && logoSrc && (
        <div className="relative h-5 w-5 rounded overflow-hidden ring-1 ring-dashboard-border/40 shrink-0 mt-0.5">
          <Image src={logoSrc} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-dashboard-muted uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p
          className={`text-[13px] font-medium text-dashboard-heading leading-snug ${
            mono ? "font-mono break-all" : ""
          } ${cap ? "capitalize" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
