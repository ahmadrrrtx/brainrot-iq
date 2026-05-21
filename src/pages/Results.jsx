// src/pages/Results.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { getIQTier } from '../constants';
import { storage, formatTime, getTwitterShareUrl, getWhatsAppShareUrl, shareResult } from '../utils';

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const savedResults = storage.get('lastResults');
    if (!savedResults) {
      navigate('/');
      return;
    }
    setResults(savedResults);
    
    // Show confetti for good scores
    if (savedResults.correctCount >= 7) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  if (!results) return null;

  const tier = getIQTier(results.correctCount, results.totalQuestions);
  const percentage = Math.round((results.correctCount / results.totalQuestions) * 100);

  const handleShare = async (method) => {
    if (method === 'copy') {
      const result = await shareResult({ 
        score: results.correctCount, 
        total: results.totalQuestions, 
        tier, 
        difficulty: results.difficulty 
      });
      setShareStatus(result.success ? 'Copied to clipboard! 📋' : 'Share failed');
      setTimeout(() => setShareStatus(''), 3000);
    } else if (method === 'twitter') {
      window.open(getTwitterShareUrl({ score: results.correctCount, total: results.totalQuestions, tier }), '_blank');
    } else if (method === 'whatsapp') {
      window.open(getWhatsAppShareUrl({ score: results.correctCount, total: results.totalQuestions, tier }), '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] px-4 py-8 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#7c3aed', '#9f67fa', '#c084fc', '#e879f9', '#f0abfc']}
        />
      )}

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        
        {/* Result Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="text-8xl mb-4"
          >
            {tier.emoji}
          </motion.div>
          
          <h1 className="text-4xl font-black text-white mb-2">{tier.label}</h1>
          <p className="text-gray-400 mb-4">{tier.description}</p>
          
          {/* Score Display */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-8 py-4">
            <span className="text-5xl font-black text-white">{results.correctCount}</span>
            <span className="text-gray-600 text-2xl">/</span>
            <span className="text-2xl font-bold text-gray-400">{results.totalQuestions}</span>
            <span className="text-violet-400 text-lg font-bold ml-1">({percentage}%)</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: 'Accuracy', value: `${percentage}%`, emoji: '🎯' },
            { label: 'Best Streak', value: `${results.maxStreak}x`, emoji: '🔥' },
            { label: 'Time', value: formatTime(results.totalTimeTaken || 0), emoji: '⏱️' },
          ].map(({ label, value, emoji }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* AI Verdict */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-violet-900/20 border border-violet-500/20 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="text-violet-400 font-bold mb-1">AI Verdict</h3>
              <p className="text-gray-300 leading-relaxed">{tier.advice}</p>
            </div>
          </div>
        </motion.div>

        {/* Question Review */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider text-gray-400">Review Your Answers</h3>
          <div className="space-y-2">
            {results.questionResults?.map((result, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-xl border ${
                  result.isCorrect
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {result.isCorrect ? '✅' : '❌'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm font-medium leading-tight truncate">
                    {result.question}
                  </p>
                  {!result.isCorrect && (
                    <p className="text-green-400 text-xs mt-0.5">
                      ✓ {result.correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Share Section */}
        {shareStatus && (
          <div className="text-center text-violet-400 text-sm mb-4 font-medium">
            {shareStatus}
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <p className="text-center text-gray-500 text-sm mb-2">Share your result</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => handleShare('copy')}
              className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium rounded-xl transition-colors"
            >
              📋 Copy
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="py-2.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/20 text-sky-400 text-sm font-medium rounded-xl transition-colors"
            >
              𝕏 Twitter
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="py-2.5 bg-green-500/15 hover:bg-green-500/25 border border-green-500/20 text-green-400 text-sm font-medium rounded-xl transition-colors"
            >
              💬 WhatsApp
            </button>
          </div>

          <button
            onClick={() => navigate('/quiz')}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl"
          >
            🔄 Play Again
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/leaderboard')}
              className="py-3 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl text-sm"
            >
              🏆 Leaderboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="py-3 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl text-sm"
            >
              🏠 Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
