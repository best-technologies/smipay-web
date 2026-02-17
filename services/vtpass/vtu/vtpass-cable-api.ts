/**
 * VTPass Cable TV API Service
 * Handles VTPass cable TV operations with proper error handling
 */

import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";
import type {
  VtpassCableServiceIdsResponse,
  VtpassCableVariationCodesResponse,
  VtpassCableVerifyRequest,
  VtpassCableVerifyResponse,
  VtpassCablePurchaseRequest,
  VtpassCablePurchaseApiResponse,
} from "@/types/vtpass/vtu/vtpass-cable";

export const vtpassCableApi = {
  /**
   * Get available cable TV service IDs
   * Retrieves list of available cable TV providers and their service IDs
   */
  getServiceIds: async (): Promise<VtpassCableServiceIdsResponse> => {
    try {
      const response = await backendApi.get<VtpassCableServiceIdsResponse>(
        "/vtpass/cable/service-ids"
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get variation codes for a specific cable TV provider
   * Retrieves available subscription plans (bouquets) for a service provider
   * @param serviceID - Service ID of the provider (e.g., "dstv", "gotv", "startimes", "showmax")
   */
  getVariationCodes: async (
    serviceID: string
  ): Promise<VtpassCableVariationCodesResponse> => {
    try {
      const response = await backendApi.get<VtpassCableVariationCodesResponse>(
        `/vtpass/cable/variation-codes?serviceID=${encodeURIComponent(serviceID)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Verify smartcard number and retrieve customer information
   * @param data - Verify request data (billersCode and serviceID)
   */
  verifySmartcard: async (
    data: VtpassCableVerifyRequest
  ): Promise<VtpassCableVerifyResponse> => {
    try {
      const response = await backendApi.post<VtpassCableVerifyResponse>(
        "/vtpass/cable/verify",
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Purchase cable TV subscription
   * @param data - Purchase request data
   */
  purchaseCable: async (
    data: VtpassCablePurchaseRequest
  ): Promise<VtpassCablePurchaseApiResponse> => {
    try {
      const response = await backendApi.post<VtpassCablePurchaseApiResponse>(
        "/vtpass/cable/purchase",
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};
