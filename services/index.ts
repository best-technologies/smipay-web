/**
 * Services Index
 * Central export point for all API services
 */

export { authApi } from "./auth-api";
export { userApi } from "./user-api";
export { walletApi } from "./wallet-api";
export { transferApi } from "./transfer-api";
export { billsApi } from "./bills-api";

// Export all services as a single object for convenience
export const api = {
  auth: authApi,
  user: userApi,
  wallet: walletApi,
  transfer: transferApi,
  bills: billsApi,
} as const;

