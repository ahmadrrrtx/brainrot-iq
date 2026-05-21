import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";
import { LEADERBOARD_CONFIG } from "../constants";

export const useLeaderboard = (autoFetch = true) => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(LEADERBOARD_CONFIG.limit);

      if (err) throw err;
      setEntries(data || []);
      setLastUpdated(new Date());
    } catch (e) {
      setError("Failed to load leaderboard. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitScore = useCallback(async ({ name, score, level, emoji }) => {
    try {
      const { error: err } = await supabase.from("scores").insert([
        {
          name: name.trim().slice(0, 20),
          score,
          level,
          emoji,
          created_at: new Date().toISOString(),
        },
      ]);
      if (err) throw err;
      await fetchLeaderboard();
      return true;
    } catch (e) {
      console.error("Score submit error:", e);
      return false;
    }
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (!autoFetch) return;
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, LEADERBOARD_CONFIG.refreshInterval);
    return () => clearInterval(interval);
  }, [autoFetch, fetchLeaderboard]);

  return {
    entries,
    isLoading,
    error,
    lastUpdated,
    fetchLeaderboard,
    submitScore,
    topThree: entries.slice(0, 3),
    userRank: null,
  };
};
