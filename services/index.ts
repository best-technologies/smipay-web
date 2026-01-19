/**
 * Services Index
 * Central export point for all API services
 */

import { authApi } from "./auth-api";
import { userApi } from "./user-api";
import { walletApi } from "./wallet-api";
import { transferApi } from "./transfer-api";
import { billsApi } from "./bills-api";
import { transactionApi } from "./transaction-api";

// Export individual services
export { authApi, userApi, walletApi, transferApi, billsApi, transactionApi };

// Export all services as a single object for convenience
export const api = {
  auth: authApi,
  user: userApi,
  wallet: walletApi,
  transfer: transferApi,
  bills: billsApi,
  transaction: transactionApi,
} as const;

