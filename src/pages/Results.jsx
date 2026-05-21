// src/pages/Results.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { getIQTier } from '../constants';
import { storage, formatTime, getTwitterShareUrl, getWhatsAppShareUrl, shareResult } from '../utils';

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const saved = storage.get('lastResults');
    if (!saved) { navigate('/'); return; }
    setResults(saved);
    if (saved.correctCount >= 7) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [navigate]);

  if (!results) return null;

  const tier = getIQTier(results.correctCount, results.totalQuestions);
  const percentage = Math.round((results.correctCount / results.totalQuestions) * 100);

  const handleShare = async (method) => {
    if (method === 'copy') {
      const res = await shareResult({ score: results.correctCount, total: results.totalQuestions, tier, difficulty: results.difficulty });
      setShareStatus(res.success ? '📋 Copied to clipboard!' : 'Share failed');
      setTimeout(() => setShareStatus(''), 3000);
    } else if (method === 'twitter') {
      window.open(getTwitterShareUrl({ score: results.correctCount, total: results.totalQuestions, tier }), '_blank');
    } else if (method === 'whatsapp') {
      window.open(getWhatsAppShareUrl({ score: results.correctCount, total: results.totalQuestions, tier }), '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#07070f] px-4 py-8 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={250}
          colors={['#7c3aed', '#9f67fa', '#c084fc', '#e879f9', '#f472b6', '#fb923c']}
        />
      )}

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto">

        {/* ── Result Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="text-8xl mb-5"
          >
            {tier.emoji}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-3">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Your Tier</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-1">{tier.label}</h1>
            <p className="text-gray-500 mb-5">{tier.description}</p>

            {/* Score display */}
            <div className="inline-flex items-baseline gap-1 bg-white/[0.04] border border-white/10 rounded-2xl px-8 py-4">
              <span className="text-6xl font-black text-white">{results.correctCount}</span>
              <span className="text-gray-600 text-3xl">/</span>
              <span className="text-2xl font-bold text-gray-500">{results.totalQuestions}</span>
              <span className="text-violet-400 text-xl font-black ml-1">({percentage}%)</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-5"
        >
          {[
            { emoji: '🎯', label: 'Accuracy', value: `${percentage}%` },
            { emoji: '🔥', label: 'Best Streak', value: `${results.maxStreak || 0}x` },
            { emoji: '⏱️', label: 'Total Time', value: formatTime(results.totalTimeTaken || 0) },
          ].map(({ emoji, label, value }) => (
            <div key={label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-xl font-black text-white">{value}</div>
              <div className="text-xs text-gray-600 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Difficulty Badge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex justify-center mb-5"
        >
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <span className="text-gray-500 text-sm">Difficulty:</span>
            <span className={`font-bold text-sm capitalize ${
              results.difficulty === 'hard' ? 'text-red-400' :
              results.difficulty === 'medium' ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {results.difficulty}
            </span>
            <span className="text-gray-600 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              Multiplier: ×{results.difficulty === 'hard' ? '2.0' : results.difficulty === 'medium' ? '1.5' : '1.0'}
            </span>
          </div>
        </motion.div>

        {/* ── AI Verdict ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-violet-900/20 border border-violet-500/20 rounded-2xl p-5 mb-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <div className="text-violet-400 font-bold text-sm mb-1">AI Verdict</div>
              <p className="text-gray-300 text-sm leading-relaxed">{tier.advice}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Share ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-5"
        >
          <AnimatePresence>
            {shareStatus && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-violet-400 text-sm mb-3 font-semibold"
              >
                {shareStatus}
              </motion.p>
            )}
          </AnimatePresence>

          <p className="text-center text-gray-600 text-xs uppercase tracking-widest mb-3">
            Flex on your friends
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { method: 'copy', label: '📋 Copy', style: 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300' },
              { method: 'twitter', label: '𝕏 Twitter', style: 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/20 text-sky-400' },
              { method: 'whatsapp', label: '💬 WhatsApp', style: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 text-green-400' },
            ].map(({ method, label, style }) => (
              <button
                key={method}
                onClick={() => handleShare(method)}
                className={`py-2.5 border rounded-xl text-sm font-semibold transition-all ${style}`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Question Review Toggle ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-5"
        >
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-left hover:bg-white/[0.05] transition-all"
          >
            <span className="text-white font-bold text-sm">Review Answers</span>
            <motion.span
              animate={{ rotate: showReview ? 180 : 0 }}
              className="text-gray-500"
            >
              ↓
            </motion.span>
          </button>

          <AnimatePresence>
            {showReview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mt-2">
                  {results.questionResults?.map((result, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                        result.isCorrect
                          ? 'bg-green-500/8 border-green-500/20'
                          : 'bg-red-500/8 border-red-500/20'
                      }`}
                    >
                      <span className="text-base flex-shrink-0 mt-0.5">
                        {result.isCorrect ? '✅' : '❌'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-xs font-medium leading-snug line-clamp-2">
                          {result.question}
                        </p>
                        {!result.isCorrect && (
                          <p className="text-green-400 text-xs mt-1 font-semibold">
                            ✓ {result.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="space-y-3 pb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/quiz?difficulty=${results.difficulty}`)}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-violet-900/30 hover:from-violet-500 hover:to-purple-500 transition-all"
          >
            🔄 Play Again
          </motion.button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/leaderboard')}
              className="py-3 bg-white/[0.04] border border-white/8 text-gray-300 font-semibold rounded-xl text-sm hover:bg-white/[0.08] transition-all"
            >
              🏆 Leaderboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="py-3 bg-white/[0.04] border border-white/8 text-gray-300 font-semibold rounded-xl text-sm hover:bg-white/[0.08] transition-all"
            >
              🏠 Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
