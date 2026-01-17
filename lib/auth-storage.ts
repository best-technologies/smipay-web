/**
 * Token and user storage utilities
 * Uses localStorage for persistence
 */

export interface User {
  id: string;
  email: string;
  phone_number: string;
  smipay_tag: string;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  account_status: string;
  wallet?: {
    current_balance: number;
    isActive: boolean;
  };
}

const TOKEN_KEY = "smipay-access-token";
const USER_KEY = "smipay-user";

/**
 * Save authentication token
 */
export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Get authentication token
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Remove authentication token
 */
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Save user data
 */
export function saveUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/**
 * Get user data
 */
export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Remove user data
 */
export function removeUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

/**
 * Clear all auth data
 */
export function clearAuth(): void {
  removeToken();
  removeUser();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

