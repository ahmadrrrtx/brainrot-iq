// src/pages/Landing.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../utils';
import { QUIZ_CONFIG } from '../constants';

const FLOATING_EMOJIS = [
  { emoji: '🧠', x: '8%', y: '15%', duration: 5 },
  { emoji: '🔥', x: '88%', y: '12%', duration: 6 },
  { emoji: '💀', x: '75%', y: '45%', duration: 4.5 },
  { emoji: '✨', x: '15%', y: '60%', duration: 7 },
  { emoji: '🚀', x: '90%', y: '70%', duration: 5.5 },
  { emoji: '👑', x: '5%', y: '82%', duration: 6.5 },
  { emoji: '⚡', x: '50%', y: '8%', duration: 4 },
  { emoji: '💯', x: '35%', y: '88%', duration: 5 },
  { emoji: '🎯', x: '65%', y: '82%', duration: 6 },
  { emoji: '🤯', x: '20%', y: '35%', duration: 7 },
];

const TICKER_ITEMS = [
  { text: 'Test your brainrot IQ', emoji: '🧠' },
  { text: 'AI-generated questions every time', emoji: '🤖' },
  { text: 'No cap, this quiz hits different', emoji: '💀' },
  { text: 'Understood the assignment?', emoji: '✨' },
  { text: 'Sigma grindset activated', emoji: '🐺' },
  { text: 'Are you NPC or main character?', emoji: '🎭' },
  { text: 'Only true chronically online players pass', emoji: '👑' },
];

const FEATURES = [
  {
    emoji: '🤖',
    title: 'AI-Powered',
    desc: 'Unique questions every single time using Groq LLaMA 3.3',
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/20',
  },
  {
    emoji: '⏱️',
    title: '20 Second Timer',
    desc: 'Answer fast for bonus points. Speed matters fr fr',
    color: 'from-orange-500/20 to-yellow-500/10',
    border: 'border-orange-500/20',
  },
  {
    emoji: '🏆',
    title: 'Global Leaderboard',
    desc: 'Compete with chronically online players worldwide',
    color: 'from-yellow-500/20 to-amber-500/10',
    border: 'border-yellow-500/20',
  },
  {
    emoji: '🔥',
    title: 'Streak Bonuses',
    desc: 'Chain correct answers for massive score multipliers',
    color: 'from-red-500/20 to-orange-500/10',
    border: 'border-red-500/20',
  },
  {
    emoji: '📊',
    title: 'Instant Results',
    desc: 'Get your brainrot IQ tier immediately after quiz',
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/20',
  },
  {
    emoji: '📱',
    title: 'Share Results',
    desc: 'Flex on your friends with one tap sharing',
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/20',
  },
];

