import { getLocalHistoryById } from "../utils/localHistoryUtils";

const BASE_URL = "http://localhost:8181/ecoscan/api/products";

export const analyzeProduct = async (product, userId = null) => {
  let url = `${BASE_URL}/analyze`;
  if (userId) url += `?userId=${encodeURIComponent(userId)}`;
  const response = await fetch(url, {
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

export const fetchProductHistory = async (limit = 30, userId = null) => {
  let url = `${BASE_URL}/history?limit=${limit}`;
  if (userId) url += `&userId=${encodeURIComponent(userId)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch product history");
  }
  return response.json();
};

export const fetchProductReportById = async (id, userId = null) => {
  // Try to get from local storage first if no userId
  if (!userId) {
    const localItem = getLocalHistoryById(id);
    if (localItem) {
      // Return a full local report using the same field names as the backend
      return Promise.resolve({
        productId: localItem.productId ?? localItem.id,
        productName: localItem.productName || localItem.name,
        carbonFootprint: localItem.carbonFootprint,
        shadowCost: localItem.shadowCost,
        ecoScore: localItem.ecoScore,
        waterFootprint: localItem.waterFootprint ?? localItem.water,
        energyConsumption: localItem.energyConsumption ?? localItem.energy,
        transportEmission: localItem.transportEmission ?? localItem.transport,
        recyclingScore: localItem.recyclingScore,
        overallSustainabilityScore: localItem.overallSustainabilityScore,
        sdg12Impact: localItem.sdg12Impact || "Responsible Consumption",
        sdg13Impact: localItem.sdg13Impact || "Moderate Impact",
        sdg9Impact: localItem.sdg9Impact || "Efficient Industry",
      });
    }
  }
  
  const response = await fetch(`${BASE_URL}/${id}/report`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch report by product ID");
  }
  return response.json();
};