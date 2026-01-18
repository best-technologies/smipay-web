/**
 * Token and user storage utilities
 * Uses localStorage for persistence with activity tracking
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
const LAST_ACTIVITY_KEY = "smipay-last-activity";
const TOKEN_EXPIRY_KEY = "smipay-token-expiry";

// Session timeout: 10 minutes of inactivity (fintech security standard)
export const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
// Warning before timeout: 2 minutes before expiry
export const SESSION_WARNING_TIME = 2 * 60 * 1000; // 2 minutes in milliseconds

/**
 * Save authentication token
 * Saves to both localStorage and cookies for middleware access
 */
export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    const now = Date.now();
    const expiryTime = now + SESSION_TIMEOUT;
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    
    // Set cookie with short expiry (10 minutes to match session)
    const expiryDate = new Date(expiryTime);
    document.cookie = `${TOKEN_KEY}=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
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
 * Removes from both localStorage and cookies
 */
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    
    // Also remove cookie
    document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
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
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
  if (typeof window !== "undefined") {
    const now = Date.now();
    const expiryTime = now + SESSION_TIMEOUT;
    
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    
    // Update cookie expiry
    const token = getToken();
    if (token) {
      const expiryDate = new Date(expiryTime);
      document.cookie = `${TOKEN_KEY}=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
    }
  }
}

/**
 * Get last activity timestamp
 */
export function getLastActivity(): number | null {
  if (typeof window !== "undefined") {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    return lastActivity ? parseInt(lastActivity, 10) : null;
  }
  return null;
}

/**
 * Get token expiry time
 */
export function getTokenExpiry(): number | null {
  if (typeof window !== "undefined") {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  }
  return null;
}

/**
 * Check if session has expired
 */
export function isSessionExpired(): boolean {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  
  return Date.now() > expiry;
}

/**
 * Get time until session expires (in milliseconds)
 */
export function getTimeUntilExpiry(): number {
  const expiry = getTokenExpiry();
  if (!expiry) return 0;
  
  return Math.max(0, expiry - Date.now());
}

/**
 * Check if user is authenticated and session is valid
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  
  // Check if session has expired
  if (isSessionExpired()) {
    clearAuth();
    return false;
  }
  
  return true;
}

