/**
 * Bills Payment API Service
 * Handles all bills payment-related API calls (Airtime, Data, Electricity, Cable, etc.)
 */

import { backendApi } from "@/lib/api-client-backend";

export const billsApi = {
  /**
   * Get available bill categories
   */
  getCategories: async () => {
    const response = await backendApi.get("/bills/categories");
    return response.data;
  },

  /**
   * Get billers for a category
   * @param categoryId - Category ID (airtime, data, electricity, cable, etc.)
   */
  getBillers: async (categoryId: string) => {
    const response = await backendApi.get(`/bills/categories/${categoryId}/billers`);
    return response.data;
  },

  /**
   * Get biller packages/plans
   * @param billerId - Biller ID
   */
  getBillerPackages: async (billerId: string) => {
    const response = await backendApi.get(`/bills/billers/${billerId}/packages`);
    return response.data;
  },

  /**
   * Purchase airtime
   * @param data - Airtime purchase data
   */
  purchaseAirtime: async (data: {
    network: string;
    phone_number: string;
    amount: number;
    pin: string;
  }) => {
    const response = await backendApi.post("/bills/airtime", data);
    return response.data;
  },

  /**
   * Purchase data bundle
   * @param data - Data purchase data
   */
  purchaseData: async (data: {
    network: string;
    phone_number: string;
    package_id: string;
    pin: string;
  }) => {
    const response = await backendApi.post("/bills/data", data);
    return response.data;
  },

  /**
   * Pay electricity bill
   * @param data - Electricity bill data
   */
  payElectricity: async (data: {
    disco: string;
    meter_number: string;
    meter_type: string;
    amount: number;
    pin: string;
  }) => {
    const response = await backendApi.post("/bills/electricity", data);
    return response.data;
  },

  /**
   * Pay cable TV subscription
   * @param data - Cable TV data
   */
  payCableTv: async (data: {
    provider: string;
    smartcard_number: string;
    package_id: string;
    pin: string;
  }) => {
    const response = await backendApi.post("/bills/cable-tv", data);
    return response.data;
  },

  /**
   * Verify meter number
   * @param disco - Distribution company
   * @param meterNumber - Meter number
   * @param meterType - Meter type (prepaid/postpaid)
   */
  verifyMeterNumber: async (
    disco: string,
    meterNumber: string,
    meterType: string
  ) => {
    const response = await backendApi.post("/bills/verify-meter", {
      disco,
      meter_number: meterNumber,
      meter_type: meterType,
    });
    return response.data;
  },

  /**
   * Verify smartcard number
   * @param provider - Cable TV provider
   * @param smartcardNumber - Smartcard number
   */
  verifySmartcard: async (provider: string, smartcardNumber: string) => {
    const response = await backendApi.post("/bills/verify-smartcard", {
      provider,
      smartcard_number: smartcardNumber,
    });
    return response.data;
  },

  /**
   * Get bills payment history
   * @param params - Query parameters
   */
  getHistory: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
  }) => {
    const response = await backendApi.get("/bills/history", { params });
    return response.data;
  },

  /**
   * Get single bill transaction
   * @param transactionId - Transaction ID
   */
  getTransaction: async (transactionId: string) => {
    const response = await backendApi.get(`/bills/transactions/${transactionId}`);
    return response.data;
  },
};

