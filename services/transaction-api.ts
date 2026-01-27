/**
 * Transaction History API Service
 * Handles transaction-related API calls
 */

import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";
import type { TransactionHistoryResponse, TransactionDetailResponse } from "@/types/transaction";

export const transactionApi = {
  /**
   * Get all transaction history with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   */
  getAllTransactions: async (
    page: number = 1,
    limit: number = 10
  ): Promise<TransactionHistoryResponse> => {
    try {
      const response = await backendApi.get<TransactionHistoryResponse>(
        "/history/fetch-all-history",
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get single transaction by ID
   * @param transactionId - Transaction UUID
   */
  getTransactionById: async (
    transactionId: string
  ): Promise<TransactionDetailResponse> => {
    try {
      const response = await backendApi.get<TransactionDetailResponse>(
        `/history/${transactionId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};

