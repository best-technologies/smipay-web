"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useAdminTransactionsStore } from "@/store/admin/admin-transactions-store";
import type { TransactionFilters } from "@/types/admin/transactions";

const DEBOUNCE_MS = 400;

export function useAdminTransactions() {
  const {
    transactions,
    analytics,
    meta,
    filters,
    isLoading,
    error,
    fetchTransactions,
    setFilters,
    setPage,
    resetFilters,
  } = useAdminTransactionsStore();

  const mounted = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fetchTransactions();
      return;
    }
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.page,
    filters.status,
    filters.transaction_type,
    filters.credit_debit,
    filters.payment_channel,
    filters.min_amount,
    filters.max_amount,
    filters.date_from,
    filters.date_to,
    filters.sort_by,
    filters.sort_order,
  ]);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setFilters({ search: value });
      }, DEBOUNCE_MS);
    },
    [setFilters],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const updateFilters = useCallback(
    (patch: Partial<TransactionFilters>) => {
      setFilters(patch);
    },
    [setFilters],
  );

  const refetch = useCallback(() => fetchTransactions(true), [fetchTransactions]);

  return useMemo(
    () => ({
      transactions,
      analytics,
      meta,
      filters,
      isLoading,
      error,
      updateFilters,
      debouncedSearch,
      setPage,
      resetFilters,
      refetch,
    }),
    [transactions, analytics, meta, filters, isLoading, error, updateFilters, debouncedSearch, setPage, resetFilters, refetch],
  );
}
