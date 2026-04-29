const BASE_URL = "http://localhost:8181/ecoscan/api/products";

export const analyzeProduct = async (product) => {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to analyze product");
  }

  return response.json();
};

export const fetchProductHistory = async (limit = 30) => {
  const response = await fetch(`${BASE_URL}/history?limit=${limit}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch product history");
  }
  return response.json();
};

export const fetchProductReportById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/report`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch report by product ID");
  }
  return response.json();
};