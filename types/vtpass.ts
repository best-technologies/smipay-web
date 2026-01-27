/**
 * VTPass Type Definitions
 */

export type VtpassServiceId = "mtn" | "glo" | "airtel" | "etisalat" | "9-mobile" | "foreign-airtime";

export type VtpassTransactionStatus = "delivered" | "pending" | "initiated" | "processing" | "failed";

export interface VtpassErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
