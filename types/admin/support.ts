// --- Analytics ---

export interface SupportOverview {
  total_tickets: number;
  open: number;
  pending: number;
  in_progress: number;
  escalated: number;
  waiting_user: number;
  resolved: number;
  closed: number;
  unassigned: number;
}

export interface SupportActivity {
  new_today: number;
  new_this_week: number;
  new_this_month: number;
}

export interface SupportPerformance {
  avg_response_time_seconds: number | null;
  avg_satisfaction_rating: number | null;
  total_rated: number;
}

export interface SupportAnalytics {
  overview: SupportOverview;
  activity: SupportActivity;
  performance: SupportPerformance;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
  by_type: Record<string, number>;
}

// --- User brief ---

export interface SupportUserBrief {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string;
  smipay_tag: string | null;
  profile_image: { secure_url: string } | null;
}

// --- Admin brief ---

export interface SupportAdminBrief {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

// --- Ticket item ---

export interface SupportTicketItem {
  id: string;
  ticket_number: string;
  user_id: string | null;
  phone_number: string | null;
  email: string | null;
  subject: string;
  support_type: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  first_response_at: string | null;
  last_response_at: string | null;
  response_time_seconds: number | null;
  resolved_at: string | null;
  satisfaction_rating: number | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  user: SupportUserBrief | null;
  message_count: number;
  assigned_admin: SupportAdminBrief | null;
}

// --- Pagination ---

export interface SupportListMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// --- List response ---

export interface SupportListResponse {
  success: boolean;
  message: string;
  data: {
    analytics: SupportAnalytics;
    tickets: SupportTicketItem[];
    meta: SupportListMeta;
  };
}

// --- Message ---

export interface SupportMessage {
  id: string;
  message: string;
  is_internal: boolean;
  is_from_user: boolean;
  user_id: string | null;
  sender_name: string | null;
  sender_email: string | null;
  attachments: string[] | null;
  createdAt: string;
}

// --- Device metadata ---

export interface SupportDeviceMetadata {
  device_id: string;
  platform: string;
  device_model: string;
  app_version: string;
}

// --- Related transaction ---

export interface SupportRelatedTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  status: string;
  transaction_reference: string;
  createdAt: string;
}

// --- Detail user (extended) ---

export interface SupportDetailUser extends SupportUserBrief {
  account_status: string;
  role: string;
  wallet: { current_balance: number } | null;
  tier: { tier: string; name: string } | null;
  kyc_verification: { is_verified: boolean; status: string } | null;
}

// --- Ticket detail (full) ---

export interface SupportTicketDetail extends SupportTicketItem {
  description: string;
  resolution_notes: string | null;
  resolved_by: string | null;
  related_transaction_id: string | null;
  related_registration_progress_id: string | null;
  device_metadata: SupportDeviceMetadata | null;
  ip_address: string | null;
  user_agent: string | null;
  internal_notes: string | null;
  attachments: string[] | null;
  feedback: string | null;
  messages: SupportMessage[];
  resolved_by_admin: SupportAdminBrief | null;
  related_transaction: SupportRelatedTransaction | null;
  user: SupportDetailUser | null;
}

// --- Detail response ---

export interface SupportDetailResponse {
  success: boolean;
  message: string;
  data: SupportTicketDetail;
}

// --- Mutation response ---

export interface SupportMutationResponse {
  success: boolean;
  message: string;
  data: SupportTicketItem;
}

// --- Filters ---

export interface SupportFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  priority: string;
  support_type: string;
  assigned_to: string;
  user_id: string;
  date_from: string;
  date_to: string;
  sort_by: string;
  sort_order: string;
}

// --- Enums ---

export const SUPPORT_STATUSES = [
  { value: "pending", label: "Pending", color: "amber" },
  { value: "in_progress", label: "In Progress", color: "blue" },
  { value: "waiting_user", label: "Waiting User", color: "orange" },
  { value: "resolved", label: "Resolved", color: "emerald" },
  { value: "closed", label: "Closed", color: "slate" },
  { value: "escalated", label: "Escalated", color: "red" },
] as const;

export const SUPPORT_PRIORITIES = [
  { value: "low", label: "Low", color: "slate" },
  { value: "medium", label: "Medium", color: "blue" },
  { value: "high", label: "High", color: "orange" },
  { value: "urgent", label: "Urgent", color: "red" },
] as const;

export const SUPPORT_TYPES = [
  { value: "REGISTRATION_ISSUE", label: "Registration Issue" },
  { value: "LOGIN_ISSUE", label: "Login Issue" },
  { value: "TRANSACTION_ISSUE", label: "Transaction Issue" },
  { value: "PAYMENT_ISSUE", label: "Payment Issue" },
  { value: "ACCOUNT_ISSUE", label: "Account Issue" },
  { value: "WALLET_ISSUE", label: "Wallet Issue" },
  { value: "CARD_ISSUE", label: "Card Issue" },
  { value: "KYC_VERIFICATION_ISSUE", label: "KYC Verification" },
  { value: "SECURITY_ISSUE", label: "Security Issue" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "BUG_REPORT", label: "Bug Report" },
  { value: "BILLING_ISSUE", label: "Billing Issue" },
  { value: "REFUND_REQUEST", label: "Refund Request" },
  { value: "GENERAL_INQUIRY", label: "General Inquiry" },
  { value: "OTHER", label: "Other" },
] as const;
