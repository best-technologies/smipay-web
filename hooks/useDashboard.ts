"use client";

import { useEffect, useRef } from "react";
import { useDashboardStore } from "@/store/dashboard-store";

/**
 * Custom hook for dashboard data
 * Automatically fetches data if not cached or cache expired
 * Returns cached data immediately if available
 */
export function useDashboard(forceRefresh = false) {
  // Use selectors to only subscribe to the data we need
  const dashboardData = useDashboardStore((state) => state.dashboardData);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const error = useDashboardStore((state) => state.error);
  const fetchDashboardData = useDashboardStore((state) => state.fetchDashboardData);

  // Track if we've already called fetch in this component mount
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch once per component mount
    // The store's fetchDashboardData already handles cache checking
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchDashboardData(forceRefresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount

  return {
    dashboardData,
    isLoading,
    error,
    refetch: () => {
      hasFetched.current = false; // Allow refetch
      fetchDashboardData(true);
    },
  };
}
