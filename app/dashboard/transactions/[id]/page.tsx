"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  Copy,
  Check,
  Calendar,
  Hash,
  User,
  Phone,
  Wallet
} from "lucide-react";
import { transactionApi } from "@/services/transaction-api";
import type { TransactionDetail } from "@/types/transaction";
import { getNetworkLogo } from "@/lib/network-logos";

export default function TransactionDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const transactionId = params.id as string;
  const providerFromQuery = (searchParams.get("provider") as string | null) || null;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getTransactionLogo = (tx: TransactionDetail): string | null => {
    const providerKey = (tx.provider || providerFromQuery || "").toLowerCase();

    if (providerKey) {
      const logo = getNetworkLogo(providerKey);
      if (logo) return logo;
    }
    if (tx.icon) return tx.icon;
    return null;
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await transactionApi.getTransactionById(transactionId);
        
        if (response.success && response.data) {
          setTransaction(response.data);
        } else {
          setError("Transaction not found");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-12 w-12 text-green-600" />;
      case "pending":
        return <Clock className="h-12 w-12 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-12 w-12 text-red-600" />;
      case "cancelled":
        return <Ban className="h-12 w-12 text-gray-600" />;
      default:
        return <Clock className="h-12 w-12 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-bg-primary mx-auto mb-4" />
          <p className="text-brand-text-secondary">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error || "Transaction not found"}</p>
              <Button onClick={() => router.push("/dashboard/transactions")}>
                View All Transactions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-brand-text-primary">
            Transaction Details
          </h1>
          <p className="text-sm text-brand-text-secondary mt-1">
            View complete information about this transaction
          </p>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-col items-center text-center">
            {/* Provider / Status Icon */}
            <div className="mb-4">
              {getTransactionLogo(transaction) ? (
                <img 
                  src={getTransactionLogo(transaction) as string} 
                  alt={transaction.description} 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                getStatusIcon(transaction.status)
              )}
            </div>

            {/* Status Badge */}
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border mb-4 ${getStatusColor(transaction.status)}`}>
              {transaction.status.toUpperCase()}
            </span>

            {/* Amount */}
            <p className="text-4xl font-bold text-brand-text-primary mb-2">
              ₦{transaction.amount}
            </p>

            {/* Description */}
            <p className="text-lg text-brand-text-secondary">
              {transaction.description}
            </p>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-brand-text-primary">
              Transaction Information
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Transaction Reference */}
            <div className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-brand-text-secondary mb-1">
                      Transaction Reference
                    </p>
                    <p className="font-mono font-medium text-brand-text-primary break-all">
                      {transaction.tx_reference}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(transaction.tx_reference)}
                  className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy reference"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Transaction Type */}
            <div className="px-6 py-4">
              <div className="flex items-start gap-3">
                <Wallet className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-brand-text-secondary mb-1">
                    Transaction Type
                  </p>
                  <p className="font-medium text-brand-text-primary capitalize">
                    {transaction.type}
                  </p>
                </div>
              </div>
            </div>

            {/* Created Date */}
            <div className="px-6 py-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-brand-text-secondary mb-1">
                    Created On
                  </p>
                  <p className="font-medium text-brand-text-primary">
                    {formatDate(transaction.created_on)}
                  </p>
                </div>
              </div>
            </div>

            {/* Updated Date */}
            {transaction.updated_on && (
              <div className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">
                      Last Updated
                    </p>
                    <p className="font-medium text-brand-text-primary">
                      {formatDate(transaction.updated_on)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sender */}
            {transaction.sender && (
              <div className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">
                      Sender
                    </p>
                    <p className="font-medium text-brand-text-primary">
                      {transaction.sender}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recipient Mobile */}
            {transaction.recipient_mobile && (
              <div className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-brand-text-secondary mb-1">
                      Recipient Phone
                    </p>
                    <p className="font-medium text-brand-text-primary">
                      {transaction.recipient_mobile}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/transactions")}
            className="flex-1"
          >
            View All Transactions
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-brand-bg-primary hover:bg-brand-bg-primary/90"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

