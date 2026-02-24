import { create } from "zustand";
import { adminTransactionsApi } from "@/services/admin/transactions-api";
import type {
  TransactionItem,
  TransactionAnalytics,
  TransactionListMeta,
  TransactionFilters,
} from "@/types/admin/transactions";

const CACHE_TTL = 60_000;
const MAX_CACHE = 20;

interface CacheEntry {
  data: {
    analytics: TransactionAnalytics;
    transactions: TransactionItem[];
    meta: TransactionListMeta;
  };
  ts: number;
}

function filtersKey(f: TransactionFilters): string {
  return JSON.stringify(f);
}

const DEFAULT_FILTERS: TransactionFilters = {
  page: 1,
  limit: 20,
  search: "",
  status: "",
  transaction_type: "",
  credit_debit: "",
  payment_channel: "",
  user_id: "",
  min_amount: "",
  max_amount: "",
  date_from: "",
  date_to: "",
  sort_by: "createdAt",
  sort_order: "desc",
};

interface AdminTransactionsState {
  transactions: TransactionItem[];
  analytics: TransactionAnalytics | null;
  meta: TransactionListMeta | null;
  filters: TransactionFilters;
  isLoading: boolean;
  error: string | null;
  cache: Map<string, CacheEntry>;

  fetchTransactions: (force?: boolean) => Promise<void>;
  setFilters: (patch: Partial<TransactionFilters>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useAdminTransactionsStore = create<AdminTransactionsState>((set, get) => ({
  transactions: [],
  analytics: null,
  meta: null,
  filters: { ...DEFAULT_FILTERS },
  isLoading: false,
  error: null,
  cache: new Map(),

  fetchTransactions: async (force = false) => {
    const { filters, cache } = get();
    const key = filtersKey(filters);

    if (!force) {
      const cached = cache.get(key);
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        set({
          transactions: cached.data.transactions,
          analytics: cached.data.analytics,
          meta: cached.data.meta,
          error: null,
        });
        return;
      }
    }

    set({ isLoading: true, error: null });
    try {
      const res = await adminTransactionsApi.list(filters);
      if (res.success && res.data) {
        const entry: CacheEntry = { data: res.data, ts: Date.now() };
        const newCache = new Map(get().cache);
        newCache.set(key, entry);
        if (newCache.size > MAX_CACHE) {
          const oldest = newCache.keys().next().value;
          if (oldest) newCache.delete(oldest);
        }
        set({
          transactions: res.data.transactions,
          analytics: res.data.analytics,
          meta: res.data.meta,
          cache: newCache,
          error: null,
        });
      } else {
        set({ error: res.message || "Failed to load transactions" });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load transactions" });
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (patch) => {
    set((s) => ({ filters: { ...s.filters, ...patch, page: 1 } }));
  },

  setPage: (page) => {
    set((s) => ({ filters: { ...s.filters, page } }));
  },

  resetFilters: () => {
    set({ filters: { ...DEFAULT_FILTERS } });
  },
}));
