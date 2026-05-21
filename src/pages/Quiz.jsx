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

export default function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty') || 'medium';
  
  const {
    status, currentQuestion, currentIndex, totalQuestions,
    answers, streak, progress, error, isLoading, isActive,
    isFinished, isError, results,
    generateQuestions, answerQuestion, timeOut, resetQuiz,
  } = useQuiz();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [toast, setToast] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const playerName = storage.get('playerName', '');

  // Initialize quiz
  useEffect(() => {
    if (!playerName) {
      navigate('/');
      return;
    }
    
    const start = async () => {
      const result = await generateQuestions(difficulty, playerName);
      if (result?.fallback) {
        setIsFallback(true);
        setToast({ message: 'Using cached questions - AI is warming up!', type: 'info' });
      }
    };
    
    start();
  }, []);  // eslint-disable-line

  // Navigate to results when finished
  useEffect(() => {
    if (isFinished && results) {
      // Store results for results page
      storage.set('lastResults', results);
      setTimeout(() => navigate('/results'), 500);
    }
  }, [isFinished, results, navigate]);

  const handleAnswer = useCallback((option) => {
    if (selectedAnswer !== null || showFeedback) return;
    
    setSelectedAnswer(option);
    setShowFeedback(true);
    
    const isCorrect = option === currentQuestion?.answer;
    
    if (isCorrect) {
      setToast({ 
        message: streak >= 2 ? `🔥 ${streak + 1} streak!` : '✅ Correct!', 
        type: 'success' 
      });
    }
    
    // Short delay to show feedback then proceed
    setTimeout(() => {
      answerQuestion(option);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 800);
  }, [selectedAnswer, showFeedback, currentQuestion, streak, answerQuestion]);

  const handleTimeOut = useCallback(() => {
    if (!showFeedback) {
      setSelectedAnswer(null);
      setShowFeedback(true);
      setToast({ message: "⏰ Time's up!", type: 'error' });
      
      setTimeout(() => {
        timeOut();
        setShowFeedback(false);
      }, 600);
    }
  }, [showFeedback, timeOut]);

  // Loading state
  if (isLoading) {
    return <LoadingScreen message="AI is generating your questions..." submessage="Cooking up the brainrot..." />;
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6 max-w-sm">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => generateQuestions(difficulty, playerName)}
              className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-500 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive || !currentQuestion) {
    return <LoadingScreen message="Preparing quiz..." />;
  }

  const getOptionStyle = (option) => {
    if (!showFeedback) {
      return 'border-white/10 bg-white/5 text-gray-300 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-white';
    }
    if (option === currentQuestion.answer) {
      return 'border-green-500/60 bg-green-500/15 text-green-300';
    }
    if (option === selectedAnswer && option !== currentQuestion.answer) {
      return 'border-red-500/60 bg-red-500/15 text-red-300';
    }
    return 'border-white/5 bg-white/3 text-gray-500';
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-800/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-800/15 rounded-full blur-3xl" />
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm flex items-center gap-1"
          >
            ← Exit
          </button>
          
          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1"
              >
                <span className="text-orange-400 text-xs font-bold">🔥 {streak} streak</span>
              </motion.div>
            )}
            
            <div className="text-sm text-gray-400 font-medium">
              <span className="text-white font-bold">{currentIndex + 1}</span>
              <span className="text-gray-600"> / </span>
              <span>{totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {/* Category & Timer Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentQuestion.emoji || '🧠'}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
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

            {/* Question */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <p className="text-white text-xl font-semibold leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options?.map((option, idx) => (
                <motion.button
                  key={`${currentIndex}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={!showFeedback ? { scale: 1.01 } : {}}
                  whileTap={!showFeedback ? { scale: 0.99 } : {}}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer ${getOptionStyle(option)}`}
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-500">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 font-medium">{option}</span>
                  {showFeedback && option === currentQuestion.answer && (
                    <span className="text-green-400 text-lg">✓</span>
                  )}
                  {showFeedback && option === selectedAnswer && option !== currentQuestion.answer && (
                    <span className="text-red-400 text-lg">✗</span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Explanation (shown after answer) */}
            <AnimatePresence>
              {showFeedback && currentQuestion.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 bg-violet-900/20 border border-violet-500/20 rounded-xl p-3"
                >
                  <p className="text-gray-300 text-sm">
                    <span className="text-violet-400 font-semibold">💡 </span>
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
