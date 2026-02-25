import { useState, useEffect, useRef } from "react";
import { vtpassCableApi } from "@/services/vtpass/vtu/vtpass-cable-api";
import type { VtpassCableVariationCodesResponse } from "@/types/vtpass/vtu/vtpass-cable";

interface UseVariationCodesState {
  data: VtpassCableVariationCodesResponse["data"] | null;
  isLoading: boolean;
  error: string | null;
}

// Module-level cache so data survives component unmount / page navigation.
const cableVariationCache = new Map<string, { data: VtpassCableVariationCodesResponse["data"]; timestamp: number }>();
let activeFetch: string | null = null;

const CACHE_DURATION = 10 * 60 * 1000;

export function useVtpassCableVariationCodes(serviceID: string | null) {
  const [state, setState] = useState<UseVariationCodesState>(() => {
    if (serviceID) {
      const cached = cableVariationCache.get(serviceID);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return { data: cached.data, isLoading: false, error: null };
      }
    }
    return { data: null, isLoading: false, error: null };
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!serviceID) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    const cached = cableVariationCache.get(serviceID);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setState({ data: cached.data, isLoading: false, error: null });
      return;
    }

    if (activeFetch === serviceID) return;

    activeFetch = serviceID;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    vtpassCableApi
      .getVariationCodes(serviceID)
      .then((response) => {
        if (response.success && response.data) {
          cableVariationCache.set(serviceID, { data: response.data, timestamp: Date.now() });
          if (mountedRef.current) setState({ data: response.data, isLoading: false, error: null });
        } else {
          if (mountedRef.current) setState({ data: null, isLoading: false, error: "Failed to load subscription plans" });
        }
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "An error occurred";
        if (mountedRef.current) setState({ data: null, isLoading: false, error: msg });
      })
      .finally(() => { activeFetch = null; });
  }, [serviceID]);

  return {
    variationCodes: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch: () => {
      if (serviceID) {
        cableVariationCache.delete(serviceID);
        activeFetch = null;
        setState((prev) => ({ ...prev, isLoading: true }));
      }
    },
  };
}
