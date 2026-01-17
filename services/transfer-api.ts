/**
 * Transfer API Service
 * Handles all money transfer-related API calls
 */

import { backendApi } from "@/lib/api-client-backend";

export const transferApi = {
  /**
   * Transfer to bank account
   * @param data - Transfer data
   */
  transferToBank: async (data: {
    amount: number;
    bank_code: string;
    account_number: string;
    account_name: string;
    narration?: string;
    pin: string;
  }) => {
    const response = await backendApi.post("/transfers/bank", data);
    return response.data;
  },

  /**
   * Transfer to another Smipay user
   * @param data - Transfer data
   */
  transferToSmipayUser: async (data: {
    amount: number;
    recipient_tag: string;
    narration?: string;
    pin: string;
  }) => {
    const response = await backendApi.post("/transfers/smipay", data);
    return response.data;
  },

  /**
   * Verify bank account
   * @param bankCode - Bank code
   * @param accountNumber - Account number
   */
  verifyBankAccount: async (bankCode: string, accountNumber: string) => {
    const response = await backendApi.post("/transfers/verify-account", {
      bank_code: bankCode,
      account_number: accountNumber,
    });
    return response.data;
  },

  /**
   * Get list of banks
   */
  getBanks: async () => {
    const response = await backendApi.get("/transfers/banks");
    return response.data;
  },

  /**
   * Lookup Smipay user by tag
   * @param smipayTag - User's Smipay tag
   */
  lookupSmipayUser: async (smipayTag: string) => {
    const response = await backendApi.get(`/transfers/lookup/${smipayTag}`);
    return response.data;
  },

  /**
   * Get transfer history
   * @param params - Query parameters
   */
  getTransferHistory: async (params?: {
    page?: number;
    limit?: number;
    type?: "bank" | "smipay";
    status?: string;
  }) => {
    const response = await backendApi.get("/transfers/history", { params });
    return response.data;
  },

  /**
   * Get single transfer details
   * @param transferId - Transfer ID
   */
  getTransferDetails: async (transferId: string) => {
    const response = await backendApi.get(`/transfers/${transferId}`);
    return response.data;
  },
};

