const BASE_URL = "http://localhost:8181/ecoscan/api/products";

export const analyzeProduct = async (product) => {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return response.json();
};