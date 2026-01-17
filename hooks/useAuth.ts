"use client";

import { useAuthStore } from "@/store/auth-store-backend";
import { useEffect } from "react";

/**
 * Custom hook for authentication
 * Provides easy access to auth state and actions
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setLoading,
    setError,
    clearError,
    initializeAuth,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setLoading,
    setError,
    clearError,
  };
}

