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
  | "withdrawal";

export type TransactionStatus = "pending" | "success" | "failed" | "cancelled";

export type CreditDebit = "credit" | "debit";

export interface Transaction {
  id: string;
  amount: string; // Formatted string e.g., "5,000.00"
  type: TransactionType;
  credit_debit: CreditDebit;
  transaction_type: TransactionType;
  description: string;
  status: TransactionStatus;
  date: string; // Formatted date string
  reference: string;
  sender: string | null;
  icon?: string | null;
  payment_channel?: string;
  payment_method?: string;
}

export interface TransactionDetail {
  id: string;
  amount: string;
  type: TransactionType;
  description: string;
  status: TransactionStatus;
  recipient_mobile: string | null;
  tx_reference: string;
  created_on: string;
  updated_on: string;
  sender: string | null;
  icon: string;
  // Optional provider identifier for mapping to logos (e.g. "mtn", "dstv", etc.)
  provider?: string | null;
}

export interface PaginationMeta {
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface TransactionHistoryResponse {
  success: boolean;
  message: string;
  data: {
    pagination: PaginationMeta;
    transactions: Transaction[];
  };
}

export interface TransactionDetailResponse {
  success: boolean;
  message: string;
  data: TransactionDetail;
}

