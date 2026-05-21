// src/pages/Leaderboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { formatDate, truncateName, storage } from '../utils';

const MEDALS = ['🥇', '🥈', '🥉'];

const DIFF_STYLE = {
  easy: 'text-green-400 bg-green-500/10 border-green-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const playerName = storage.get('playerName', '');
  const { data, stats, loading, error, filter, changeFilter, refresh, isEmpty } = useLeaderboard(true);

  useEffect(() => {
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div className="min-h-screen bg-[#07070f] px-4 py-8">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-800/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">🏆 Leaderboard</h1>
            <p className="text-gray-600 text-xs">Global rankings · Updates live</p>
          </div>
          <button
            onClick={refresh}
            className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            ↻
          </button>
        </div>

        {/* ── Stats ── */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            {[
              { emoji: '👥', label: 'Players', value: stats.totalPlayers?.toLocaleString() || '0' },
              { emoji: '📊', label: 'Avg Score', value: `${Math.round(stats.averageScore || 0)}%` },
              { emoji: '🏆', label: 'Top Score', value: `${stats.highestScore || 0}/10` },
            ].map(({ emoji, label, value }) => (
              <div key={label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-lg font-black text-white">{value}</div>
                <div className="text-xs text-gray-600">{label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Filter Tabs ── */}
        <div className="flex gap-1.5 mb-6 bg-white/[0.03] border border-white/8 rounded-2xl p-1.5">
          {[
            { key: 'all', label: '🌐 All' },
            { key: 'easy', label: '😎 Easy' },
            { key: 'medium', label: '🔥 Medium' },
            { key: 'hard', label: '🧠 Hard' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => changeFilter(key)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === key
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                  : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading && (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl h-16 animate-pulse" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">😵</div>
            <p className="text-gray-500 mb-4 text-sm">{error}</p>
            <button onClick={refresh} className="text-violet-400 hover:text-violet-300 text-sm font-semibold">
              Try again
            </button>
          </div>
        )}

        {isEmpty && !loading && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏜️</div>
            <p className="text-gray-400 font-semibold mb-2">No scores yet!</p>
            <p className="text-gray-600 text-sm mb-6">Be the first on the leaderboard</p>
            <button
              onClick={() => navigate('/quiz')}
              className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl text-sm hover:bg-violet-500 transition-colors"
            >
              Take Quiz Now
            </button>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="space-y-2">
            {data.map((entry, index) => {
              const isCurrentPlayer = entry.name === playerName;
              const rank = index + 1;
              const pct = entry.percentage || Math.round((entry.score / entry.total) * 100);

              return (
                <motion.div
                  key={entry.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.6) }}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
                    isCurrentPlayer
                      ? 'bg-violet-600/12 border-violet-500/30'
                      : rank <= 3
                      ? 'bg-white/[0.04] border-white/12'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center flex-shrink-0">
                    {rank <= 3 ? (
                      <span className="text-xl">{MEDALS[rank - 1]}</span>
                    ) : (
                      <span className="text-gray-600 font-black text-xs">#{rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    isCurrentPlayer
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                      : 'bg-white/8 text-gray-400'
                  }`}>
                    {entry.name?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm truncate ${isCurrentPlayer ? 'text-violet-300' : 'text-white'}`}>
                        {truncateName(entry.name)}
                      </span>
                      {isCurrentPlayer && (
                        <span className="text-xs bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-lg font-semibold flex-shrink-0">
                          you
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-2 py-0.5 rounded-lg border capitalize ${DIFF_STYLE[entry.difficulty] || 'text-gray-500 bg-white/5 border-white/10'}`}>
                        {entry.difficulty || '—'}
                      </span>
                      <span className="text-xs text-gray-700">{formatDate(entry.created_at)}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-black text-sm">{entry.score}/{entry.total}</div>
                    <div className="text-gray-600 text-xs">{pct}%</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-8 text-center pb-8">
          <button
            onClick={() => navigate('/quiz')}
            className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-900/30"
          >
            🧠 Take Quiz to Rank Up
          </button>
        </div>
      </div>
    </div>
  );
}
