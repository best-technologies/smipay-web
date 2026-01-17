/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { backendApi } from "@/lib/api-client-backend";

export const authApi = {
  /**
   * Step 1: Request email OTP for registration
   * @param email - User's email address
   */
  requestEmailOtp: async (email: string) => {
    const response = await backendApi.post(
      "/auth/minimal-register/request-email-otp",
      { email }
    );
    return response.data;
  },

  /**
   * Step 2: Verify email OTP
   * @param email - User's email address
   * @param otp - 4-digit OTP code
   */
  verifyEmailOtp: async (email: string, otp: string) => {
    const response = await backendApi.post(
      "/auth/minimal-register/verify-email-otp",
      { email, otp }
    );
    return response.data;
  },

  /**
   * Step 3: Complete registration
   * @param data - Registration data
   */
  register: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    referral_code?: string;
  }) => {
    const response = await backendApi.post(
      "/auth/minimal-register/register",
      data
    );
    return response.data;
  },

  /**
   * Login with email or phone number
   * @param credentials - Email/phone + password
   */
  login: async (credentials: {
    email?: string;
    phone_number?: string;
    password: string;
  }) => {
    const response = await backendApi.post(
      "/auth/minimal-register/login",
      credentials
    );
    return response.data;
  },

  /**
   * Request password reset OTP
   * @param email - User's email address
   */
  requestPasswordReset: async (email: string) => {
    const response = await backendApi.post("/auth/request-password-reset", {
      email,
    });
    return response.data;
  },

  /**
   * Verify password reset OTP and set new password
   * @param email - User's email address
   * @param otp - OTP code
   * @param newPassword - New password
   */
  verifyPasswordResetOtp: async (
    email: string,
    otp: string,
    newPassword: string
  ) => {
    const response = await backendApi.post("/auth/verify-password-reset-otp", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await backendApi.post("/auth/logout");
    return response.data;
  },

  /**
   * Refresh access token
   * @param refreshToken - Refresh token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await backendApi.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  /**
   * Verify email address
   * @param token - Email verification token
   */
  verifyEmail: async (token: string) => {
    const response = await backendApi.post("/auth/verify-email", { token });
    return response.data;
  },

  /**
   * Resend email verification
   */
  resendEmailVerification: async () => {
    const response = await backendApi.post("/auth/resend-verification");
    return response.data;
  },
};

