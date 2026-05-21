// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.warn('Supabase init failed:', err.message);
  }
} else {
  console.warn('Supabase env vars missing - leaderboard disabled');
}

export const supabase = supabaseClient;

export const db = {
  async submitScore({ name, score, total, difficulty, timeTaken, tier }) {
    if (!supabaseClient) return { data: null, error: 'Supabase not configured' };
    try {
      const { data, error } = await supabaseClient
        .from('scores')
        .insert([{
          name: String(name).trim().substring(0, 20),
          score: Number(score),
          total: Number(total),
          difficulty: String(difficulty),
          time_taken: Number(timeTaken),
          tier: String(tier),
          percentage: Math.round((score / total) * 100),
          created_at: new Date().toISOString(),
        }])
        .select();
      return { data, error };
    } catch (err) {
      console.error('submitScore error:', err);
      return { data: null, error: err.message };
    }
  },

  async getLeaderboard({ limit = 100, difficulty = null } = {}) {
    if (!supabaseClient) return { data: [], error: null };
    try {
      let query = supabaseClient
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true })
        .limit(limit);
      if (difficulty) query = query.eq('difficulty', difficulty);
      const { data, error } = await query;
      return { data: data || [], error };
    } catch (err) {
      console.error('getLeaderboard error:', err);
      return { data: [], error: err.message };
    }
  },

  async getStats() {
    if (!supabaseClient) return { data: null, error: null };
    try {
      const { data, error } = await supabaseClient
        .from('scores')
        .select('score, total, difficulty')
        .limit(1000);
      if (error || !data) return { data: null, error };
      return {
        data: {
          totalPlayers: data.length,
          averageScore: data.length > 0
            ? data.reduce((acc, s) => acc + (s.score / s.total * 100), 0) / data.length
            : 0,
          highestScore: data.length > 0 ? Math.max(...data.map(s => s.score)) : 0,
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

export default supabaseClient;
