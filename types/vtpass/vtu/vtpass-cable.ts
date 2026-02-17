/**
 * VTPass Cable TV API Types
 * Type definitions for VTPass cable TV operations
 */

export interface VtpassCableService {
  serviceID: string;
  name: string;
  identifier?: string;
  category?: string;
  commission?: string;
  minimum_amount?: string;
  maximum_amount?: string;
  minimium_amount?: string; // API typo - keeping both for compatibility
  maximium_amount?: string; // API typo - keeping both for compatibility
  convinience_fee?: string;
  product_type?: string;
  image?: string;
}

export interface VtpassCableVariation {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
}

export interface VtpassCableVariationCodesResponse {
  success: boolean;
  message: string;
  data: {
    ServiceName: string;
    serviceID: string;
    convinience_fee: string;
    variations: VtpassCableVariation[];
    varations?: VtpassCableVariation[]; // API typo - keeping both for compatibility
  };
}

export interface VtpassCableServiceIdsResponse {
  success: boolean;
  message: string;
  data: VtpassCableService[];
}

// Verify Smartcard Types
export interface VtpassCableVerifyRequest {
  billersCode: string;
  serviceID: string;
}

export interface VtpassCableVerifyContent {
  Customer_Name: string;
  Status: string;
  Due_Date: string;
  Customer_Number: string;
  Customer_Type: string;
  Current_Bouquet: string;
  Renewal_Amount: string;
  commission_details: {
    amount: number | null;
    rate: string;
    rate_type: string;
    computation_type: string;
  };
}

export interface VtpassCableVerifyResponse {
  success: boolean;
  message: string;
  data: {
    code: string;
    content: VtpassCableVerifyContent;
  };
}

// Purchase Types
export interface VtpassCablePurchaseRequest {
  request_id?: string;
  serviceID: string;
  billersCode: string;
  variation_code?: string; // Required for DSTV/GOTV change, Startimes/Showmax always
  amount?: number; // Required for DSTV/GOTV renew
  phone?: string;
  subscription_type?: "change" | "renew"; // DSTV/GOTV only
  quantity?: number; // DSTV/GOTV only, default 1
}

export interface VtpassCableTransactionContent {
  transactions: {
    status: "delivered" | "pending" | "initiated" | "failed";
    product_name: string;
    unique_element: string;
    unit_price: string | number;
    quantity: number;
    amount?: string | number;
    transactionId: string;
    commission?: number;
    total_amount?: number;
  };
}

export interface VtpassCablePurchaseResponse {
  id: string;
  code: string;
  response_description: string;
  content?: VtpassCableTransactionContent;
  status?: "processing" | "success" | "failed";
  message?: string;
  requestId: string;
  amount: number;
  transaction_date?: string;
  purchased_code?: string; // Showmax voucher code
  Voucher?: string[]; // Showmax voucher codes array
}

export interface VtpassCablePurchaseApiResponse {
  success: boolean;
  message: string;
  data: VtpassCablePurchaseResponse;
}
