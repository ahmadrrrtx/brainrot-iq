// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Graceful handling if env vars missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found. Leaderboard features will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          'x-application-name': 'brainrot-iq',
        },
      },
    })
  : null;

// Database operations with error handling
export const db = {
  // Submit score to leaderboard
  async submitScore({ name, score, total, difficulty, timeTaken, tier }) {
    if (!supabase) return { data: null, error: 'Supabase not configured' };
    
    try {
      const { data, error } = await supabase
        .from('scores')
        .insert([{
          name: name.trim().substring(0, 20), // Max 20 chars
          score,
          total,
          difficulty,
          time_taken: timeTaken,
          tier,
          percentage: Math.round((score / total) * 100),
          created_at: new Date().toISOString(),
        }])
        .select();
      
      return { data, error };
    } catch (err) {
      console.error('Error submitting score:', err);
      return { data: null, error: err.message };
    }
  },

  // Get leaderboard
  async getLeaderboard({ limit = 100, difficulty = null } = {}) {
    if (!supabase) return { data: [], error: null };
    
    try {
      let query = supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true })
        .limit(limit);
      
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      
      const { data, error } = await query;
      return { data: data || [], error };
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return { data: [], error: err.message };
    }
  },

  // Get stats
  async getStats() {
    if (!supabase) return { data: null, error: null };
    
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('score, total, difficulty')
        .limit(1000);
      
      if (error || !data) return { data: null, error };
      
      const stats = {
        totalPlayers: data.length,
        averageScore: data.reduce((acc, s) => acc + (s.score / s.total * 100), 0) / data.length,
        highestScore: Math.max(...data.map(s => s.score)),
      };
      
      return { data: stats, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

export default supabase;
