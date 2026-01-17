"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, CreditCard, Calendar, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
                <User className="h-6 w-6" />
                Profile
              </h1>
              <p className="text-sm text-brand-text-secondary mt-1">
                View and manage your account information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand-bg-primary to-indigo-700 text-white flex items-center justify-center text-3xl font-bold">
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-brand-text-primary">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-brand-text-secondary mt-1">
                  @{user.smipay_tag}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.account_status === "active" 
                      ? "bg-green-50 text-green-700" 
                      : "bg-red-50 text-red-700"
                  }`}>
                    {user.account_status === "active" ? "Active Account" : "Inactive Account"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-brand-text-primary">
                Personal Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-brand-text-secondary">Full Name</p>
                  <p className="font-semibold text-brand-text-primary">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Email Address</p>
                      <p className="font-semibold text-brand-text-primary">{user.email}</p>
                    </div>
                    {user.is_email_verified ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-600 text-sm">
                        <XCircle className="h-4 w-4" />
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-brand-text-secondary">Phone Number</p>
                      <p className="font-semibold text-brand-text-primary">{user.phone_number}</p>
                    </div>
                    {user.is_phone_verified ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-600 text-sm">
                        <XCircle className="h-4 w-4" />
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-brand-text-secondary">Smipay Tag</p>
                  <p className="font-semibold text-brand-text-primary font-mono">
                    @{user.smipay_tag}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Information */}
          {user.wallet && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-brand-text-primary">
                  Wallet Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-secondary">Current Balance</p>
                    <p className="text-2xl font-bold text-brand-text-primary">
                      ₦{user.wallet.current_balance.toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.wallet.isActive 
                      ? "bg-green-50 text-green-700" 
                      : "bg-red-50 text-red-700"
                  }`}>
                    {user.wallet.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Need to update your information?</strong> Contact support or use the Update Profile section (coming soon).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

