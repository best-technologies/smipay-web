// Dashboard Data Types
export interface DashboardData {
  virtualAccount: VirtualAccount;
  stats: DashboardStats;
  recentTransactions: Transaction[];
}

export interface VirtualAccount {
  accountNumber: string;
  accountName: string;
  bankName: string;
  balance: number;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface DashboardStats {
  walletBalance: number;
  totalSpent: number;
  totalFunding: number;
  transactionCount: number;
  referrals: number;
}

export interface Transaction {
  id: number | string;
  description: string;
  amount: number; // Negative for debit, positive for credit
  type: "credit" | "debit";
  date: string; // ISO format recommended: "2026-01-17T10:30:00Z"
  status: "success" | "pending" | "failed";
  reference?: string; // Optional transaction reference
  category?: string; // Optional: "airtime", "data", "transfer", etc.
}

// Sample JSON structure for API response
export const SAMPLE_DASHBOARD_JSON = {
  success: true,
  message: "Dashboard data retrieved successfully",
  data: {
    virtualAccount: {
      accountNumber: "6027817037",
      accountName: "SMIPAY-JOHN-DOE",
      bankName: "MONIEPOINT MICROFINANCE BANK",
      balance: 157.98,
      status: "ACTIVE"
    },
    stats: {
      walletBalance: 157.98,
      totalSpent: 33531.01,
      totalFunding: 33688.98,
      transactionCount: 51,
      referrals: 0
    },
    recentTransactions: [
      {
        id: "txn_001",
        description: "MTN Airtime Purchase",
        amount: -500,
        type: "debit",
        date: "2026-01-17T10:30:00Z",
        status: "success",
        reference: "REF-MTN-1234567890",
        category: "airtime"
      },
      {
        id: "txn_002",
        description: "Wallet Funding",
        amount: 5000,
        type: "credit",
        date: "2026-01-17T09:15:00Z",
        status: "success",
        reference: "REF-FUND-0987654321",
        category: "funding"
      },
      {
        id: "txn_003",
        description: "DSTV Subscription",
        amount: -4200,
        type: "debit",
        date: "2026-01-16T20:45:00Z",
        status: "success",
        reference: "REF-DSTV-5555555555",
        category: "cable"
      },
      {
        id: "txn_004",
        description: "Electricity Bill Payment",
        amount: -2800,
        type: "debit",
        date: "2026-01-16T14:20:00Z",
        status: "success",
        reference: "REF-ELEC-7777777777",
        category: "electricity"
      }
    ]
  }
};

