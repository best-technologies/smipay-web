"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, CreditCard, Zap, Smartphone, Tv, FileText, Users, ChevronRight, Copy, Check } from "lucide-react";

// Mock data - will be replaced with API data
const MOCK_DASHBOARD_DATA = {
  virtualAccount: {
    accountNumber: "6027817037",
    accountName: "SMIPAY-JOHN-DOE",
    bankName: "MONIEPOINT MICROFINANCE BANK",
    balance: 157.98,
    status: "ACTIVE"
  },
  stats: {
    walletBalance: 157.98,
    totalSpent: 33531.01,
    totalFunding: 33688.98,
    transactionCount: 51,
    referrals: 0
  },
  recentTransactions: [
    { id: 1, description: "MTN Airtime Purchase", amount: -500, type: "debit", date: "2026-01-17 10:30 AM", status: "success" },
    { id: 2, description: "Wallet Funding", amount: 5000, type: "credit", date: "2026-01-17 09:15 AM", status: "success" },
    { id: 3, description: "DSTV Subscription", amount: -4200, type: "debit", date: "2026-01-16 08:45 PM", status: "success" },
    { id: 4, description: "Electricity Bill", amount: -2800, type: "debit", date: "2026-01-16 02:20 PM", status: "success" },
  ]
};

const QUICK_ACTIONS = [
  { id: "airtime", name: "Buy Airtime", icon: Smartphone, color: "bg-blue-500", href: "/airtime" },
  { id: "data", name: "Buy Data", icon: Zap, color: "bg-purple-500", href: "/data" },
  { id: "cable", name: "Cable TV", icon: Tv, color: "bg-orange-500", href: "/cable" },
  { id: "electricity", name: "Electricity", icon: Zap, color: "bg-green-500", href: "/electricity" },
  { id: "transfer", name: "Transfer", icon: ArrowUpRight, color: "bg-indigo-500", href: "/transfer" },
  { id: "transactions", name: "Transactions", icon: FileText, color: "bg-pink-500", href: "/transactions" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(MOCK_DASHBOARD_DATA.virtualAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-text-primary">
                Dashboard
              </h1>
              <p className="text-sm text-brand-text-secondary mt-1">
                Welcome back, {user.first_name}! 👋
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-brand-bg-primary hover:bg-brand-bg-primary/90"
                onClick={() => router.push("/fund-wallet")}
              >
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Fund Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Wallet Balance */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-brand-text-secondary mb-1">Wallet Balance</p>
            <p className="text-2xl font-bold text-brand-text-primary">
              ₦{MOCK_DASHBOARD_DATA.stats.walletBalance.toLocaleString()}
            </p>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-brand-text-secondary mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-brand-text-primary">
              ₦{MOCK_DASHBOARD_DATA.stats.totalSpent.toLocaleString()}
            </p>
          </div>

          {/* Total Funding */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-brand-text-secondary mb-1">Total Funding</p>
            <p className="text-2xl font-bold text-brand-text-primary">
              ₦{MOCK_DASHBOARD_DATA.stats.totalFunding.toLocaleString()}
            </p>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-brand-text-secondary mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-brand-text-primary">
              {MOCK_DASHBOARD_DATA.stats.transactionCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Virtual Account Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-brand-bg-primary to-indigo-700 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Virtual Account</p>
                  <p className="text-2xl font-bold">{MOCK_DASHBOARD_DATA.virtualAccount.bankName}</p>
                </div>
                <div className="px-3 py-1 bg-green-500 rounded-full text-xs font-semibold">
                  {MOCK_DASHBOARD_DATA.virtualAccount.status}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Account Number</p>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-mono font-bold tracking-wider">
                      {MOCK_DASHBOARD_DATA.virtualAccount.accountNumber}
                    </p>
                    <button
                      onClick={copyAccountNumber}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Copy account number"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-300" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-blue-100 text-sm mb-1">Account Name</p>
                  <p className="text-xl font-semibold">
                    {MOCK_DASHBOARD_DATA.virtualAccount.accountName}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Current Balance</p>
                    <p className="text-3xl font-bold">
                      ₦{MOCK_DASHBOARD_DATA.virtualAccount.balance.toLocaleString()}
                    </p>
                  </div>
                  <CreditCard className="h-12 w-12 text-white/30" />
                </div>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-brand-bg-primary text-white flex items-center justify-center text-2xl font-bold">
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <div>
                <p className="font-semibold text-brand-text-primary text-lg">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-brand-text-secondary">
                  @{user.smipay_tag}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-brand-text-secondary">Email</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.is_email_verified 
                    ? "bg-green-50 text-green-700" 
                    : "bg-orange-50 text-orange-700"
                }`}>
                  {user.is_email_verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-brand-text-secondary">Phone</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.is_phone_verified 
                    ? "bg-green-50 text-green-700" 
                    : "bg-orange-50 text-orange-700"
                }`}>
                  {user.is_phone_verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-brand-text-secondary">Account</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.account_status === "active" 
                    ? "bg-green-50 text-green-700" 
                    : "bg-red-50 text-red-700"
                }`}>
                  {user.account_status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-text-primary">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => router.push(action.href)}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-brand-text-primary text-left">
                  {action.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-text-primary">
                Recent Transactions
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/transactions")}
                className="text-brand-bg-primary hover:text-brand-bg-primary/80"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_DASHBOARD_DATA.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === "credit" 
                        ? "bg-green-50" 
                        : "bg-red-50"
                    }`}>
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-brand-text-primary">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-brand-text-secondary">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === "credit" 
                        ? "text-green-600" 
                        : "text-red-600"
                    }`}>
                      {transaction.type === "credit" ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
