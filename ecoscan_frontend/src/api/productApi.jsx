import { authHeaders } from "./apiClient";
import { getLocalHistoryById } from "../utils/localHistoryUtils";
import { API_BASE_URL } from "../config/api";

const BASE_URL = `${API_BASE_URL}/ecoscan/api/products`;

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

/**
 * Lookup a product by barcode.
 * Returns a ScannedProductDTO or null (404).
 */
export const lookupByBarcode = async (barcode) => {
  const response = await fetch(
    `${BASE_URL}/lookup?barcode=${encodeURIComponent(barcode)}`
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Barcode lookup failed");
  }
  return response.json();
};

/**
 * Search products by name.
 * Returns an array of ScannedProductDTO (may be empty).
 */
export const searchProductsByName = async (name) => {
  const response = await fetch(
    `${BASE_URL}/lookup?name=${encodeURIComponent(name)}`
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Product name search failed");
  }
  return response.json();
};
