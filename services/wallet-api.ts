/**
 * Wallet API Service
 * Handles all wallet-related API calls
 */

import { backendApi } from "@/lib/api-client-backend";

export const walletApi = {
  /**
   * Get wallet balance
   */
  getBalance: async () => {
    const response = await backendApi.get("/wallet/balance");
    return response.data;
  },

  /**
   * Fund wallet
   * @param amount - Amount to fund
   * @param paymentMethod - Payment method
   */
  fundWallet: async (amount: number, paymentMethod: string) => {
    const response = await backendApi.post("/wallet/fund", {
      amount,
      paymentMethod,
    });
    return response.data;
  },

  /**
   * Withdraw from wallet
   * @param amount - Amount to withdraw
   * @param bankDetails - Bank account details
   */
  withdraw: async (
    amount: number,
    bankDetails: {
      bank_code: string;
      account_number: string;
      account_name: string;
    }
  ) => {
    const response = await backendApi.post("/wallet/withdraw", {
      amount,
      ...bankDetails,
    });
    return response.data;
  },

  /**
   * Get wallet transactions
   * @param params - Query parameters (page, limit, type, etc.)
   */
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await backendApi.get("/wallet/transactions", { params });
    return response.data;
  },

  /**
   * Get single transaction
   * @param transactionId - Transaction ID
   */
  getTransaction: async (transactionId: string) => {
    const response = await backendApi.get(
      `/wallet/transactions/${transactionId}`
    );
    return response.data;
  },

  /**
   * Set transaction PIN
   * @param pin - 4-digit PIN
   */
  setTransactionPin: async (pin: string) => {
    const response = await backendApi.post("/wallet/set-pin", { pin });
    return response.data;
  },

  /**
   * Change transaction PIN
   * @param oldPin - Old PIN
   * @param newPin - New PIN
   */
  changeTransactionPin: async (oldPin: string, newPin: string) => {
    const response = await backendApi.post("/wallet/change-pin", {
      oldPin,
      newPin,
    });
    return response.data;
  },
};

