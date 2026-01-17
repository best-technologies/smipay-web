/**
 * Wallet API Service
 * Handles wallet-related API calls with proper error handling
 */

import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";

export const walletApi = {
  /**
   * Get wallet balance and details
   */
  getWallet: async () => {
    try {
      const response = await backendApi.get("/wallet");
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Fund wallet
   * @param amount - Amount to fund
   * @param paymentMethod - Payment method (card, transfer, etc.)
   */
  fundWallet: async (amount: number, paymentMethod: string) => {
    try {
      const response = await backendApi.post("/wallet/fund", {
        amount,
        paymentMethod,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Withdraw from wallet
   * @param amount - Amount to withdraw
   * @param bankDetails - Bank account details
   */
  withdrawFromWallet: async (
    amount: number,
    bankDetails: {
      accountNumber: string;
      bankCode: string;
    }
  ) => {
    try {
      const response = await backendApi.post("/wallet/withdraw", {
        amount,
        ...bankDetails,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get wallet transaction history
   * @param page - Page number
   * @param limit - Items per page
   */
  getTransactions: async (page: number = 1, limit: number = 20) => {
    try {
      const response = await backendApi.get("/wallet/transactions", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get single transaction details
   * @param transactionId - Transaction ID
   */
  getTransactionById: async (transactionId: string) => {
    try {
      const response = await backendApi.get(`/wallet/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};
