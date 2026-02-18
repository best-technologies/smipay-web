"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  MapPin,
  Shield,
  Wallet,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { profile, isLoading, error } = useUserProfile();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-bg-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200 max-w-md w-full">
          <p className="text-red-600 text-center">{error}</p>
          <Button 
            onClick={() => router.push("/dashboard")} 
            className="w-full mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const { user, address, kyc_verification, wallet_card } = profile;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
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
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-text-primary flex items-center gap-2">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
                Profile
              </h1>
              <p className="text-xs sm:text-sm text-brand-text-secondary mt-0.5 sm:mt-1">
                View and manage your account information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {user.profile_image ? (
              <div className="relative h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                <Image
                  src={user.profile_image}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            ) : (
              <div className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-2xl bg-gradient-to-br from-brand-bg-primary to-indigo-700 text-white flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold flex-shrink-0 shadow-lg">
                {user.first_name[0]}{user.last_name[0]}
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-text-primary mb-1 sm:mb-2">
                {user.name}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-brand-text-secondary mb-2 sm:mb-4">
                {user.email}
              </p>
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <span className="px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-green-50 text-green-700">
                  Member since {new Date(user.joined).getFullYear()}
                </span>
                {user.is_verified && (
                  <span className="px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Verified Account
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-text-primary">
                Personal Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">Full Name</p>
                    <p className="font-semibold text-brand-text-primary text-sm sm:text-base md:text-lg">
                      {user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">Email Address</p>
                    <p className="font-semibold text-brand-text-primary break-all text-sm sm:text-base md:text-lg">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">Phone Number</p>
                    <p className="font-semibold text-brand-text-primary text-sm sm:text-base md:text-lg">
                      {user.phone_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 sm:p-3 bg-pink-100 rounded-xl">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">Gender</p>
                    <p className="font-semibold text-brand-text-primary capitalize text-sm sm:text-base md:text-lg">
                      {user.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl md:col-span-2">
                  <div className="p-2 sm:p-3 bg-orange-100 rounded-xl">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">Date of Birth</p>
                    <p className="font-semibold text-brand-text-primary text-sm sm:text-base md:text-lg">
                      {new Date(user.date_of_birth).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information - Sidebar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-text-primary">
                Address
              </h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">Street Address</p>
                  <p className="font-semibold text-brand-text-primary text-sm sm:text-base md:text-lg">
                    {address.house_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">City</p>
                  <p className="font-semibold text-brand-text-primary text-sm sm:text-base md:text-lg">
                    {address.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">State</p>
                  <p className="font-semibold text-brand-text-primary text-sm sm:text-base md:text-lg">
                    {address.state}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-lime-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">Country</p>
                  <p className="font-semibold text-brand-text-primary text-sm sm:text-base md:text-lg">
                    {address.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-brand-text-secondary mb-1">Postal Code</p>
                  <p className="font-semibold text-brand-text-primary text-sm sm:text-base md:text-lg">
                    {address.postal_code}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KYC & Wallet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          {/* KYC Verification */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-text-primary">
                KYC Verification
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">Status</p>
                    <p className="font-bold text-brand-text-primary capitalize text-sm sm:text-base md:text-lg">
                      {kyc_verification.status}
                    </p>
                  </div>
                </div>
                {kyc_verification.is_active ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-brand-text-secondary mb-1">ID Type</p>
                  <p className="font-semibold text-brand-text-primary">
                    {kyc_verification.id_type.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-brand-text-secondary mb-1">ID Number</p>
                  <p className="font-semibold text-brand-text-primary font-mono text-sm sm:text-base md:text-lg">
                    {kyc_verification.id_number}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Card */}
          <div className="bg-gradient-to-br from-brand-bg-primary to-indigo-700 rounded-2xl shadow-lg text-white overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
                <Wallet className="h-6 w-6" />
                Wallet Summary
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-blue-100 text-sm mb-2">Current Balance</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  ₦{wallet_card.current_balance}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-blue-100 text-xs mb-1">All Time Funding</p>
                  <p className="font-bold text-sm sm:text-base md:text-lg">
                    ₦{wallet_card.all_time_fuunding}
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-blue-100 text-xs mb-1">All Time Withdrawn</p>
                  <p className="font-bold text-sm sm:text-base md:text-lg">
                    ₦{wallet_card.all_time_withdrawn}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-blue-100 text-sm">Wallet Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  wallet_card.isActive 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white"
                }`}>
                  {wallet_card.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-text-primary">
              Account Statistics
            </h3>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
              <div className="text-center p-3 sm:p-4 md:p-6 bg-blue-50 rounded-xl">
                <p className="text-xl sm:text-2xl md:text-4xl font-bold text-brand-bg-primary mb-2">
                  {user.totalCards}
                </p>
                <p className="text-sm font-medium text-brand-text-secondary">
                  Total Cards
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 md:p-6 bg-green-50 rounded-xl">
                <p className="text-xl sm:text-2xl md:text-4xl font-bold text-green-600 mb-2">
                  {user.totalAccounts}
                </p>
                <p className="text-sm font-medium text-brand-text-secondary">
                  Total Accounts
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 md:p-6 bg-purple-50 rounded-xl">
                <p className="text-xl sm:text-2xl md:text-4xl font-bold text-purple-600 mb-2">
                  ₦{(user.wallet_balance / 1000).toFixed(1)}K
                </p>
                <p className="text-sm font-medium text-brand-text-secondary">
                  Wallet Balance
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 md:p-6 bg-orange-50 rounded-xl">
                <p className="text-xl sm:text-2xl md:text-4xl font-bold text-orange-600 mb-2">
                  {new Date(user.joined).getFullYear()}
                </p>
                <p className="text-sm font-medium text-brand-text-secondary">
                  Joined Year
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
