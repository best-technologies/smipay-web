"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { SessionWarning } from "@/components/auth/SessionWarning";
import Sidebar from "./Sidebar";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { showWarning, timeRemaining, extendSession, handleLogout } = useActivityTracker();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?callbackUrl=/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-bg-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Session Warning Modal */}
      <SessionWarning
        showWarning={showWarning}
        timeRemaining={timeRemaining}
        onExtend={extendSession}
        onLogout={() => handleLogout("You have been logged out.")}
      />
    </>
  );
}


