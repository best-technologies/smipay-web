"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import type { TransactionItem } from "@/types/admin/transactions";

function formatNGN(value: number | null): string {
  if (value == null) return "—";
  return `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const statusBadge: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
};

const typeBadge: Record<string, string> = {
  transfer: "bg-blue-50 text-blue-700",
  deposit: "bg-emerald-50 text-emerald-700",
  airtime: "bg-purple-50 text-purple-700",
  data: "bg-indigo-50 text-indigo-700",
  cable: "bg-pink-50 text-pink-700",
  education: "bg-teal-50 text-teal-700",
  betting: "bg-orange-50 text-orange-700",
};

function CopyRef({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button type="button" onClick={handleCopy} className="inline-flex items-center gap-1 group" title={value}>
      <span className="truncate max-w-[100px]">{value}</span>
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />}
    </button>
  );
}

interface Props {
  transactions: TransactionItem[];
}

export function TransactionsTable({ transactions }: Props) {
  if (!transactions.length) {
    return (
      <div className="bg-dashboard-surface rounded-xl border border-dashboard-border/40 p-12 text-center">
        <p className="text-sm text-dashboard-muted">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-dashboard-surface rounded-xl border border-dashboard-border/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-dashboard-border/40 bg-dashboard-bg/50">
              <th className="text-left px-4 py-2.5 font-medium text-dashboard-muted">User</th>
              <th className="text-right px-4 py-2.5 font-medium text-dashboard-muted">Amount</th>
              <th className="text-left px-4 py-2.5 font-medium text-dashboard-muted">Type</th>
              <th className="text-left px-4 py-2.5 font-medium text-dashboard-muted">Status</th>
              <th className="text-center px-4 py-2.5 font-medium text-dashboard-muted">Dir</th>
              <th className="text-left px-4 py-2.5 font-medium text-dashboard-muted">Channel</th>
              <th className="text-right px-4 py-2.5 font-medium text-dashboard-muted">Revenue</th>
              <th className="text-left px-4 py-2.5 font-medium text-dashboard-muted">Reference</th>
              <th className="text-right px-4 py-2.5 font-medium text-dashboard-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => {
              const userName = tx.user
                ? [tx.user.first_name, tx.user.last_name].filter(Boolean).join(" ") || tx.user.email || tx.user.phone_number
                : "—";
              const avatar = tx.user?.first_name?.[0]?.toUpperCase() ?? "?";
              return (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-dashboard-border/20 hover:bg-dashboard-bg/40 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <Link href={`/unified-admin/transactions/${tx.id}`} className="flex items-center gap-2">
                      {tx.user?.profile_image?.secure_url ? (
                        <img src={tx.user.profile_image.secure_url} alt="" className="h-6 w-6 rounded-full object-cover" />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-brand-bg-primary/10 text-brand-bg-primary flex items-center justify-center text-[10px] font-bold">
                          {avatar}
                        </div>
                      )}
                      <span className="text-dashboard-heading font-medium truncate max-w-[120px]">{userName}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-dashboard-heading whitespace-nowrap">
                    {formatNGN(tx.amount)}
                  </td>
                  <td className="px-4 py-2.5">
                    {tx.transaction_type && (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${typeBadge[tx.transaction_type] ?? "bg-slate-100 text-slate-600"}`}>
                        {tx.transaction_type}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {tx.status && (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusBadge[tx.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {tx.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {tx.credit_debit === "credit" ? (
                      <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-500 inline" />
                    ) : tx.credit_debit === "debit" ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-red-500 inline" />
                    ) : (
                      <span className="text-dashboard-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-dashboard-muted capitalize whitespace-nowrap">
                    {tx.payment_channel?.replace(/_/g, " ") ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    {tx.markup_value != null ? (
                      <span className="text-emerald-600 font-medium">{formatNGN(tx.markup_value)}</span>
                    ) : (
                      <span className="text-dashboard-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-dashboard-muted">
                    {tx.transaction_reference ? <CopyRef value={tx.transaction_reference} /> : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-dashboard-muted whitespace-nowrap" title={new Date(tx.createdAt).toLocaleString()}>
                    {relativeTime(tx.createdAt)}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
