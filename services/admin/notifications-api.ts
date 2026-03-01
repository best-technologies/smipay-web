import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";
import type {
  NotificationCampaignListResponse,
  NotificationCampaignResponse,
  NotificationCampaignCreatePayload,
  NotificationCampaignFilters,
  NotificationDeliveryLogsResponse,
  NotificationPreviewResponse,
  NotificationResendFailedResponse,
} from "@/types/admin/notifications";

function buildListParams(
  filters: Partial<NotificationCampaignFilters>,
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (filters.status) params.status = filters.status;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  return params;
}

export const adminNotificationsApi = {
  listCampaigns: async (
    filters: Partial<NotificationCampaignFilters>,
  ): Promise<NotificationCampaignListResponse> => {
    try {
      const response = await backendApi.get<NotificationCampaignListResponse>(
        "/unified-admin/notifications/campaigns",
        { params: buildListParams(filters) },
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  createCampaign: async (
    payload: NotificationCampaignCreatePayload,
  ): Promise<NotificationCampaignResponse> => {
    try {
      const response = await backendApi.post<NotificationCampaignResponse>(
        "/unified-admin/notifications/campaigns",
        payload,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  previewAudience: async (
    payload: NotificationCampaignCreatePayload,
  ): Promise<NotificationPreviewResponse> => {
    try {
      const response = await backendApi.post<NotificationPreviewResponse>(
        "/unified-admin/notifications/campaigns/preview",
        payload,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  getCampaign: async (id: string): Promise<NotificationCampaignResponse> => {
    try {
      const response = await backendApi.get<NotificationCampaignResponse>(
        `/unified-admin/notifications/campaigns/${id}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  getDeliveryLogs: async (
    id: string,
    page = 1,
    limit = 50,
  ): Promise<NotificationDeliveryLogsResponse> => {
    try {
      const response = await backendApi.get<NotificationDeliveryLogsResponse>(
        `/unified-admin/notifications/campaigns/${id}/logs`,
        { params: { page, limit } },
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  cancelCampaign: async (id: string): Promise<NotificationCampaignResponse> => {
    try {
      const response = await backendApi.post<NotificationCampaignResponse>(
        `/unified-admin/notifications/campaigns/${id}/cancel`,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  resendFailed: async (id: string): Promise<NotificationResendFailedResponse> => {
    try {
      const response = await backendApi.post<NotificationResendFailedResponse>(
        `/unified-admin/notifications/campaigns/${id}/resend-failed`,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};
