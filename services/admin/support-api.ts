import { backendApi } from "@/lib/api-client-backend";
import { formatErrorMessage } from "@/lib/error-handler";
import type {
  SupportListResponse,
  SupportDetailResponse,
  SupportMutationResponse,
  SupportFilters,
} from "@/types/admin/support";

function buildParams(filters: Partial<SupportFilters>): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.support_type) params.support_type = filters.support_type;
  if (filters.assigned_to) params.assigned_to = filters.assigned_to;
  if (filters.user_id) params.user_id = filters.user_id;
  if (filters.date_from) params.date_from = filters.date_from;
  if (filters.date_to) params.date_to = filters.date_to;
  if (filters.sort_by) params.sort_by = filters.sort_by;
  if (filters.sort_order) params.sort_order = filters.sort_order;
  return params;
}

export const adminSupportApi = {
  list: async (filters: Partial<SupportFilters>): Promise<SupportListResponse> => {
    try {
      const response = await backendApi.get<SupportListResponse>(
        "/unified-admin/support",
        { params: buildParams(filters) },
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  getById: async (id: string): Promise<SupportDetailResponse> => {
    try {
      const response = await backendApi.get<SupportDetailResponse>(
        `/unified-admin/support/${id}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  reply: async (
    id: string,
    payload: { message: string; is_internal?: boolean },
  ): Promise<SupportMutationResponse> => {
    try {
      const response = await backendApi.post<SupportMutationResponse>(
        `/unified-admin/support/${id}/reply`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  updateStatus: async (
    id: string,
    payload: { status: string; resolution_notes?: string },
  ): Promise<SupportMutationResponse> => {
    try {
      const response = await backendApi.put<SupportMutationResponse>(
        `/unified-admin/support/${id}/status`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  assign: async (
    id: string,
    payload: { assigned_to: string },
  ): Promise<SupportMutationResponse> => {
    try {
      const response = await backendApi.put<SupportMutationResponse>(
        `/unified-admin/support/${id}/assign`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },

  updatePriority: async (
    id: string,
    payload: { priority: string },
  ): Promise<SupportMutationResponse> => {
    try {
      const response = await backendApi.put<SupportMutationResponse>(
        `/unified-admin/support/${id}/priority`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  },
};
