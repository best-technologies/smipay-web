"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, ArrowLeft } from "lucide-react";

const NETWORKS = [
  { id: "mtn", name: "MTN", color: "bg-yellow-500", logo: "📱" },
  { id: "glo", name: "GLO", color: "bg-green-500", logo: "📱" },
  { id: "airtel", name: "AIRTEL", color: "bg-red-500", logo: "📱" },
  { id: "9mobile", name: "9MOBILE", color: "bg-emerald-600", logo: "📱" },
];

export default function BuyAirtimePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle airtime purchase logic here
    console.log({ selectedNetwork, phoneNumber, amount });
  };

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
                <Smartphone className="h-6 w-6" />
                Buy Airtime
              </h1>
              <p className="text-sm text-brand-text-secondary mt-1">
                Purchase airtime for any network
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-br from-brand-bg-primary to-indigo-700 rounded-xl shadow-lg p-6 text-white mb-6">
            <p className="text-sm text-blue-100 mb-1">Available Balance</p>
            <p className="text-3xl font-bold">
              ₦{user?.wallet?.current_balance?.toLocaleString() || "0.00"}
            </p>
          </div>

          {/* Purchase Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Network Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Select Network
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {NETWORKS.map((network) => (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => setSelectedNetwork(network.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedNetwork === network.id
                          ? "border-brand-bg-primary bg-brand-bg-primary/5 shadow-md"
                          : "border-gray-200 hover:border-brand-bg-primary/50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{network.logo}</div>
                      <p className="font-semibold text-sm">{network.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber" className="text-base font-semibold">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="08012345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 h-12"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount" className="text-base font-semibold">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-2 h-12"
                  min="50"
                  step="50"
                  required
                />
                <div className="flex gap-2 mt-3">
                  {[100, 200, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-brand-bg-primary hover:bg-brand-bg-primary/5 transition-colors"
                    >
                      ₦{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-brand-bg-primary hover:bg-brand-bg-primary/90 text-lg"
                disabled={!selectedNetwork || !phoneNumber || !amount}
              >
                Purchase Airtime
              </Button>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Airtime will be delivered instantly to the phone number provided. Make sure the number is correct before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


