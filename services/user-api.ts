/**
 * User API Service
 * Handles all user-related API calls
 */

import { backendApi } from "@/lib/api-client-backend";

export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await backendApi.get("/user/profile");
    return response.data;
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
    const response = await backendApi.patch("/user/profile", data);
    return response.data;
  },

  /**
   * Change password
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await backendApi.post("/user/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Get user's devices
   */
  getDevices: async () => {
    const response = await backendApi.get("/user/devices");
    return response.data;
  },

  /**
   * Remove a device
   * @param deviceId - Device ID to remove
   */
  removeDevice: async (deviceId: string) => {
    const response = await backendApi.delete(`/user/devices/${deviceId}`);
    return response.data;
  },

  /**
   * Update user settings
   * @param settings - User settings
   */
  updateSettings: async (settings: Record<string, any>) => {
    const response = await backendApi.patch("/user/settings", settings);
    return response.data;
  },
};

