/**
 * API Client Utilities
 * 
 * Provides helper functions for making authenticated API requests
 * with JWT token management.
 */

/**
 * Get authentication headers for API requests
 * Automatically includes JWT token if available
 */
export function authHeaders() {
  const token = localStorage.getItem("ecoscan_token");
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Store JWT token in localStorage
 */
export function storeToken(token) {
  if (token) {
    localStorage.setItem("ecoscan_token", token);
  }
}

/**
 * Remove JWT token from localStorage
 */
export function clearToken() {
  localStorage.removeItem("ecoscan_token");
}

/**
 * Get stored JWT token
 */
export function getToken() {
  return localStorage.getItem("ecoscan_token");
}
