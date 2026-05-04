/**
 * Local history storage for users not logged in
 * Stores product analysis history in localStorage
 */

const LOCAL_HISTORY_KEY = "ecoscan_local_history";
const MAX_LOCAL_ITEMS = 50;

/**
 * Get all local history items
 */
export function getLocalHistory() {
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to get local history:", err);
    return [];
  }
}

/**
 * Add a product analysis to local history
 */
export function addToLocalHistory(item) {
  try {
    const history = getLocalHistory();
    // Add new item at the beginning
    const newItem = {
      id: item.id || Date.now(),
      productId: item.id || Date.now(), // For ReportHistory
      productName: item.productName || item.name || "Unknown",
      category: item.category || "Uncategorized",
      ecoScore: item.ecoScore || 0,
      carbonFootprint: item.carbonFootprint || 0,
      overallSustainabilityScore: item.overallSustainabilityScore || 0,
      createdAt: item.createdAt || new Date().toISOString(),
      price: item.price,
      weight: item.weight,
      material: item.material,
      transportDistance: item.transportDistance,
      shadowCost: item.shadowCost,
      water: item.water,
      energy: item.energy,
      transport: item.transport,
      recyclingScore: item.recyclingScore,
      description: item.description,
    };
    history.unshift(newItem);
    // Keep only last 50 items
    const trimmed = history.slice(0, MAX_LOCAL_ITEMS);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(trimmed));
    return newItem;
  } catch (err) {
    console.error("Failed to add to local history:", err);
  }
}

/**
 * Get local history with limit
 */
export function getLocalHistoryWithLimit(limit = 30) {
  try {
    const history = getLocalHistory();
    return history.slice(0, limit);
  } catch (err) {
    console.error("Failed to get local history with limit:", err);
    return [];
  }
}

/**
 * Clear all local history
 */
export function clearLocalHistory() {
  try {
    localStorage.removeItem(LOCAL_HISTORY_KEY);
  } catch (err) {
    console.error("Failed to clear local history:", err);
  }
}

/**
 * Get item by id from local history
 */
export function getLocalHistoryById(id) {
  try {
    const history = getLocalHistory();
    return history.find((item) => item.productId === id || item.id === id);
  } catch (err) {
    console.error("Failed to get local history item:", err);
    return null;
  }
}
