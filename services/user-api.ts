/**
 * User API Service
 * Handles user-related API calls with proper error handling
 */

import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";
import type { UserProfileResponse } from "@/types/user";
import type { DashboardResponse } from "@/types/dashboard";

export const userApi = {
  /**
   * Get full user profile with address, KYC, and wallet details
   */
  getProfile: async () => {
    try {
      const response = await backendApi.get<UserProfileResponse>("/user/fetch-user-profile");
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Update user profile
   * @param data - Profile data to update
   */
  updateProfile: async (data: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }) => {
    try {
      const response = await backendApi.put("/user/profile", data);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Change password
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await backendApi.post("/user/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get user settings
   */
  getSettings: async () => {
    try {
      const response = await backendApi.get("/user/settings");
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Update user settings
   * @param data - Settings to update
   */
  updateSettings: async (data: Record<string, any>) => {
    try {
      const response = await backendApi.put("/user/settings", data);
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  /**
   * Get app homepage details
   * Fetches user data, accounts, wallet, transactions, KYC, and tier information
   */
  getAppHomepageDetails: async () => {
    try {
      const response = await backendApi.get<DashboardResponse>("/user/fetch-app-homepage-details");
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};
