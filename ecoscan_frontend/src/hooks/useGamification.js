import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { fetchProductHistory } from "../api/productApi";
import { getLocalHistoryWithLimit } from "../utils/localHistoryUtils";
import { computeGamification } from "../utils/gamificationUtils";

/**
 * Fetches the full product history and derives gamification stats.
 */
export function useGamification() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);  // start true — fetch on mount
  const [error, setError] = useState("");

  const auth = useAuth();

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      let history = [];
      
      if (auth?.user?.id) {
        // Logged in: fetch from DB
        history = await fetchProductHistory(200, auth?.user?.id);
      } else {
        // Not logged in: fetch from localStorage
        history = getLocalHistoryWithLimit(200);
      }

      if (!cancelled) {
        setStats(computeGamification(Array.isArray(history) ? history : []));
        setLoading(false);
      }
    };

    loadStats().catch((err) => {
      if (!cancelled) {
        setError(err.message || "Failed to load gamification data.");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [auth?.user?.id]);

  return { stats, loading, error };
}
