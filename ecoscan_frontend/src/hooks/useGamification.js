import { useEffect, useState } from "react";
import { fetchProductHistory } from "../api/productApi";
import { computeGamification } from "../utils/gamificationUtils";

/**
 * Fetches the full product history and derives gamification stats.
 */
export function useGamification() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);  // start true — fetch on mount
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchProductHistory(200)
      .then((history) => {
        if (!cancelled) {
          setStats(computeGamification(Array.isArray(history) ? history : []));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load gamification data.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
}
