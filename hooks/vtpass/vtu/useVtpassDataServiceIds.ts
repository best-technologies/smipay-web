import { useEffect, useRef } from "react";
import { useVtpassDataStore } from "@/store/vtpass/vtu/vtpass-data-store";

/**
 * Hook to fetch and access VTPass data service IDs
 * Automatically fetches if not cached or cache is expired
 * Prevents multiple fetches during component mount
 */
export function useVtpassDataServiceIds() {
  const { serviceIds, isLoading, error, fetchServiceIds } = useVtpassDataStore();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch once per component mount
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchServiceIds();
    }
  }, [fetchServiceIds]);

  // Return serviceIds as array (never null)
  return {
    serviceIds: serviceIds || [],
    isLoading,
    error,
    refetch: () => fetchServiceIds(true),
  };
}
