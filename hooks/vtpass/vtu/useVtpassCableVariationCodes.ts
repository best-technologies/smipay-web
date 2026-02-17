import { useState, useEffect, useRef } from "react";
import { vtpassCableApi } from "@/services/vtpass/vtu/vtpass-cable-api";
import type { VtpassCableVariationCodesResponse } from "@/types/vtpass/vtu/vtpass-cable";

interface UseVariationCodesState {
  data: VtpassCableVariationCodesResponse["data"] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and access VTPass cable TV variation codes for a specific service
 * Automatically fetches when serviceID changes
 * Includes caching per serviceID
 */
export function useVtpassCableVariationCodes(serviceID: string | null) {
  const [state, setState] = useState<UseVariationCodesState>({
    data: null,
    isLoading: false,
    error: null,
  });

  // Cache to store variation codes per serviceID
  const cacheRef = useRef<Map<string, { data: VtpassCableVariationCodesResponse["data"]; timestamp: number }>>(new Map());
  const fetchingRef = useRef<string | null>(null);
  
  // Cache duration: 10 minutes (variation codes don't change often)
  const CACHE_DURATION = 10 * 60 * 1000;

  useEffect(() => {
    if (!serviceID) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    // Check cache first
    const cached = cacheRef.current.get(serviceID);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setState({ data: cached.data, isLoading: false, error: null });
      return;
    }

    // Prevent duplicate requests
    if (fetchingRef.current === serviceID) {
      return;
    }

    fetchingRef.current = serviceID;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    vtpassCableApi
      .getVariationCodes(serviceID)
      .then((response) => {
        if (response.success && response.data) {
          // Update cache
          cacheRef.current.set(serviceID, {
            data: response.data,
            timestamp: Date.now(),
          });
          setState({ data: response.data, isLoading: false, error: null });
        } else {
          setState({
            data: null,
            isLoading: false,
            error: "Failed to load subscription plans",
          });
        }
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setState({ data: null, isLoading: false, error: errorMessage });
      })
      .finally(() => {
        fetchingRef.current = null;
      });
  }, [serviceID]);

  return {
    variationCodes: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch: () => {
      if (serviceID) {
        cacheRef.current.delete(serviceID);
        fetchingRef.current = null;
        // Trigger re-fetch by updating state
        setState((prev) => ({ ...prev, isLoading: true }));
      }
    },
  };
}