const IQ_TIERS_PREVIEW = [
  { emoji: '🤖', label: 'NPC Mode', range: '0-10%', color: 'text-gray-400' },
  { emoji: '📱', label: 'Casual Scroller', range: '11-35%', color: 'text-blue-400' },
  { emoji: '⚡', label: 'Chronically Online', range: '36-65%', color: 'text-yellow-400' },
  { emoji: '🧠', label: 'Certified Brainrot', range: '66-80%', color: 'text-orange-400' },
  { emoji: '👑', label: 'Sigma Grindset', range: '81-90%', color: 'text-pink-400' },
  { emoji: '🚀', label: 'Supreme BrainRot Lord', range: '91-100%', color: 'text-violet-400' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Enter Your Name', desc: 'No signup, no BS. Just your name and you\'re in.', emoji: '✍️' },
  { step: '02', title: 'Pick Difficulty', desc: 'Easy for casuals, Hard for the truly rotted.', emoji: '🎯' },
  { step: '03', title: 'Answer 10 Questions', desc: 'AI-generated brainrot questions. 20 seconds each.', emoji: '🧠' },
  { step: '04', title: 'Get Your IQ Tier', desc: 'Find out if you\'re NPC or Supreme BrainRot Lord.', emoji: '🏆' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [nameError, setNameError] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);
  const savedName = storage.get('playerName', '');

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % TICKER_ITEMS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    const playerName = savedName || name.trim();
    if (!playerName || playerName.length < 2) {
      setNameError('Enter your name (min 2 characters)');
      return;
    }
    storage.set('playerName', playerName);
    navigate(`/quiz?difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-[#07070f] overflow-x-hidden">

      {/* ── Ticker Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-9 bg-violet-600 flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tickerIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full text-center text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <span>{TICKER_ITEMS[tickerIndex].emoji}</span>
            <span>{TICKER_ITEMS[tickerIndex].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Floating Emojis ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {FLOATING_EMOJIS.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl select-none opacity-10"
            style={{ left: item.x, top: item.y }}
            animate={{ y: [-15, 15, -15], rotate: [-8, 8, -8] }}
            transition={{ duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            {item.emoji}
          </motion.div>
        ))}

        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 pt-9">

        {/* ════════════════════════════════
            SECTION 1 - HERO
        ════════════════════════════════ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-5 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-violet-300 text-sm font-semibold tracking-wide">
              FREE · AI-POWERED · NO SIGNUP
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black leading-none mb-6">
              <span className="block bg-gradient-to-br from-violet-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                BrainRot
              </span>
              <span className="block text-white">
                IQ<span className="text-violet-400">.</span>
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-xl sm:text-2xl max-w-xl mx-auto leading-relaxed mb-10"
          >
            How{' '}
            <span className="text-violet-400 font-bold">chronically online</span>{' '}
            are you really?
            <br />
            <span className="text-gray-500 text-lg">10 questions. AI-generated. No cap.</span>
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-8 mb-12"
          >
            {[
              { val: '10', label: 'Questions' },
              { val: '3', label: 'Difficulties' },
              { val: '∞', label: 'Unique Quizzes' },
              { val: '8', label: 'IQ Tiers' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-white">{val}</div>
                <div className="text-xs text-gray-600 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* ── Quiz Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-3xl blur-xl scale-105" />

              <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-7 shadow-2xl">

                {/* Name section */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Your Name
                  </label>
                  {savedName ? (
                    <div className="flex items-center justify-between bg-violet-600/15 border border-violet-500/30 rounded-2xl px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-base font-black text-white">
                          {savedName[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-bold">{savedName}</div>
                          <div className="text-violet-400 text-xs">Ready to play!</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { storage.remove('playerName'); window.location.reload(); }}
                        className="text-gray-600 hover:text-gray-400 text-xs transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={e => { setName(e.target.value); if (e.target.value.trim().length >= 2) setNameError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleStart()}
                        placeholder="Enter your name..."
                        maxLength={20}
                        className={`w-full bg-white/5 border ${nameError ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all text-sm`}
                      />
                      {nameError && (
                        <p className="text-red-400 text-xs mt-1.5 pl-1">{nameError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Difficulty */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Difficulty
                  </label>
                  <div className="space-y-2">
                    {Object.entries(QUIZ_CONFIG.difficulties).map(([key, diff]) => (
                      <button
                        key={key}
                        onClick={() => setDifficulty(key)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                          difficulty === key
                            ? 'border-violet-500/50 bg-violet-500/15 text-white shadow-lg shadow-violet-900/20'
                            : 'border-white/5 bg-white/[0.02] text-gray-500 hover:border-white/10 hover:text-gray-400 hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="text-xl">{diff.label.split(' ')[0]}</span>
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${difficulty === key ? 'text-white' : 'text-gray-400'}`}>
                            {diff.label.split(' ').slice(1).join(' ')}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">{diff.description}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          difficulty === key ? 'border-violet-400 bg-violet-500' : 'border-gray-700'
                        }`}>
                          {difficulty === key && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStart}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-violet-900/40 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🧠 Start Quiz
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>

                {/* Nav links */}
                <div className="flex justify-center gap-6 mt-4">
                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="text-gray-600 hover:text-gray-400 text-sm transition-colors flex items-center gap-1.5"
                  >
                    🏆 <span>Leaderboard</span>
                  </button>
                  {savedName && (
                    <button
                      onClick={() => navigate('/profile')}
                      className="text-gray-600 hover:text-gray-400 text-sm transition-colors flex items-center gap-1.5"
                    >
                      👤 <span>Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-2 text-gray-700"
          >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-lg"
            >
              ↓
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════════════════════
            SECTION 2 - HOW IT WORKS
        ════════════════════════════════ */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">How It Works</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white">
                Simple as <span className="text-violet-400">1, 2, 3, 4</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOW_IT_WORKS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 group hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300"
                >
                  <div className="text-4xl font-black text-white/5 absolute top-4 right-4 leading-none select-none">
                    {item.step}
                  </div>
                  <div className="text-3xl mb-4">{item.emoji}</div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 3 - IQ TIERS
        ════════════════════════════════ */}
        <section className="py-24 px-4 bg-white/[0.01]">
          <div className="max-w-4xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">IQ Tiers</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Which tier are <span className="text-violet-400">you?</span>
              </h2>
              <p className="text-gray-500 text-lg">From NPC to Supreme BrainRot Lord</p>
            </motion.div>

            <div className="space-y-3">
              {IQ_TIERS_PREVIEW.map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300 group"
                >
                  <span className="text-2xl">{tier.emoji}</span>
                  <div className="flex-1">
                    <span className={`font-bold ${tier.color}`}>{tier.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Progress bar */}
                    <div className="hidden sm:block w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: tier.range.split('-')[1] || '100%' }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 + 0.3, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                        style={{ width: tier.range.split('-')[1] }}
                      />
                    </div>
                    <span className="text-gray-600 text-sm font-mono">{tier.range}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <button
                onClick={handleStart}
                className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl hover:from-violet-500 hover:to-purple-500 transition-all"
              >
                Find My Tier →
              </button>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 4 - FEATURES
        ════════════════════════════════ */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Features</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white">
                Why BrainRot IQ <span className="text-violet-400">slaps</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-gradient-to-br ${feat.color} border ${feat.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="text-3xl mb-4">{feat.emoji}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{feat.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 5 - SCORING
        ════════════════════════════════ */}
        <section className="py-24 px-4 bg-white/[0.01]">
          <div className="max-w-3xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Scoring System</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white">
                How points <span className="text-violet-400">work</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Base Score',
                  emoji: '✅',
                  items: [
                    { label: 'Per correct answer', value: '+100 pts' },
                  ],
                  color: 'border-green-500/20 bg-green-500/5',
                },
                {
                  title: 'Speed Bonus',
                  emoji: '⚡',
                  items: [
                    { label: 'Answer in ≤5 seconds', value: '+50 pts' },
                    { label: 'Answer in ≤10 seconds', value: '+25 pts' },
                    { label: 'Answer in ≤15 seconds', value: '+10 pts' },
                  ],
                  color: 'border-yellow-500/20 bg-yellow-500/5',
                },
                {
                  title: 'Streak Bonus',
                  emoji: '🔥',
                  items: [
                    { label: '3+ correct in a row', value: '+25 pts each' },
                  ],
                  color: 'border-orange-500/20 bg-orange-500/5',
                },
                {
                  title: 'Difficulty Multiplier',
                  emoji: '🎯',
                  items: [
                    { label: 'Easy', value: '×1.0' },
                    { label: 'Medium', value: '×1.5' },
                    { label: 'Hard', value: '×2.0' },
                  ],
                  color: 'border-violet-500/20 bg-violet-500/5',
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`border rounded-2xl p-5 ${card.color}`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{card.emoji}</span>
                    <h3 className="text-white font-bold">{card.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {card.items.map((item, j) => (
                      <div key={j} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{item.label}</span>
                        <span className="text-white font-bold text-sm">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SECTION 6 - FINAL CTA
        ════════════════════════════════ */}
        <section className="py-32 px-4">
          <div className="max-w-2xl mx-auto text-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-3xl blur-2xl" />

              <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-12">
                <div className="text-6xl mb-6">🧠</div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                  Ready to find out?
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Stop being an NPC. Take the quiz and discover your true brainrot level.
                </p>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleStart}
                  className="px-10 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black text-xl rounded-2xl shadow-2xl shadow-violet-900/50 hover:from-violet-500 hover:to-purple-500 transition-all"
                >
                  🚀 Take The Quiz — It's Free
                </motion.button>

                <div className="flex justify-center gap-6 mt-6">
                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
                  >
                    🏆 View Leaderboard
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/5 py-8 px-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <span className="text-white font-black text-lg">BrainRot IQ</span>
            </div>
            <p className="text-gray-700 text-sm">
              Made for the chronically online. No cap.
            </p>
            <div className="flex items-center gap-4 text-gray-700 text-sm">
              <button onClick={() => navigate('/leaderboard')} className="hover:text-gray-500 transition-colors">
                Leaderboard
              </button>
              <button onClick={() => navigate('/profile')} className="hover:text-gray-500 transition-colors">
                Profile
              </button>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
