/**
 * Error Handler - Converts technical errors to user-friendly messages
 */

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * Convert API errors to user-friendly messages
 */
export function handleApiError(error: any): ApiError {
  // Network errors (server down, no internet, etc.)
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return {
        message:
          "Request timed out. Please check your internet connection and try again.",
        code: "TIMEOUT",
      };
    }

    if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
      return {
        message:
          "Unable to connect to our servers. Please check your internet connection and try again.",
        code: "NETWORK_ERROR",
      };
    }

    return {
      message:
        "We're experiencing technical difficulties. Please try again in a few moments.",
      code: "UNKNOWN_ERROR",
    };
  }

  const status = error.response?.status;
  const responseData = error.response?.data;

  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      // Bad request - validation errors
      if (responseData?.message) {
        if (Array.isArray(responseData.message)) {
          return {
            message: responseData.message.join(", "),
            code: "VALIDATION_ERROR",
            statusCode: 400,
          };
        }
        return {
          message: responseData.message,
          code: "BAD_REQUEST",
          statusCode: 400,
        };
      }
      return {
        message: "Invalid request. Please check your information and try again.",
        code: "BAD_REQUEST",
        statusCode: 400,
      };

    case 401:
      // Unauthorized
      return {
        message:
          responseData?.message ||
          "Invalid credentials. Please check your email/phone and password.",
        code: "UNAUTHORIZED",
        statusCode: 401,
      };

    case 403:
      // Forbidden
      return {
        message:
          responseData?.message ||
          "You don't have permission to perform this action.",
        code: "FORBIDDEN",
        statusCode: 403,
      };

    case 404:
      // Not found - This is where we make it user-friendly!
      return {
        message:
          "We're experiencing technical difficulties. Our team has been notified. Please try again later.",
        code: "SERVICE_UNAVAILABLE",
        statusCode: 404,
      };

    case 409:
      // Conflict (e.g., email already exists)
      return {
        message:
          responseData?.message ||
          "This information is already registered. Please use different details.",
        code: "CONFLICT",
        statusCode: 409,
      };

    case 429:
      // Too many requests
      const retryAfter = responseData?.data?.retry_after || 120;
      const retryMessage =
        retryAfter > 60
          ? `${Math.ceil(retryAfter / 60)} minutes`
          : `${retryAfter} seconds`;

      return {
        message:
          responseData?.message ||
          `Too many attempts. Please try again in ${retryMessage}.`,
        code: "RATE_LIMIT_EXCEEDED",
        statusCode: 429,
      };

    case 500:
    case 502:
    case 503:
    case 504:
      // Server errors
      return {
        message:
          "Our servers are currently experiencing issues. Please try again in a few moments.",
        code: "SERVER_ERROR",
        statusCode: status,
      };

    default:
      // Unknown error
      return {
        message:
          responseData?.message ||
          "Something went wrong. Please try again or contact support if the issue persists.",
        code: "UNKNOWN_ERROR",
        statusCode: status,
      };
  }
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: any): string {
  const apiError = handleApiError(error);
  return apiError.message;
}

/**
 * Check if error is a network/connectivity issue
 */
export function isNetworkError(error: any): boolean {
  if (!error.response) {
    return (
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      error.message?.includes("Network Error") ||
      error.message?.includes("timeout")
    );
  }
  return false;
}

/**
 * Check if error is a server error (5xx)
 */
export function isServerError(error: any): boolean {
  const status = error.response?.status;
  return status >= 500 && status < 600;
}

/**
 * Check if error is a client error (4xx)
 */
export function isClientError(error: any): boolean {
  const status = error.response?.status;
  return status >= 400 && status < 500;
}


