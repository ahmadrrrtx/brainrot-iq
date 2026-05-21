// src/pages/Landing.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../utils';
import { QUIZ_CONFIG } from '../constants';

const FLOATING_EMOJIS = ['🧠', '🔥', '💀', '✨', '🚀', '👑', '⚡', '🎯', '💯', '🤯'];

const TICKER_ITEMS = [
  '🧠 Test your brainrot IQ',
  '🔥 New AI questions every time',
  '💀 No cap, this quiz hits different',
  '✨ Understood the assignment?',
  '🚀 Sigma grindset activated',
  '👑 Only true chronically online players pass',
  '⚡ Are you NPC or main character?',
];

export default function Landing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [nameError, setNameError] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);
  const savedName = storage.get('playerName', '');

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % TICKER_ITEMS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    const playerName = savedName || name;
    if (!playerName.trim() || playerName.trim().length < 2) {
      setNameError('Enter your name (min 2 chars)');
      return;
    }
    storage.set('playerName', playerName.trim());
    navigate(`/quiz?difficulty=${difficulty}`);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (val.trim().length >= 2) setNameError('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Floating emojis */}
        {FLOATING_EMOJIS.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl select-none pointer-events-none"
            style={{
              left: `${5 + (i * 10) % 90}%`,
              top: `${10 + (i * 13) % 80}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [-10, 10, -10],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Ticker */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-violet-600/90 backdrop-blur-sm overflow-hidden h-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={tickerIndex}
            className="text-white text-sm font-medium w-full text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {TICKER_ITEMS[tickerIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-violet-300 text-sm font-medium">AI-Powered • Free • No Signup</span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-4 leading-none">
            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              BrainRot
            </span>
            <span className="block text-white">
              IQ
              <span className="text-violet-400">.</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg sm:text-xl max-w-lg mx-auto leading-relaxed">
            How <span className="text-violet-400 font-semibold">chronically online</span> are you?
            <br />
            AI-generated questions. No cap.
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-6 mt-6">
            {[
              { value: '10', label: 'Questions' },
              { value: '3', label: 'Difficulties' },
              { value: '∞', label: 'Unique Quizzes' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quiz Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            
            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Your Name
              </label>
              {savedName ? (
                <div className="flex items-center justify-between bg-violet-600/20 border border-violet-500/40 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {savedName[0]?.toUpperCase()}
                    </div>
                    <span className="text-white font-semibold">{savedName}</span>
                  </div>
                  <button
                    onClick={() => { storage.remove('playerName'); window.location.reload(); }}
                    className="text-gray-400 hover:text-white text-xs transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    placeholder="Enter your name..."
                    maxLength={20}
                    className={`w-full bg-white/5 border ${nameError ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 transition-colors`}
                  />
                  {nameError && (
                    <p className="text-red-400 text-xs mt-1">{nameError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Difficulty Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Difficulty
              </label>
              <div className="space-y-2">
                {Object.entries(QUIZ_CONFIG.difficulties).map(([key, diff]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      difficulty === key
                        ? 'border-violet-500/60 bg-violet-600/20 text-white'
                        : 'border-white/5 bg-white/3 text-gray-400 hover:border-white/15 hover:text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{diff.label.split(' ')[0]}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-sm">{diff.label.split(' ').slice(1).join(' ')}</div>
                      <div className="text-xs text-gray-500">{diff.description}</div>
                    </div>
                    {difficulty === key && (
                      <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-violet-900/40"
            >
              🧠 Start Quiz
            </motion.button>

            {/* Navigation Links */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => navigate('/leaderboard')}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors flex items-center gap-1"
              >
                🏆 Leaderboard
              </button>
              {savedName && (
                <button
                  onClick={() => navigate('/profile')}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors flex items-center gap-1"
                >
                  👤 Profile
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2 mt-8 px-4"
        >
          {[
            '🤖 AI Questions',
            '⏱️ 20s Timer',
            '🏆 Global Leaderboard',
            '📊 Instant Results',
            '🔥 Streak Bonuses',
            '📱 Mobile Friendly',
          ].map(item => (
            <span
              key={item}
              className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </motion.div>

        {/* Bottom padding */}
        <div className="h-16" />
      </div>
    </div>
  );
}
