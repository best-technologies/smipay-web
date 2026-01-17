"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin-new?callbackUrl=/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-bg-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-brand-text-primary">
              Dashboard
            </h1>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-brand-text-primary mb-4">
            Welcome back, {user.first_name}! 👋
          </h2>
          <p className="text-brand-text-secondary">
            You have successfully signed in to your Smipay account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              Account Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-brand-text-secondary">Name:</span>{" "}
                {user.first_name} {user.last_name}
              </p>
              <p>
                <span className="text-brand-text-secondary">Email:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="text-brand-text-secondary">Phone:</span>{" "}
                {user.phone_number}
              </p>
              <p>
                <span className="text-brand-text-secondary">Smipay Tag:</span>{" "}
                {user.smipay_tag}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              Verification Status
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-brand-text-secondary">Email:</span>{" "}
                <span
                  className={
                    user.is_email_verified ? "text-green-600" : "text-orange-600"
                  }
                >
                  {user.is_email_verified ? "Verified ✓" : "Not Verified"}
                </span>
              </p>
              <p>
                <span className="text-brand-text-secondary">Phone:</span>{" "}
                <span
                  className={
                    user.is_phone_verified ? "text-green-600" : "text-orange-600"
                  }
                >
                  {user.is_phone_verified ? "Verified ✓" : "Not Verified"}
                </span>
              </p>
              <p>
                <span className="text-brand-text-secondary">Account:</span>{" "}
                <span
                  className={
                    user.account_status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {user.account_status === "active" ? "Active ✓" : "Inactive"}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              Wallet
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-brand-text-secondary">Balance:</span>{" "}
                ₦{user.wallet?.current_balance?.toLocaleString() || "0"}
              </p>
              <p>
                <span className="text-brand-text-secondary">Status:</span>{" "}
                <span
                  className={
                    user.wallet?.isActive ? "text-green-600" : "text-red-600"
                  }
                >
                  {user.wallet?.isActive ? "Active ✓" : "Inactive"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

