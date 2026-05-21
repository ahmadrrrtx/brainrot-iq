// src/pages/Leaderboard.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { formatDate, truncateName, storage } from '../utils';

const MEDALS = ['🥇', '🥈', '🥉'];
const DIFFICULTY_COLORS = {
  easy: 'text-green-400 bg-green-500/10 border-green-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const playerName = storage.get('playerName', '');
  const { data, stats, loading, error, filter, changeFilter, refresh, isEmpty } = useLeaderboard();

  return (
    <div className="min-h-screen bg-[#0a0a14] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-black text-white">🏆 Leaderboard</h1>
            <p className="text-gray-500 text-sm">Global rankings</p>
          </div>
          <button
            onClick={refresh}
            className="ml-auto text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total Players', value: stats.totalPlayers?.toLocaleString() || '0', emoji: '👥' },
              { label: 'Avg Score', value: `${Math.round(stats.averageScore || 0)}%`, emoji: '📊' },
              { label: 'Top Score', value: `${stats.highestScore || 0}/10`, emoji: '🏆' },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl mb-0.5">{emoji}</div>
                <div className="text-lg font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1">
          {['all', 'easy', 'medium', 'hard'].map(f => (
            <button
              key={f}
              onClick={() => changeFilter(f)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f === 'all' ? '🌐 All' : f === 'easy' ? '😎 Easy' : f === 'medium' ? '🔥 Medium' : '🧠 Hard'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">😵</div>
            <p className="text-gray-400 mb-4">{error}</p>
            <button onClick={refresh} className="text-violet-400 hover:text-violet-300">
              Try again
            </button>
          </div>
        )}

        {isEmpty && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🏜️</div>
            <p className="text-gray-400">No scores yet. Be the first!</p>
            <button
              onClick={() => navigate('/quiz')}
              className="mt-4 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold"
            >
              Take Quiz
            </button>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="space-y-2">
            {data.map((entry, index) => {
              const isCurrentPlayer = entry.name === playerName;
              const rank = index + 1;
              
              return (
                <motion.div
                  key={entry.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5) }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isCurrentPlayer
                      ? 'bg-violet-600/15 border-violet-500/40'
                      : rank <= 3
                      ? 'bg-white/5 border-white/15'
                      : 'bg-white/3 border-white/5'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center flex-shrink-0">
                    {rank <= 3 ? (
                      <span className="text-xl">{MEDALS[rank - 1]}</span>
                    ) : (
                      <span className="text-gray-500 font-bold text-sm">#{rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isCurrentPlayer
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {entry.name?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Name & Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold truncate ${isCurrentPlayer ? 'text-violet-300' : 'text-white'}`}>
                        {truncateName(entry.name)}
                      </span>
                      {isCurrentPlayer && (
                        <span className="text-xs bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-full flex-shrink-0">you</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded border capitalize ${DIFFICULTY_COLORS[entry.difficulty] || 'text-gray-500'}`}>
                        {entry.difficulty || 'unknown'}
                      </span>
                      <span className="text-xs text-gray-600">{formatDate(entry.created_at)}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-bold">{entry.score}/{entry.total}</div>
                    <div className="text-xs text-gray-500">{entry.percentage || Math.round((entry.score/entry.total)*100)}%</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/quiz')}
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl"
          >
            🧠 Take Quiz to Rank Up
          </button>
        </div>
      </div>
    </div>
  );
}
