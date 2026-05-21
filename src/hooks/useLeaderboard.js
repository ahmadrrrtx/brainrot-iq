// src/hooks/useLeaderboard.js
import { useState, useEffect, useCallback } from 'react';
import { db } from '../supabase';

export function useLeaderboard(autoFetch = true) {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filter, setFilter] = useState('all'); // all | easy | medium | hard

  const fetchLeaderboard = useCallback(async (difficulty = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: scores, error: fetchError } = await db.getLeaderboard({ 
        limit: 100,
        difficulty: difficulty === 'all' ? null : difficulty,
      });
      
      if (fetchError) {
        throw new Error(fetchError);
      }
      
      setData(scores || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data: statsData } = await db.getStats();
      if (statsData) setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchLeaderboard(filter === 'all' ? null : filter);
    fetchStats();
  }, [fetchLeaderboard, fetchStats, filter]);

  const changeFilter = useCallback((newFilter) => {
    setFilter(newFilter);
    fetchLeaderboard(newFilter === 'all' ? null : newFilter);
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (autoFetch) {
      fetchLeaderboard();
      fetchStats();
    }
  }, [autoFetch, fetchLeaderboard, fetchStats]);

  // Get rank of a specific player
  const getPlayerRank = useCallback((playerName) => {
    const index = data.findIndex(entry => entry.name === playerName);
    return index === -1 ? null : index + 1;
  }, [data]);

  return {
    data,
    stats,
    loading,
    error,
    lastUpdated,
    filter,
    fetchLeaderboard,
    refresh,
    changeFilter,
    getPlayerRank,
    isEmpty: !loading && data.length === 0,
  };
}
