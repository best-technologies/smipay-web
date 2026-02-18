"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";
import { transactionApi } from "@/services/transaction-api";
import type { Transaction, PaginationMeta } from "@/types/transaction";

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await transactionApi.getAllTransactions(currentPage, itemsPerPage);
        
        if (response.success) {
          setTransactions(response.data.transactions);
          setPagination(response.data.pagination);
        } else {
          setError("Failed to load transactions");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "failed":
        return "bg-red-50 text-red-700";
      case "cancelled":
        return "bg-gray-50 text-gray-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-text-primary">
                Transaction History
              </h1>
              <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
                View all your transactions
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Summary */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-brand-text-secondary mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-brand-text-primary">
                {pagination.totalItems}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-brand-text-secondary mb-1">Current Page</p>
              <p className="text-2xl font-bold text-brand-text-primary">
                {pagination.currentPage} of {pagination.totalPages}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-brand-text-secondary mb-1">Items Per Page</p>
              <p className="text-2xl font-bold text-brand-text-primary">
                {itemsPerPage}
              </p>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-brand-bg-primary mx-auto mb-4" />
                <p className="text-brand-text-secondary">Loading transactions...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-brand-text-secondary">No transactions found</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table Header - Desktop */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold text-sm text-brand-text-secondary">
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Status</div>
              </div>

              {/* Transactions */}
              <div className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-3 sm:p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {transaction.icon ? (
                            <img
                              src={transaction.icon}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div
                              className={`p-2 rounded-lg ${
                                transaction.credit_debit === "credit"
                                  ? "bg-green-50"
                                  : "bg-red-50"
                              }`}
                            >
                              {transaction.credit_debit === "credit" ? (
                                <ArrowDownLeft className="h-5 w-5 text-green-600" />
                              ) : (
                                <ArrowUpRight className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-brand-text-primary text-xs sm:text-sm">
                              {transaction.description}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-secondary">
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                        <p
                          className={`font-semibold ${
                            transaction.credit_debit === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.credit_debit === "credit" ? "+" : "-"}₦{transaction.amount}
                        </p>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-4 flex items-center gap-3">
                        {transaction.icon ? (
                          <img
                            src={transaction.icon}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div
                            className={`p-2 rounded-lg ${
                              transaction.credit_debit === "credit"
                                ? "bg-green-50"
                                : "bg-red-50"
                            }`}
                          >
                            {transaction.credit_debit === "credit" ? (
                              <ArrowDownLeft className="h-5 w-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-brand-text-primary">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-brand-text-secondary">
                            {transaction.reference}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm capitalize text-brand-text-primary">
                          {transaction.type}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <p
                          className={`font-semibold ${
                            transaction.credit_debit === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.credit_debit === "credit" ? "+" : "-"}₦{transaction.amount}
                        </p>
                      </div>
                      <div className="col-span-2 text-sm text-brand-text-secondary">
                        {formatDate(transaction.date)}
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-brand-text-secondary">
                      Showing page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      {/* Page Numbers */}
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className={
                                currentPage === pageNum
                                  ? "bg-brand-bg-primary"
                                  : ""
                              }
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

