import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { generateSecurityHeaders, shouldBypassSecurityHeaders } from "./security-headers";

// Build base URL with API version
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "/api/v1";
const BASE_URL = `${API_BASE_URL}${API_VERSION}`;

// Create axios instance for backend API
export const backendApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add security headers and auth token
backendApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add security headers if not bypassed
    if (!shouldBypassSecurityHeaders()) {
      const securityHeaders = await generateSecurityHeaders(config.data);
      Object.assign(config.headers, securityHeaders);
    }

    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("smipay-access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
backendApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Clear all auth data and redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear localStorage
        localStorage.removeItem("smipay-access-token");
        localStorage.removeItem("smipay-user");
        localStorage.removeItem("smipay-last-activity");
        localStorage.removeItem("smipay-token-expiry");
        
        // Clear cookies properly
        document.cookie = "smipay-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
        
        // Clear zustand store
        localStorage.removeItem("smipay-auth");
        
        // Redirect to signin with message
        const url = new URL("/auth/signin", window.location.origin);
        url.searchParams.set("expired", "true");
        url.searchParams.set("message", "Your session has expired. Please sign in again.");
        window.location.href = url.toString();
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: "Network error. Please check your internet connection.",
        statusCode: 0,
      });
    }

    // Return formatted error
    const errorData = error.response?.data as any;
    return Promise.reject({
      success: false,
      message: errorData?.message || error.message || "An error occurred",
      statusCode: error.response?.status,
      data: errorData,
    });
  }
);

export default backendApi;

