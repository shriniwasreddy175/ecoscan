/**
 * Local history storage for users not logged in
 * Stores product analysis history in localStorage
 */

const LOCAL_HISTORY_KEY = "ecoscan_local_history";
const MAX_LOCAL_ITEMS = 50;

function toNumericId(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getCurrentItemId(item) {
  return toNumericId(item?.productId) ?? toNumericId(item?.id);
}

export function getNextLocalHistoryId(history = getLocalHistory()) {
  const currentMax = history.reduce((max, item) => {
    const itemId = getCurrentItemId(item);
    return itemId !== null ? Math.max(max, itemId) : max;
  }, 0);

  return currentMax + 1;
}

export function normalizeLocalHistoryItem(item) {
  const productId = toNumericId(item?.productId) ?? toNumericId(item?.id) ?? getNextLocalHistoryId();
  const productName = item?.productName ?? item?.name ?? "Unknown";

  return {
    id: item?.id ?? productId,
    productId,
    productName,
    name: item?.name ?? productName,
    category: item?.category ?? "Uncategorized",
    price: item?.price,
    weight: item?.weight,
    material: item?.material,
    transportDistance: item?.transportDistance,
    description: item?.description,
    ecoScore: item?.ecoScore ?? 0,
    carbonFootprint: item?.carbonFootprint ?? 0,
    overallSustainabilityScore: item?.overallSustainabilityScore ?? 0,
    shadowCost: item?.shadowCost ?? 0,
    waterFootprint: item?.waterFootprint ?? item?.water ?? 0,
    water: item?.water ?? item?.waterFootprint ?? 0,
    energyConsumption: item?.energyConsumption ?? item?.energy ?? 0,
    energy: item?.energy ?? item?.energyConsumption ?? 0,
    transportEmission: item?.transportEmission ?? item?.transport ?? 0,
    transport: item?.transport ?? item?.transportEmission ?? 0,
    recyclingScore: item?.recyclingScore ?? 0,
    sdg12Impact: item?.sdg12Impact ?? "Responsible Consumption",
    sdg13Impact: item?.sdg13Impact ?? "Moderate Impact",
    sdg9Impact: item?.sdg9Impact ?? "Efficient Industry",
    createdAt: item?.createdAt ?? new Date().toISOString(),
  };
}

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
    const nextId = getNextLocalHistoryId(history);
    const newItem = normalizeLocalHistoryItem({
      ...item,
      id: nextId,
      productId: nextId,
    });
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
    const numericId = toNumericId(id);
    return history.find(
      (item) =>
        item.productId === id ||
        item.id === id ||
        (numericId !== null && (toNumericId(item.productId) === numericId || toNumericId(item.id) === numericId))
    );
  } catch (err) {
    console.error("Failed to get local history item:", err);
    return null;
  }
}

/**
 * Delete a single local history item by id
 */
export function deleteLocalHistoryItem(id) {
  try {
    const history = getLocalHistory();
    const numericId = toNumericId(id);
    const nextHistory = history.filter((item) => {
      const itemId = getCurrentItemId(item);
      if (numericId !== null) return itemId !== numericId;
      return item.productId !== id && item.id !== id;
    });

    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(nextHistory));
    return nextHistory;
  } catch (err) {
    console.error("Failed to delete local history item:", err);
    return [];
  }
}
