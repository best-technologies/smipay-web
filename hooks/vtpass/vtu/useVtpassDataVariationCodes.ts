import { useState, useEffect, useRef } from "react";
import { vtpassDataApi } from "@/services/vtpass/vtu/vtpass-data-api";
import type { VtpassDataVariationCodesResponse } from "@/types/vtpass/vtu/vtpass-data";

interface UseVariationCodesState {
  data: VtpassDataVariationCodesResponse["data"] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and access VTPass data variation codes for a specific service
 * Automatically fetches when serviceID changes
 * Includes caching per serviceID
 */
export function useVtpassDataVariationCodes(serviceID: string | null) {
  const [state, setState] = useState<UseVariationCodesState>({
    data: null,
    isLoading: false,
    error: null,
  });

  // Cache to store variation codes per serviceID
  const cacheRef = useRef<Map<string, { data: VtpassDataVariationCodesResponse["data"]; timestamp: number }>>(new Map());
  const fetchingRef = useRef<string | null>(null);
  
  // Cache duration: 10 minutes (variation codes don't change often)
  const CACHE_DURATION = 10 * 60 * 1000;

  useEffect(() => {
    if (!serviceID) {
      queueMicrotask(() => setState({ data: null, isLoading: false, error: null }));
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

    vtpassDataApi
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
            error: "Failed to load data plans",
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
  }, [serviceID, CACHE_DURATION]);

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
