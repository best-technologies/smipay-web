"use client";

import { useEffect, useRef } from "react";
import { useVtpassAirtimeStore } from "@/store/vtpass/vtu/vtpass-airtime-store";

/**
 * Custom hook for VTPass airtime service IDs
 * Automatically fetches data if not cached or cache expired
 * Returns cached data immediately if available
 */
export function useVtpassServiceIds(forceRefresh = false) {
  // Use selectors to only subscribe to the data we need
  const serviceIds = useVtpassAirtimeStore((state) => state.serviceIds);
  const isLoading = useVtpassAirtimeStore((state) => state.isLoading);
  const error = useVtpassAirtimeStore((state) => state.error);
  const fetchServiceIds = useVtpassAirtimeStore((state) => state.fetchServiceIds);

  // Track if we've already called fetch in this component mount
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch once per component mount
    // The store's fetchServiceIds already handles cache checking
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchServiceIds(forceRefresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount

  return {
    serviceIds: serviceIds || [], // Always return an array, never null
    isLoading,
    error,
    refetch: () => {
      hasFetched.current = false; // Allow refetch
      fetchServiceIds(true);
    },
  };
}
