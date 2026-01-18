"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store-backend";
import {
  updateLastActivity,
  isSessionExpired,
  getTimeUntilExpiry,
  SESSION_WARNING_TIME,
  clearAuth,
} from "@/lib/auth-storage";

/**
 * Activity Tracker Hook
 * Monitors user activity and automatically logs out after inactivity
 * Shows warning before session expires (fintech security)
 */
export function useActivityTracker() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (isAuthenticated) {
      updateLastActivity();
      setShowWarning(false);
    }
  }, [isAuthenticated]);

  // Check session and show warning if needed
  const checkSession = useCallback(() => {
    if (!isAuthenticated) return;

    // Check if session has expired
    if (isSessionExpired()) {
      handleLogout("Your session has expired due to inactivity.");
      return;
    }

    // Check if we should show warning
    const timeLeft = getTimeUntilExpiry();
    setTimeRemaining(Math.ceil(timeLeft / 1000)); // Convert to seconds

    if (timeLeft <= SESSION_WARNING_TIME && timeLeft > 0) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [isAuthenticated]);

  // Handle logout
  const handleLogout = useCallback((message?: string) => {
    clearAuth();
    logout();
    
    const url = new URL("/auth/signin", window.location.origin);
    if (message) {
      url.searchParams.set("expired", "true");
      url.searchParams.set("message", message);
    }
    
    router.push(url.toString());
  }, [logout, router]);

  // Extend session (user clicked "Stay logged in")
  const extendSession = useCallback(() => {
    updateLastActivity();
    setShowWarning(false);
  }, []);

  // Setup activity listeners
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear intervals if not authenticated
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current);
      }
      return;
    }

    // Activity events to monitor
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Add throttle to prevent too many updates
    let lastUpdate = 0;
    const throttleTime = 5000; // Update every 5 seconds max

    const throttledHandleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate >= throttleTime) {
        lastUpdate = now;
        handleActivity();
      }
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, throttledHandleActivity);
    });

    // Check session every 10 seconds
    checkIntervalRef.current = setInterval(checkSession, 10000);

    // Update countdown when warning is shown
    warningIntervalRef.current = setInterval(() => {
      if (showWarning) {
        const timeLeft = getTimeUntilExpiry();
        setTimeRemaining(Math.ceil(timeLeft / 1000));
        
        if (timeLeft <= 0) {
          handleLogout("Your session has expired due to inactivity.");
        }
      }
    }, 1000);

    // Initial check
    checkSession();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, throttledHandleActivity);
      });
      
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current);
      }
    };
  }, [isAuthenticated, handleActivity, checkSession, showWarning, handleLogout]);

  return {
    showWarning,
    timeRemaining,
    extendSession,
    handleLogout,
  };
}

