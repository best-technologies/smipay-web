import { create } from "zustand";
import { userApi } from "@/services/user-api";
import type { DashboardData } from "@/types/dashboard";

interface DashboardState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Actions
  fetchDashboardData: (forceRefresh?: boolean) => Promise<void>;
  setDashboardData: (data: DashboardData) => void;
  clearDashboardData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Cache duration: 30 seconds (adjust as needed)
const CACHE_DURATION = 30 * 1000;

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboardData: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchDashboardData: async (forceRefresh = false) => {
    const state = get();
    
    // If already loading, don't start another request
    if (state.isLoading) {
      return;
    }

    // Check if we have cached data and it's still fresh (only if not forcing refresh)
    if (!forceRefresh && state.dashboardData && state.lastFetched) {
      const cacheAge = Date.now() - state.lastFetched;
      if (cacheAge < CACHE_DURATION) {
        // Data is still fresh, don't refetch
        return;
      }
    }

    try {
      set({ isLoading: true, error: null });
      const response = await userApi.getAppHomepageDetails();
      
      if (response.success && response.data) {
        set({
          dashboardData: response.data,
          lastFetched: Date.now(),
          error: null,
          isLoading: false,
        });
      } else {
        set({ 
          error: "Failed to load dashboard data",
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

  setDashboardData: (data) => {
    set({
      dashboardData: data,
      lastFetched: Date.now(),
      error: null,
    });
  },

  clearDashboardData: () => {
    set({
      dashboardData: null,
      lastFetched: null,
      error: null,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));
