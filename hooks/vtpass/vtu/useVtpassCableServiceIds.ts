import { useEffect, useRef } from "react";
import { useVtpassCableStore } from "@/store/vtpass/vtu/vtpass-cable-store";

/**
 * Hook to fetch and access VTPass cable TV service IDs
 * Automatically fetches if not cached or cache is expired
 * Prevents multiple fetches during component mount
 */
export function useVtpassCableServiceIds() {
  const { serviceIds, isLoading, error, fetchServiceIds } = useVtpassCableStore();
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
