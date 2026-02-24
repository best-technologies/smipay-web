"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { transactionApi } from "@/services/transaction-api";
import { getNetworkLogo } from "@/lib/network-logos";
import type { Transaction, PaginationMeta } from "@/types/transaction";

const PAGE_SIZE = 15;

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchTransactions = useCallback(async (p: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await transactionApi.getAllTransactions(p, PAGE_SIZE);
      if (res.success && res.data) {
        setTransactions(res.data.transactions);
        setMeta(res.data.pagination);
      } else {
        setError(res.message || "Failed to load transactions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(page);
  }, [page, fetchTransactions]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filtered = search.trim()
    ? transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.type.toLowerCase().includes(search.toLowerCase()) ||
          t.reference.toLowerCase().includes(search.toLowerCase())
      )
    : transactions;

  const statusStyle = (s: string) =>
    s === "success"
      ? "text-emerald-600"
      : s === "pending"
        ? "text-amber-600"
        : "text-red-500";

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-dashboard-surface/80 backdrop-blur-md border-b border-dashboard-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm font-medium text-dashboard-muted hover:text-dashboard-heading transition-colors touch-manipulation"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <h1 className="text-sm font-semibold text-dashboard-heading">
            Transactions
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="px-4 py-4 max-w-2xl mx-auto space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dashboard-muted/50 pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 h-9 text-[13px] rounded-xl border border-dashboard-border/50 bg-dashboard-surface text-dashboard-heading placeholder:text-dashboard-muted/40 outline-none focus:border-brand-bg-primary/50 focus:ring-1 focus:ring-brand-bg-primary/20 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-dashboard-bg/60 transition-colors"
            >
              <X className="h-3.5 w-3.5 text-dashboard-muted/60" />
            </button>
          )}
        </div>

        {/* Summary bar */}
        {meta && !loading && (
          <div className="flex items-center justify-between text-[11px] text-dashboard-muted px-0.5">
            <span>
              {meta.totalItems} transaction{meta.totalItems !== 1 && "s"}
            </span>
            <span>
              Page {meta.currentPage} of {meta.totalPages}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 animate-pulse ${i > 0 ? "border-t border-dashboard-border/30" : ""}`}
              >
                <div className="h-8 w-8 rounded-lg bg-dashboard-border/40 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-3/5 rounded bg-dashboard-border/40" />
                  <div className="h-2.5 w-2/5 rounded bg-dashboard-border/30" />
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-3 w-14 rounded bg-dashboard-border/40 ml-auto" />
                  <div className="h-2.5 w-10 rounded bg-dashboard-border/30 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200/60 bg-red-50/50 p-6 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button
              onClick={() => fetchTransactions(page)}
              className="text-sm font-medium text-brand-bg-primary hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface p-10 text-center">
            <Receipt className="h-8 w-8 text-dashboard-muted/30 mx-auto mb-2.5" />
            <p className="text-sm font-medium text-dashboard-heading mb-0.5">
              {search ? "No matching transactions" : "No transactions yet"}
            </p>
            <p className="text-[12px] text-dashboard-muted">
              {search
                ? "Try a different search term"
                : "Your transaction history will appear here"}
            </p>
          </div>
        )}

        {/* Transaction list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="rounded-2xl border border-dashboard-border/50 bg-dashboard-surface overflow-hidden">
            {filtered.map((tx, idx) => {
              const isCredit = tx.credit_debit === "credit";
              const logo =
                !isCredit && tx.icon
                  ? tx.icon
                  : !isCredit
                    ? getNetworkLogo(tx.type)
                    : null;

              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() =>
                    router.push(`/dashboard/transactions/${tx.id}`)
                  }
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-dashboard-bg/40 active:bg-dashboard-bg/60 transition-colors touch-manipulation ${
                    idx > 0 ? "border-t border-dashboard-border/30" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dashboard-bg/80">
                    {isCredit ? (
                      <ArrowDownLeft className="h-3.5 w-3.5 text-blue-500" />
                    ) : logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo}
                        alt=""
                        className="h-full w-full object-contain p-[5px]"
                      />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 text-dashboard-muted" />
                    )}
                  </div>

                  {/* Description + date */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-dashboard-heading truncate leading-tight">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-dashboard-muted mt-0.5 leading-tight">
                      {formatDate(tx.date)}
                    </p>
                  </div>

                  {/* Amount + status */}
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <p
                      className={`text-[13px] font-semibold tabular-nums leading-tight ${
                        isCredit ? "text-emerald-600" : "text-dashboard-heading"
                      }`}
                    >
                      {isCredit ? "+" : "−"}₦
                      {Number(String(tx.amount).replace(/,/g, "")).toLocaleString()}
                    </p>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${statusStyle(tx.status)}`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && !loading && (
          <div className="flex items-center justify-between pt-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 text-[12px] font-medium text-dashboard-muted hover:text-dashboard-heading disabled:opacity-30 disabled:pointer-events-none transition-colors touch-manipulation"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(meta.totalPages, 5) }).map(
                (_, i) => {
                  let p: number;
                  if (meta.totalPages <= 5) {
                    p = i + 1;
                  } else if (page <= 3) {
                    p = i + 1;
                  } else if (page >= meta.totalPages - 2) {
                    p = meta.totalPages - 4 + i;
                  } else {
                    p = page - 2 + i;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-7 w-7 rounded-lg text-[12px] font-medium transition-colors touch-manipulation ${
                        p === page
                          ? "bg-brand-bg-primary text-white"
                          : "text-dashboard-muted hover:bg-dashboard-bg/60"
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
              )}
            </div>

            <button
              disabled={page >= (meta?.totalPages ?? 1)}
              onClick={() =>
                setPage((p) => Math.min(meta?.totalPages ?? 1, p + 1))
              }
              className="flex items-center gap-1 text-[12px] font-medium text-dashboard-muted hover:text-dashboard-heading disabled:opacity-30 disabled:pointer-events-none transition-colors touch-manipulation"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
