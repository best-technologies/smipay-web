import { create } from "zustand";
import { vtpassCableApi } from "@/services/vtpass/vtu/vtpass-cable-api";
import type { VtpassCableService } from "@/types/vtpass/vtu/vtpass-cable";

interface VtpassCableState {
  serviceIds: VtpassCableService[] | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Actions
  fetchServiceIds: (forceRefresh?: boolean) => Promise<void>;
  setServiceIds: (services: VtpassCableService[]) => void;
  clearServiceIds: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Cache duration: 5 minutes (service IDs don't change often)
const CACHE_DURATION = 5 * 60 * 1000;

export const useVtpassCableStore = create<VtpassCableState>((set, get) => ({
  serviceIds: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchServiceIds: async (forceRefresh = false) => {
    const state = get();
    
    // If already loading, don't start another request
    if (state.isLoading) {
      return;
    }

    // Check if we have cached data and it's still fresh (only if not forcing refresh)
    if (!forceRefresh && state.serviceIds && state.lastFetched) {
      const cacheAge = Date.now() - state.lastFetched;
      if (cacheAge < CACHE_DURATION) {
        // Data is still fresh, don't refetch
        return;
      }
    }

    try {
      set({ isLoading: true, error: null });
      const response = await vtpassCableApi.getServiceIds();
      
      if (response.success && response.data) {
        set({
          serviceIds: response.data,
          lastFetched: Date.now(),
          error: null,
          isLoading: false,
        });
      } else {
        set({ 
          error: "Failed to load service IDs",
          isLoading: false,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      set({ 
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  setServiceIds: (services) => {
    set({
      serviceIds: services,
      lastFetched: Date.now(),
      error: null,
    });
  },

  clearServiceIds: () => {
    set({
      serviceIds: null,
      lastFetched: null,
      error: null,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));
