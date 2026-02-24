import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";
import type {
  MyTicketsResponse,
  TicketDetailResponse,
  CreateTicketResponse,
  SendMessageResponse,
  RateTicketResponse,
  CreateTicketPayload,
  SendMessagePayload,
  RateTicketPayload,
} from "@/types/support";

const BASE = "/support";

export const supportApi = {
  getMyTickets: async (): Promise<MyTicketsResponse> => {
    try {
      const res = await backendApi.get<MyTicketsResponse>(`${BASE}/my-tickets`);
      return res.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  getTicket: async (ticketNumber: string): Promise<TicketDetailResponse> => {
    try {
      const res = await backendApi.get<TicketDetailResponse>(
        `${BASE}/ticket?ticket_number=${encodeURIComponent(ticketNumber)}`
      );
      return res.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  createTicket: async (payload: CreateTicketPayload): Promise<CreateTicketResponse> => {
    try {
      const res = await backendApi.post<CreateTicketResponse>(
        `${BASE}/request-support`,
        payload
      );
      return res.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  sendMessage: async (payload: SendMessagePayload): Promise<SendMessageResponse> => {
    try {
      const res = await backendApi.post<SendMessageResponse>(
        `${BASE}/ticket/add-message`,
        payload
      );
      return res.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  rateTicket: async (ticketNumber: string, payload: RateTicketPayload): Promise<RateTicketResponse> => {
    try {
      const res = await backendApi.post<RateTicketResponse>(
        `${BASE}/ticket/${encodeURIComponent(ticketNumber)}/rate`,
        payload
      );
      return res.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};
