"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { adminDashboardApi } from "@/services/admin/dashboard-api";
import type { AdminDashboardData } from "@/types/admin/dashboard";

const POLL_INTERVAL = 60_000; // 60 seconds

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStats = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const response = await adminDashboardApi.getStats();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || "Failed to load dashboard stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recalculate = useCallback(async () => {
    setIsRecalculating(true);
    try {
      const response = await adminDashboardApi.recalculateStats();
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to recalculate stats",
      );
    } finally {
      setIsRecalculating(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(true);

    intervalRef.current = setInterval(() => fetchStats(false), POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchStats]);

  return {
    data,
    isLoading,
    error,
    isRecalculating,
    refetch: () => fetchStats(true),
    recalculate,
  };
}
