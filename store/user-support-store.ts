import { create } from "zustand";
import { supportApi } from "@/services/support-api";
import type {
  SupportTicketListItem,
  SupportTicketDetail,
} from "@/types/support";

const CACHE_TTL = 60_000;
const MAX_DETAIL_CACHE = 10;

interface DetailCacheEntry {
  data: SupportTicketDetail;
  ts: number;
}

interface UserSupportState {
  tickets: SupportTicketListItem[];
  listLoading: boolean;
  listError: string | null;
  listFetchedAt: number;

  detailCache: Map<string, DetailCacheEntry>;
  detailLoading: boolean;
  detailError: string | null;

  fetchTickets: (force?: boolean) => Promise<void>;
  invalidateList: () => void;

  fetchDetail: (
    ticketNumber: string,
    force?: boolean,
  ) => Promise<SupportTicketDetail | null>;
  invalidateDetail: (ticketNumber: string) => void;
}

export const useUserSupportStore = create<UserSupportState>((set, get) => ({
  tickets: [],
  listLoading: false,
  listError: null,
  listFetchedAt: 0,

  detailCache: new Map(),
  detailLoading: false,
  detailError: null,

  fetchTickets: async (force = false) => {
    const { listFetchedAt } = get();

    if (!force && listFetchedAt && Date.now() - listFetchedAt < CACHE_TTL) {
      return;
    }

    set({ listLoading: true, listError: null });
    try {
      const res = await supportApi.getMyTickets();
      const ticketsList =
        res.data?.tickets ??
        (res as unknown as { tickets?: SupportTicketListItem[] }).tickets ??
        [];

      if (res.success) {
        set({
          tickets: ticketsList,
          listFetchedAt: Date.now(),
          listError: null,
        });
      } else {
        set({ listError: res.message ?? "Failed to load tickets" });
      }
    } catch (err) {
      set({
        listError:
          err instanceof Error ? err.message : "Failed to load tickets",
      });
    } finally {
      set({ listLoading: false });
    }
  },

  invalidateList: () => {
    set({ listFetchedAt: 0 });
  },

  fetchDetail: async (ticketNumber, force = false) => {
    const { detailCache } = get();

    if (!force) {
      const cached = detailCache.get(ticketNumber);
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        return cached.data;
      }
    }

    set({ detailLoading: true, detailError: null });
    try {
      const res = await supportApi.getTicket(ticketNumber);
      if (res.success && res.data?.ticket) {
        const ticket = res.data.ticket;
        const cache = new Map(get().detailCache);
        cache.set(ticketNumber, { data: ticket, ts: Date.now() });
        if (cache.size > MAX_DETAIL_CACHE) {
          const oldest = cache.keys().next().value;
          if (oldest) cache.delete(oldest);
        }
        set({ detailCache: cache, detailLoading: false });
        return ticket;
      }
      set({
        detailError: res.message ?? "Failed to load ticket",
        detailLoading: false,
      });
      return null;
    } catch (err) {
      set({
        detailError:
          err instanceof Error ? err.message : "Failed to load conversation",
        detailLoading: false,
      });
      return null;
    }
  },

  invalidateDetail: (ticketNumber) => {
    const cache = new Map(get().detailCache);
    cache.delete(ticketNumber);
    set({ detailCache: cache });
  },
}));
