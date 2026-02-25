/**
 * Transaction Types
 * Matches backend API response structure
 */

export type TransactionType =
  | "deposit"
  | "transfer"
  | "airtime"
  | "data"
  | "cable"
  | "education"
  | "betting"
  | "referral_bonus"
  | "withdrawal";

export type TransactionStatus = "pending" | "success" | "failed" | "cancelled";

export type CreditDebit = "credit" | "debit";

export interface Transaction {
  id: string;
  amount: string;
  raw_amount: number;
  type: TransactionType;
  credit_debit: CreditDebit;
  transaction_type: TransactionType;
  description: string;
  status: TransactionStatus;
  date: string;
  reference: string;
  sender: string | null;
  icon?: string | null;
  provider?: string | null;
  payment_channel?: string | null;
  payment_method?: string | null;
}

export interface TransactionDetail {
  id: string;
  amount: string;
  type: TransactionType;
  credit_debit: CreditDebit;
  description: string;
  status: TransactionStatus;
  recipient_mobile: string | null;
  tx_reference: string;
  created_on: string;
  updated_on: string;
  sender: string | null;
  icon: string;
  provider?: string | null;
}

export interface PaginationMeta {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  activeFilter?: string;
}

export type CategoryCounts = Record<string, number>;

export interface TransactionHistoryResponse {
  success: boolean;
  message: string;
  data: {
    categories: CategoryCounts;
    pagination: PaginationMeta;
    transactions: Transaction[];
  };
}

export interface TransactionDetailResponse {
  success: boolean;
  message: string;
  data: TransactionDetail;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: TransactionStatus;
  credit_debit?: CreditDebit;
  search?: string;
}
