"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { SessionWarning } from "@/components/auth/SessionWarning";
import { SessionExpired } from "@/components/auth/SessionExpired";
import AdminSidebar from "./AdminSidebar";
import SupportNotificationBanner from "./SupportNotificationBanner";
import { useAdminSupportGlobalSocket } from "@/hooks/admin/useAdminSupportGlobalSocket";
import { Loader2, Monitor, ArrowLeft } from "lucide-react";

const MIN_VIEWPORT_WIDTH = 1024;

function useViewportGuard() {
  const [isTooSmall, setIsTooSmall] = useState(false);
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    setIsTooSmall(window.innerWidth < MIN_VIEWPORT_WIDTH);
    setChecked(true);
  }, []);

  useEffect(() => {
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [check]);

  return { isTooSmall, checked };
}

function ViewportBlockedScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-dashboard-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-dashboard-surface rounded-2xl border border-dashboard-border shadow-xl p-8 text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-orange-50 flex items-center justify-center">
          <Monitor className="h-8 w-8 text-orange-600" />
        </div>

        <h1 className="text-xl font-bold text-dashboard-heading mb-2">
          Desktop Required
        </h1>

        <p className="text-sm text-dashboard-muted leading-relaxed mb-6">
          The admin dashboard requires a minimum screen width of 1024px to
          ensure a safe and functional management experience. Please access
          this page from a laptop or desktop computer.
        </p>

        <div className="rounded-lg bg-dashboard-bg border border-dashboard-border/60 p-4 mb-6">
          <div className="flex items-center justify-between text-xs text-dashboard-muted mb-1.5">
            <span>Your viewport</span>
            <span className="font-mono font-semibold text-red-600" id="admin-vp-width" />
          </div>
          <div className="h-2 rounded-full bg-dashboard-border/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-300"
              id="admin-vp-bar"
            />
          </div>
          <p className="text-[11px] text-dashboard-muted mt-1.5">
            Minimum required: {MIN_VIEWPORT_WIDTH}px
          </p>
        </div>

        <ViewportBarUpdater />

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-brand-bg-primary hover:bg-brand-bg-primary/90 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </Link>
      </div>
    </div>
  );
}

function ViewportBarUpdater() {
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const pct = Math.min((w / MIN_VIEWPORT_WIDTH) * 100, 100);
      const label = document.getElementById("admin-vp-width");
      const bar = document.getElementById("admin-vp-bar");
      if (label) label.textContent = `${w}px`;
      if (bar) bar.style.width = `${pct}%`;
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return null;
}

function AdminAuthGuard({
  children,
  sessionExpired,
}: {
  children: React.ReactNode;
  sessionExpired: boolean;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (sessionExpired) return;
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/signin?callbackUrl=/unified-admin/dashboard");
      return;
    }

    if (user?.role === "user" || !user?.role) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router, sessionExpired]);

  if (sessionExpired) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dashboard-bg">
        <Loader2 className="h-8 w-8 animate-spin text-dashboard-accent" />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role === "user") {
    return null;
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isTooSmall, checked } = useViewportGuard();
  useAdminSupportGlobalSocket();
  const {
    showWarning,
    sessionExpired,
    timeRemaining,
    extendSession,
    handleLogout,
    acknowledgeExpiry,
  } = useActivityTracker();

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dashboard-bg">
        <Loader2 className="h-8 w-8 animate-spin text-dashboard-accent" />
      </div>
    );
  }

  if (isTooSmall) {
    return <ViewportBlockedScreen />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-dashboard-bg">
          <Loader2 className="h-8 w-8 animate-spin text-dashboard-accent" />
        </div>
      }
    >
      <AdminAuthGuard sessionExpired={sessionExpired}>
        <SupportNotificationBanner />
        <div className="flex min-h-screen bg-dashboard-bg">
          <AdminSidebar />
          <main className="flex-1 overflow-auto admin-content-area">{children}</main>
        </div>

        <SessionWarning
          showWarning={showWarning && !sessionExpired}
          timeRemaining={timeRemaining}
          onExtend={extendSession}
          onLogout={() => handleLogout("You have been logged out.")}
        />

        <SessionExpired
          show={sessionExpired}
          onAcknowledge={acknowledgeExpiry}
        />
      </AdminAuthGuard>
    </Suspense>
  );
}
