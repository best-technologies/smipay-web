"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { SessionWarning } from "@/components/auth/SessionWarning";
import { SessionExpired } from "@/components/auth/SessionExpired";
import { isPaymentInProgress } from "@/lib/auth-storage";
import Sidebar from "./Sidebar";
import SupportFAB from "./SupportFAB";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardAuthGuard({
  children,
  sessionExpired,
}: {
  children: React.ReactNode;
  sessionExpired: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  const isPaymentCallback = searchParams.get("payment") === "callback";

  useEffect(() => {
    if (sessionExpired) return;
    if (isPaymentCallback || isPaymentInProgress()) return;

    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?callbackUrl=/dashboard");
    }
  }, [isLoading, isAuthenticated, router, isPaymentCallback, sessionExpired]);

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

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const {
    showWarning,
    sessionExpired,
    timeRemaining,
    extendSession,
    handleLogout,
    acknowledgeExpiry,
  } = useActivityTracker();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-dashboard-bg">
        <Loader2 className="h-8 w-8 animate-spin text-dashboard-accent" />
      </div>
    }>
      <DashboardAuthGuard sessionExpired={sessionExpired}>
        <div className="flex min-h-screen bg-dashboard-bg">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>

        {!sessionExpired && <SupportFAB />}

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
      </DashboardAuthGuard>
    </Suspense>
  );
}


