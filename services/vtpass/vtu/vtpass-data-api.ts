/**
 * VTPass Data API Service
 * Handles VTPass data purchase operations with proper error handling
 */

import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";
import type {
  VtpassDataServiceIdsResponse,
  VtpassDataPurchaseApiResponse,
  VtpassDataPurchaseRequest,
  VtpassDataVariationCodesResponse,
} from "@/types/vtpass/vtu/vtpass-data";

export const vtpassDataApi = {
  /**
   * Get available data service IDs
   * Retrieves list of available data providers and their service IDs
   */
  getServiceIds: async (): Promise<VtpassDataServiceIdsResponse> => {
    try {
      const response = await backendApi.get<VtpassDataServiceIdsResponse>(
        "/vtpass/data/service-ids"
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get variation codes for a specific service provider
   * Retrieves available data plans (variation codes) for a service provider
   * @param serviceID - Service ID of the provider (e.g., "mtn-data", "glo-data")
   */
  getVariationCodes: async (
    serviceID: string
  ): Promise<VtpassDataVariationCodesResponse> => {
    try {
      const response = await backendApi.get<VtpassDataVariationCodesResponse>(
        `/vtpass/data/variation-codes?serviceID=${encodeURIComponent(serviceID)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Purchase data
   * @param data - Purchase request data
   */
  purchaseData: async (
    data: VtpassDataPurchaseRequest
  ): Promise<VtpassDataPurchaseApiResponse> => {
    try {
      const response = await backendApi.post<VtpassDataPurchaseApiResponse>(
        "/vtpass/data/purchase",
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};
