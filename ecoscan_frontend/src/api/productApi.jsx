import { authHeaders } from "./apiClient";
import { getLocalHistoryById } from "../utils/localHistoryUtils";

const BASE_URL = "http://localhost:8181/ecoscan/api/products";

/**
 * Analyze a product. When the user is authenticated, the JWT token
 * in the Authorization header identifies the user on the backend —
 * no userId query param needed.
 */
export const analyzeProduct = async (product) => {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to analyze product");
  }

  return response.json();
};

/**
 * Fetch product history. The backend resolves the user from the JWT token.
 */
export const fetchProductHistory = async (limit = 30) => {
  const response = await fetch(`${BASE_URL}/history?limit=${limit}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch product history");
  }
  return response.json();
};

/**
 * Fetch a single product report by ID.
 * Falls back to local history for guest users.
 */
export const fetchProductReportById = async (id, isGuest = false) => {
  if (isGuest) {
    const localItem = getLocalHistoryById(id);
    if (localItem) {
      return Promise.resolve(localItem);
    }
  }

  const response = await fetch(`${BASE_URL}/${id}/report`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch report by product ID");
  }
  return response.json();
};
