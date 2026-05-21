// src/pages/Quiz.jsx
import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../hooks/useQuiz';
import { storage } from '../utils';
import { QUIZ_CONFIG } from '../constants';
import Timer from '../components/Timer';
import LoadingScreen from '../components/LoadingScreen';
import Toast from '../components/Toast';

const DIFFICULTY_LABELS = {
  easy: { label: 'Easy', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  hard: { label: 'Hard', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

export default function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty') || 'medium';

  const {
    status, currentQuestion, currentIndex, totalQuestions,
    streak, progress, error, isLoading, isActive,
    isFinished, isError, results,
    generateQuestions, answerQuestion, timeOut,
  } = useQuiz();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [toast, setToast] = useState(null);

  const playerName = storage.get('playerName', '');
  const diffConfig = DIFFICULTY_LABELS[difficulty] || DIFFICULTY_LABELS.medium;

  useEffect(() => {
    if (!playerName) { navigate('/'); return; }
    generateQuestions(difficulty, playerName);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (isFinished && results) {
      storage.set('lastResults', results);
      setTimeout(() => navigate('/results'), 600);
    }
  }, [isFinished, results, navigate]);

  const handleAnswer = useCallback((option) => {
    if (selectedAnswer !== null || showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
    const isCorrect = option === currentQuestion?.answer;
    if (isCorrect) {
      setToast({ message: streak >= 2 ? `🔥 ${streak + 1}x Streak!` : '✅ Correct!', type: 'success' });
    } else {
      setToast({ message: '❌ Wrong!', type: 'error' });
    }
    setTimeout(() => {
      answerQuestion(option);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 900);
  }, [selectedAnswer, showFeedback, currentQuestion, streak, answerQuestion]);

  const handleTimeOut = useCallback(() => {
    if (!showFeedback) {
      setShowFeedback(true);
      setToast({ message: "⏰ Too slow!", type: 'error' });
      setTimeout(() => {
        timeOut();
        setSelectedAnswer(null);
        setShowFeedback(false);
      }, 700);
    }
  }, [showFeedback, timeOut]);

  if (isLoading) return <LoadingScreen message="Generating your quiz..." submessage="AI is cooking up the brainrot 🍳" />;

  if (isError) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-7xl mb-4">💀</div>
          <h2 className="text-2xl font-black text-white mb-2">Something broke</h2>
          <p className="text-gray-500 mb-6 text-sm">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => generateQuestions(difficulty, playerName)}
              className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-500 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive || !currentQuestion) return <LoadingScreen message="Preparing..." />;

  const getOptionStyle = (option) => {
    const base = 'w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer';
    if (!showFeedback) {
      return `${base} border-white/8 bg-white/[0.03] text-gray-300 hover:border-violet-500/40 hover:bg-violet-500/8 hover:text-white active:scale-[0.99]`;
    }
    if (option === currentQuestion.answer) {
      return `${base} border-green-500/50 bg-green-500/10 text-green-300`;
    }
    if (option === selectedAnswer) {
      return `${base} border-red-500/50 bg-red-500/10 text-red-300`;
    }
    return `${base} border-white/5 bg-white/[0.01] text-gray-600`;
  };

  return (
    <div className="min-h-screen bg-[#07070f] relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-800/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-800/10 rounded-full blur-3xl" />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 min-h-screen flex flex-col">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-400 transition-colors text-sm"
          >
            ← Exit
          </button>

          <div className="flex items-center gap-3">
            {/* Difficulty badge */}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${diffConfig.bg} ${diffConfig.color}`}>
              {diffConfig.label}
            </span>

            {/* Streak */}
            <AnimatePresence>
              {streak >= 2 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/25 rounded-lg px-2.5 py-1"
                >
                  <span className="text-orange-400 text-xs font-black">🔥 {streak}x</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Question count */}
            <div className="text-sm text-gray-500">
              <span className="text-white font-black">{currentIndex + 1}</span>
              <span className="text-gray-700"> / </span>
              <span>{totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* ── Question ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col"
          >
            {/* Category + Timer */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{currentQuestion.emoji || '🧠'}</span>
                <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                  {currentQuestion.category || 'Internet Culture'}
                </span>
              </div>
              <Timer
                key={`timer-${currentIndex}`}
                duration={QUIZ_CONFIG.timePerQuestion}
                onComplete={handleTimeOut}
                isPaused={showFeedback}
              />
            </div>

            {/* Question box */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-5">
              <p className="text-white text-xl font-bold leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 flex-1">
              {currentQuestion.options?.map((option, idx) => (
                <motion.button
                  key={`${currentIndex}-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  className={getOptionStyle(option)}
                >
                  {/* Option letter */}
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-xs font-black text-gray-500">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 font-semibold text-sm sm:text-base">{option}</span>
                  {/* Feedback icons */}
                  {showFeedback && option === currentQuestion.answer && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-400 text-xl flex-shrink-0"
                    >
                      ✓
                    </motion.span>
                  )}
                  {showFeedback && option === selectedAnswer && option !== currentQuestion.answer && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-red-400 text-xl flex-shrink-0"
                    >
                      ✗
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showFeedback && currentQuestion.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4"
                >
                  <p className="text-gray-300 text-sm leading-relaxed">
                    <span className="text-violet-400 font-bold">💡 </span>
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
