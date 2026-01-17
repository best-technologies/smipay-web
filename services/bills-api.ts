/**
 * Bills API Service
 * Handles bill payments (airtime, data, cable, electricity) with proper error handling
 */

import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";

export const billsApi = {
  /**
   * Buy airtime
   * @param phoneNumber - Phone number
   * @param amount - Amount
   * @param network - Network provider (MTN, GLO, AIRTEL, 9MOBILE)
   */
  buyAirtime: async (phoneNumber: string, amount: number, network: string) => {
    try {
      const response = await backendApi.post("/bills/airtime", {
        phoneNumber,
        amount,
        network,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Buy data bundle
   * @param phoneNumber - Phone number
   * @param dataPlanId - Data plan ID
   * @param network - Network provider
   */
  buyData: async (phoneNumber: string, dataPlanId: string, network: string) => {
    try {
      const response = await backendApi.post("/bills/data", {
        phoneNumber,
        dataPlanId,
        network,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get data plans for a network
   * @param network - Network provider
   */
  getDataPlans: async (network: string) => {
    try {
      const response = await backendApi.get(`/bills/data/plans/${network}`);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Pay cable TV subscription
   * @param smartCardNumber - Smart card number
   * @param packageId - Package/bouquet ID
   * @param provider - Cable provider (DSTV, GOTV, STARTIMES)
   */
  payCableTV: async (
    smartCardNumber: string,
    packageId: string,
    provider: string
  ) => {
    try {
      const response = await backendApi.post("/bills/cable", {
        smartCardNumber,
        packageId,
        provider,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get cable TV packages
   * @param provider - Cable provider
   */
  getCablePackages: async (provider: string) => {
    try {
      const response = await backendApi.get(`/bills/cable/packages/${provider}`);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Verify cable smart card
   * @param smartCardNumber - Smart card number
   * @param provider - Cable provider
   */
  verifyCableCard: async (smartCardNumber: string, provider: string) => {
    try {
      const response = await backendApi.post("/bills/cable/verify", {
        smartCardNumber,
        provider,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Pay electricity bill
   * @param meterNumber - Meter number
   * @param amount - Amount
   * @param meterType - Meter type (PREPAID, POSTPAID)
   * @param provider - Electricity provider
   */
  payElectricity: async (
    meterNumber: string,
    amount: number,
    meterType: string,
    provider: string
  ) => {
    try {
      const response = await backendApi.post("/bills/electricity", {
        meterNumber,
        amount,
        meterType,
        provider,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Verify electricity meter
   * @param meterNumber - Meter number
   * @param meterType - Meter type
   * @param provider - Electricity provider
   */
  verifyMeter: async (
    meterNumber: string,
    meterType: string,
    provider: string
  ) => {
    try {
      const response = await backendApi.post("/bills/electricity/verify", {
        meterNumber,
        meterType,
        provider,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get bill payment history
   * @param page - Page number
   * @param limit - Items per page
   */
  getBillHistory: async (page: number = 1, limit: number = 20) => {
    try {
      const response = await backendApi.get("/bills/history", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};
