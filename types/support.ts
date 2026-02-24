// Ticket message
export interface SupportMessage {
  id: string;
  message: string;
  is_from_user: boolean;
  sender_name: string | null;
  sender_email: string | null;
  attachments: string[] | null;
  created_at?: string;
  createdAt?: string;
}

// Ticket in the list
export interface SupportTicketListItem {
  id: string;
  ticket_number: string;
  subject: string;
  support_type: string;
  status: string;
  priority: string;
  message_count: number;
  last_message: {
    message: string;
    is_from_user: boolean;
    createdAt: string;
  } | null;
  has_unread: boolean;
  created_at: string;
  updated_at: string;
  last_response_at: string | null;
}

// Full ticket detail
export interface SupportTicketDetail {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  support_type: string;
  status: string;
  priority: string;
  email: string;
  phone_number: string | null;
  related_transaction_id: string | null;
  created_at: string;
  updated_at: string;
  last_response_at: string | null;
  messages: SupportMessage[];
  total_messages: number;
  /** User satisfaction rating 1-5, null if not yet rated */
  satisfaction_rating?: number | null;
}

// Create ticket payload
export interface CreateTicketPayload {
  subject: string;
  description: string;
  email: string;
  phone_number?: string;
  support_type?: string;
  related_transaction_id?: string;
  device_metadata?: {
    device_id?: string;
    device_model?: string;
    platform?: string;
    app_version?: string;
  };
}

// Send message payload
export interface SendMessagePayload {
  ticket_number: string;
  message: string;
  email: string;
}

// Rate ticket payload
export interface RateTicketPayload {
  rating: number;
  feedback?: string;
}

// Support types enum
export const SUPPORT_TYPES = [
  { value: "GENERAL_INQUIRY", label: "General Inquiry" },
  { value: "TRANSACTION_ISSUE", label: "Transaction Issue" },
  { value: "PAYMENT_ISSUE", label: "Payment Issue" },
  { value: "ACCOUNT_ISSUE", label: "Account Issue" },
  { value: "WALLET_ISSUE", label: "Wallet Issue" },
  { value: "CARD_ISSUE", label: "Card Issue" },
  { value: "KYC_VERIFICATION_ISSUE", label: "KYC Verification" },
  { value: "LOGIN_ISSUE", label: "Login Issue" },
  { value: "REGISTRATION_ISSUE", label: "Registration Issue" },
  { value: "SECURITY_ISSUE", label: "Security Issue" },
  { value: "BILLING_ISSUE", label: "Billing Issue" },
  { value: "REFUND_REQUEST", label: "Refund Request" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "BUG_REPORT", label: "Bug Report" },
  { value: "OTHER", label: "Other" },
] as const;

// Status display map
export const TICKET_STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  pending: { label: "Waiting for support", color: "amber" },
  in_progress: { label: "Being handled", color: "blue" },
  waiting_user: { label: "Waiting for your reply", color: "orange" },
  escalated: { label: "Under review", color: "purple" },
  resolved: { label: "Resolved", color: "green" },
  closed: { label: "Closed", color: "slate" },
};

// API response wrappers
export interface MyTicketsResponse {
  success: boolean;
  message: string;
  data: {
    tickets: SupportTicketListItem[];
    total_tickets: number;
  };
}

export interface TicketDetailResponse {
  success: boolean;
  message: string;
  data: {
    ticket: SupportTicketDetail;
  };
}

export interface CreateTicketResponse {
  success: boolean;
  message: string;
  data: {
    ticket: SupportTicketDetail;
    message: string;
  };
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: {
    ticket_number: string;
    ticket_id: string;
    message: SupportMessage;
  };
}

export interface RateTicketResponse {
  success: boolean;
  message: string;
}
