/**
 * Transfer API Service
 * Handles money transfer operations with proper error handling
 */

import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";

export const transferApi = {
  /**
   * Transfer money to another user
   * @param recipientId - Recipient's user ID or smipay tag
   * @param amount - Amount to transfer
   * @param note - Optional transfer note
   */
  transferToUser: async (recipientId: string, amount: number, note?: string) => {
    try {
      const response = await backendApi.post("/transfer/user", {
        recipientId,
        amount,
        note,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Transfer to bank account
   * @param bankDetails - Bank transfer details
   */
  transferToBank: async (bankDetails: {
    accountNumber: string;
    bankCode: string;
    amount: number;
    narration?: string;
  }) => {
    try {
      const response = await backendApi.post("/transfer/bank", bankDetails);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get list of supported banks
   */
  getBanks: async () => {
    try {
      const response = await backendApi.get("/transfer/banks");
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Verify bank account
   * @param accountNumber - Bank account number
   * @param bankCode - Bank code
   */
  verifyBankAccount: async (accountNumber: string, bankCode: string) => {
    try {
      const response = await backendApi.post("/transfer/verify-account", {
        accountNumber,
        bankCode,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get transfer history
   * @param page - Page number
   * @param limit - Items per page
   */
  getTransferHistory: async (page: number = 1, limit: number = 20) => {
    try {
      const response = await backendApi.get("/transfer/history", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};
