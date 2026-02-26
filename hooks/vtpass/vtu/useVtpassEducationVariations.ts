import { useState, useEffect, useRef } from "react";
import { vtpassEducationApi } from "@/services/vtpass/vtu/vtpass-education-api";
import type { VtpassEducationVariationsResponse } from "@/types/vtpass/vtu/vtpass-education";

interface UseVariationsState {
  data: VtpassEducationVariationsResponse["data"] | null;
  isLoading: boolean;
  error: string | null;
}

const educationVariationCache = new Map<
  string,
  { data: VtpassEducationVariationsResponse["data"]; timestamp: number }
>();
let activeFetch: string | null = null;

const CACHE_DURATION = 10 * 60 * 1000;

export function useVtpassEducationVariations(serviceID: string | null) {
  const [state, setState] = useState<UseVariationsState>(() => {
    if (serviceID) {
      const cached = educationVariationCache.get(serviceID);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return { data: cached.data, isLoading: false, error: null };
      }
    }
    return { data: null, isLoading: false, error: null };
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!serviceID) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    const cached = educationVariationCache.get(serviceID);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setState({ data: cached.data, isLoading: false, error: null });
      return;
    }

    if (activeFetch === serviceID) return;

    activeFetch = serviceID;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    vtpassEducationApi
      .getVariations(serviceID)
      .then((response) => {
        if (response.success && response.data) {
          educationVariationCache.set(serviceID, {
            data: response.data,
            timestamp: Date.now(),
          });
          if (mountedRef.current)
            setState({ data: response.data, isLoading: false, error: null });
        } else {
          if (mountedRef.current)
            setState({
              data: null,
              isLoading: false,
              error: "Failed to load education plans",
            });
        }
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "An error occurred";
        if (mountedRef.current)
          setState({ data: null, isLoading: false, error: msg });
      })
      .finally(() => {
        activeFetch = null;
      });
  }, [serviceID]);

  return {
    variations: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch: () => {
      if (serviceID) {
        educationVariationCache.delete(serviceID);
        activeFetch = null;
        setState((prev) => ({ ...prev, isLoading: true }));
      }
    },
  };
}
