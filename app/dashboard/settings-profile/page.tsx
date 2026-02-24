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
  Loader2,
  Crown,
  Zap,
  Lock,
  ChevronRight,
  TrendingUp,
  Check,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { AvailableTier } from "@/types/user";

function formatNaira(value: number): string {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value.toLocaleString()}`;
}

const TIER_STYLES: Record<string, { gradient: string; badge: string; icon: typeof Crown }> = {
  UNVERIFIED: { gradient: "from-slate-500 to-slate-600", badge: "bg-slate-100 text-slate-700", icon: Shield },
  VERIFIED: { gradient: "from-blue-500 to-blue-700", badge: "bg-blue-50 text-blue-700", icon: CheckCircle },
  PREMIUM: { gradient: "from-amber-500 to-orange-600", badge: "bg-amber-50 text-amber-700", icon: Crown },
};

function getTierStyle(tier: string) {
  return TIER_STYLES[tier] ?? TIER_STYLES.UNVERIFIED;
}

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
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-red-200 max-w-md w-full">
          <p className="text-red-600 text-center text-sm">{error}</p>
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

  const { user, address, kyc_verification, wallet_card, current_tier, available_tiers } = profile;

  const sortedTiers = available_tiers
    ? [...available_tiers].sort((a, b) => a.order - b.order)
    : [];

  const currentTierOrder = sortedTiers.find((t) => t.is_current)?.order ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-3 py-2.5 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="gap-1.5 px-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-brand-text-primary flex items-center gap-1.5 sm:gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
                Profile
              </h1>
              <p className="text-[11px] sm:text-sm text-brand-text-secondary mt-0.5">
                View and manage your account information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100 mb-4 sm:mb-6">
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:items-start md:gap-8">
            {user.profile_image ? (
              <div className="relative h-18 w-18 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                <Image
                  src={user.profile_image}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 72px, (max-width: 768px) 96px, 128px"
                />
              </div>
            ) : (
              <div className="h-18 w-18 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-bg-primary to-indigo-700 text-white flex items-center justify-center text-xl sm:text-2xl md:text-4xl font-bold flex-shrink-0 shadow-lg">
                {user.first_name[0]}{user.last_name[0]}
              </div>
            )}
            <div className="flex-1 text-center md:text-left min-w-0 w-full">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-brand-text-primary mb-0.5 sm:mb-1 truncate">
                {user.name}
              </h2>
              <p className="text-xs sm:text-base text-brand-text-secondary mb-2 sm:mb-3 truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-green-50 text-green-700">
                  Since {new Date(user.joined).getFullYear()}
                </span>
                {user.is_verified && (
                  <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50 text-blue-700 flex items-center gap-1 sm:gap-1.5">
                    <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Verified
                  </span>
                )}
                {current_tier && (
                  <span className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 ${getTierStyle(current_tier.tier).badge}`}>
                    {(() => { const TIcon = getTierStyle(current_tier.tier).icon; return <TIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />; })()}
                    {current_tier.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Tier & Limits */}
        {current_tier && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 mb-4 sm:mb-6 overflow-hidden">
            <div className={`bg-gradient-to-r ${getTierStyle(current_tier.tier).gradient} px-3.5 py-3 sm:px-6 sm:py-4 text-white`}>
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl flex-shrink-0">
                    {(() => { const TIcon = getTierStyle(current_tier.tier).icon; return <TIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />; })()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-lg font-bold truncate">{current_tier.name}</h3>
                    <p className="text-[11px] sm:text-sm text-white/80 line-clamp-2">{current_tier.description}</p>
                  </div>
                </div>
                {current_tier.is_active && (
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/20 whitespace-nowrap flex-shrink-0">
                    Active
                  </span>
                )}
              </div>
            </div>
            <div className="p-3.5 sm:p-5 md:p-6">
              <h4 className="text-[10px] sm:text-sm font-semibold text-brand-text-secondary uppercase tracking-wider mb-3 sm:mb-4">
                Transaction Limits
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <LimitCard label="Per Transaction" value={current_tier.limits.singleTransaction} />
                <LimitCard label="Daily Limit" value={current_tier.limits.daily} />
                <LimitCard label="Monthly Limit" value={current_tier.limits.monthly} />
                <LimitCard label="Airtime Daily" value={current_tier.limits.airtimeDaily} />
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Personal Info + Address */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
            <div className="px-4 py-3 sm:p-5 md:p-6 border-b border-gray-100">
              <h3 className="text-sm sm:text-lg font-bold text-brand-text-primary">
                Personal Information
              </h3>
            </div>
            <div className="p-3 sm:p-5 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                <InfoField icon={User} iconBg="bg-blue-100" iconColor="text-blue-600" label="Full Name" value={user.name} />
                <InfoField icon={Mail} iconBg="bg-green-100" iconColor="text-green-600" label="Email Address" value={user.email} breakAll />
                <InfoField icon={Phone} iconBg="bg-purple-100" iconColor="text-purple-600" label="Phone Number" value={user.phone_number} />
                <InfoField icon={User} iconBg="bg-pink-100" iconColor="text-pink-600" label="Gender" value={user.gender} capitalize />
                <div className="sm:col-span-2">
                  <InfoField
                    icon={Calendar}
                    iconBg="bg-orange-100"
                    iconColor="text-orange-600"
                    label="Date of Birth"
                    value={
                      user.date_of_birth
                        ? new Date(user.date_of_birth).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not set"
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
            <div className="px-4 py-3 sm:p-5 md:p-6 border-b border-gray-100">
              <h3 className="text-sm sm:text-lg font-bold text-brand-text-primary">
                Address
              </h3>
            </div>
            <div className="p-3 sm:p-5 md:p-6 space-y-3">
              {address ? (
                <>
                  <AddressRow icon={MapPin} color="text-indigo-600" label="Street Address" value={address.house_address} />
                  <AddressRow icon={MapPin} color="text-teal-600" label="City" value={address.city} />
                  <AddressRow icon={MapPin} color="text-cyan-600" label="State" value={address.state} />
                  <AddressRow icon={MapPin} color="text-lime-600" label="Country" value={address.country} />
                  <AddressRow icon={CreditCard} color="text-amber-600" label="Postal Code" value={address.postal_code} />
                </>
              ) : (
                <p className="text-xs sm:text-sm text-brand-text-secondary py-4 text-center">
                  No address on file
                </p>
              )}
            </div>
          </div>
        </div>

        {/* KYC & Wallet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* KYC Verification */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
            <div className="px-4 py-3 sm:p-5 md:p-6 border-b border-gray-100">
              <h3 className="text-sm sm:text-lg font-bold text-brand-text-primary">
                KYC Verification
              </h3>
            </div>
            <div className="p-3 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-sm text-brand-text-secondary">Status</p>
                    <p className="font-bold text-brand-text-primary capitalize text-sm sm:text-base">
                      {kyc_verification.status}
                    </p>
                  </div>
                </div>
                {kyc_verification.is_active ? (
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 flex-shrink-0" />
                )}
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-sm text-brand-text-secondary">ID Type</p>
                  <p className="font-semibold text-brand-text-primary text-xs sm:text-sm md:text-base truncate">
                    {kyc_verification.id_type.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-sm text-brand-text-secondary">ID Number</p>
                  <p className="font-semibold text-brand-text-primary font-mono text-xs sm:text-sm md:text-base truncate">
                    {kyc_verification.id_number}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Card */}
          <div className="bg-gradient-to-br from-brand-bg-primary to-indigo-700 rounded-xl sm:rounded-2xl shadow-lg text-white overflow-hidden">
            <div className="px-4 py-3 sm:p-5 md:p-6 border-b border-white/20">
              <h3 className="text-sm sm:text-lg font-bold flex items-center gap-2">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                Wallet Summary
              </h3>
            </div>
            <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
              <div>
                <p className="text-blue-100 text-[11px] sm:text-sm mb-1">Current Balance</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {wallet_card.current_balance}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                <div className="bg-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
                  <p className="text-blue-100 text-[10px] sm:text-xs mb-0.5 sm:mb-1">All Time Funding</p>
                  <p className="font-bold text-xs sm:text-sm md:text-base">
                    {wallet_card.all_time_fuunding}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
                  <p className="text-blue-100 text-[10px] sm:text-xs mb-0.5 sm:mb-1">All Time Withdrawn</p>
                  <p className="font-bold text-xs sm:text-sm md:text-base">
                    {wallet_card.all_time_withdrawn}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/20">
                <span className="text-blue-100 text-xs sm:text-sm">Wallet Status</span>
                <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-semibold ${
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

        {/* Account Tiers */}
        {sortedTiers.length > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 mb-4 sm:mb-6">
            <div className="px-4 py-3 sm:p-5 md:p-6 border-b border-gray-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-brand-bg-primary flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-lg font-bold text-brand-text-primary">
                    Account Tiers
                  </h3>
                  <p className="text-[11px] sm:text-sm text-brand-text-secondary mt-0.5">
                    Your upgrade path &amp; transaction limits
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-5 md:p-6">
              <div className="space-y-3 sm:space-y-4">
                {sortedTiers.map((tier, idx) => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    currentTierOrder={currentTierOrder}
                    isLast={idx === sortedTiers.length - 1}
                    kycStatus={kyc_verification.status}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Account Stats */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <div className="px-4 py-3 sm:p-5 md:p-6 border-b border-gray-100">
            <h3 className="text-sm sm:text-lg font-bold text-brand-text-primary">
              Account Statistics
            </h3>
          </div>
          <div className="p-3 sm:p-5 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
              <StatCard
                label="Total Cards"
                value={String(user.totalCards)}
                bg="bg-blue-50"
                color="text-brand-bg-primary"
              />
              <StatCard
                label="Total Accounts"
                value={String(user.totalAccounts)}
                bg="bg-green-50"
                color="text-green-600"
              />
              <StatCard
                label="Wallet Balance"
                value={`₦${user.wallet_balance >= 1000 ? `${(user.wallet_balance / 1000).toFixed(1)}K` : user.wallet_balance.toLocaleString()}`}
                bg="bg-purple-50"
                color="text-purple-600"
              />
              <StatCard
                label="Joined Year"
                value={String(new Date(user.joined).getFullYear())}
                bg="bg-orange-50"
                color="text-orange-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function InfoField({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  breakAll,
  capitalize: cap,
}: {
  icon: typeof User;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  breakAll?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-2.5 sm:p-3.5 bg-gray-50 rounded-lg sm:rounded-xl">
      <div className={`p-1.5 sm:p-2.5 ${iconBg} rounded-lg sm:rounded-xl flex-shrink-0`}>
        <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs text-brand-text-secondary mb-0.5">{label}</p>
        <p className={`font-semibold text-brand-text-primary text-xs sm:text-sm md:text-base ${breakAll ? "break-all" : "truncate"} ${cap ? "capitalize" : ""}`}>
          {value || "Not set"}
        </p>
      </div>
    </div>
  );
}

function AddressRow({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof MapPin;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3">
      <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${color} mt-0.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs text-brand-text-secondary mb-0.5">{label}</p>
        <p className="font-semibold text-brand-text-primary text-xs sm:text-sm md:text-base truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function LimitCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 text-center">
      <p className="text-sm sm:text-lg md:text-xl font-bold text-brand-text-primary mb-0.5">
        {formatNaira(value)}
      </p>
      <p className="text-[10px] sm:text-xs text-brand-text-secondary font-medium leading-tight">
        {label}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  bg,
  color,
}: {
  label: string;
  value: string;
  bg: string;
  color: string;
}) {
  return (
    <div className={`text-center p-3 sm:p-4 md:p-6 ${bg} rounded-lg sm:rounded-xl`}>
      <p className={`text-lg sm:text-2xl md:text-3xl font-bold ${color} mb-1`}>
        {value}
      </p>
      <p className="text-[11px] sm:text-sm font-medium text-brand-text-secondary leading-tight">
        {label}
      </p>
    </div>
  );
}

function TierCard({
  tier,
  currentTierOrder,
  isLast,
  kycStatus,
}: {
  tier: AvailableTier;
  currentTierOrder: number;
  isLast: boolean;
  kycStatus: string;
}) {
  const style = getTierStyle(tier.tier);
  const Icon = style.icon;
  const isCurrent = tier.is_current;
  const isCompleted = tier.order < currentTierOrder;
  const isNext = tier.order === currentTierOrder + 1;
  const isLocked = tier.order > currentTierOrder + 1;

  const kycApproved = kycStatus === "approved";

  const requirementMet = (req: string): boolean => {
    const lower = req.toLowerCase();
    if (lower.includes("phone")) return true;
    if (lower.includes("email")) return true;
    if (lower.includes("kyc") || lower.includes("bvn") || lower.includes("nin")) return kycApproved;
    if (lower.includes("face")) return kycApproved;
    if (lower.includes("address")) return kycApproved;
    return false;
  };

  return (
    <div className="relative">
      <div
        className={`rounded-lg sm:rounded-xl border-2 overflow-hidden transition-all ${
          isCurrent
            ? "border-brand-bg-primary shadow-md"
            : isCompleted
              ? "border-green-300 bg-green-50/30"
              : isLocked
                ? "border-gray-200 opacity-70"
                : "border-gray-200"
        }`}
      >
        {/* Tier header */}
        <div className={`px-3 py-2.5 sm:px-5 sm:py-3.5 ${
          isCurrent ? `bg-gradient-to-r ${style.gradient} text-white` : "bg-white"
        }`}>
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 mt-0.5 ${
              isCurrent ? "bg-white/20" : isCompleted ? "bg-green-100" : "bg-gray-100"
            }`}>
              {isLocked ? (
                <Lock className={`h-4 w-4 sm:h-5 sm:w-5 ${isCurrent ? "text-white" : "text-gray-400"}`} />
              ) : isCompleted ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              ) : (
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isCurrent ? "text-white" : "text-brand-text-primary"}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h4 className={`font-bold text-xs sm:text-sm md:text-base ${isCurrent ? "text-white" : "text-brand-text-primary"}`}>
                  {tier.name}
                </h4>
                {isCurrent && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/25">
                    Current
                  </span>
                )}
                {isCompleted && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-green-100 text-green-700">
                    Completed
                  </span>
                )}
              </div>
              <p className={`text-[11px] sm:text-xs md:text-sm mt-0.5 line-clamp-2 ${isCurrent ? "text-white/80" : "text-brand-text-secondary"}`}>
                {tier.description}
              </p>
              <div className={`flex items-center gap-2 sm:gap-3 mt-1.5 ${isCurrent ? "text-white/90" : "text-brand-text-secondary"}`}>
                <span className="text-[10px] sm:text-xs font-medium">{formatNaira(tier.limits.singleTransaction)}/tx</span>
                <span className="text-[10px] sm:text-xs">{formatNaira(tier.limits.daily)}/day</span>
                <span className="text-[10px] sm:text-xs hidden sm:inline">{formatNaira(tier.limits.monthly)}/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        {(isNext || (isCurrent && tier.requirements.length > 0)) && (
          <div className="px-3 py-2.5 sm:px-5 sm:py-3.5 bg-gray-50/80 border-t border-gray-100">
            <p className="text-[9px] sm:text-[10px] font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5 sm:mb-2">
              Requirements
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5">
              {tier.requirements.map((req) => {
                const met = isCurrent || isCompleted || requirementMet(req);
                return (
                  <div key={req} className="flex items-center gap-1.5 sm:gap-2">
                    {met ? (
                      <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600 flex-shrink-0" />
                    ) : (
                      <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-[11px] sm:text-xs ${met ? "text-brand-text-primary" : "text-brand-text-secondary"}`}>
                      {req}
                    </span>
                  </div>
                );
              })}
            </div>
            {isNext && !isCurrent && (
              <button
                type="button"
                className="mt-2.5 sm:mt-3 inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-white bg-brand-bg-primary hover:bg-brand-bg-primary/90 rounded-lg transition-colors"
              >
                <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Start Upgrade
                <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Locked footer */}
        {isLocked && (
          <div className="px-3 py-2 sm:px-5 sm:py-3 bg-gray-50/50 border-t border-gray-100 flex items-center gap-1.5 sm:gap-2">
            <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs text-brand-text-secondary">
              Complete previous tier to unlock
            </span>
          </div>
        )}
      </div>

      {!isLast && (
        <div className="flex justify-center py-0.5 sm:py-1">
          <div className="w-0.5 h-3 sm:h-4 bg-gray-200" />
        </div>
      )}
    </div>
  );
}
