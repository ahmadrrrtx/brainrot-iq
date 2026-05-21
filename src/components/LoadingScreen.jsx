// src/components/LoadingScreen.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_TIPS = [
  'Consulting the brainrot archives... 📚',
  'Scanning TikTok for questions... 📱',
  'Downloading sigma energy... 💪',
  'Calibrating rizz detector... ✨',
  'Processing meme database... 🧠',
  'Checking chronically online metrics... 📊',
  'Loading internet culture data... 🌐',
];

export default function LoadingScreen({ message = 'Loading...', submessage = '' }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % LOADING_TIPS.length);
    }, 2000);
    
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    
    return () => {
      clearInterval(tipInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-800/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-800/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center">
        {/* Brain Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: 'easeInOut' 
          }}
          className="text-8xl mb-6 select-none"
        >
          🧠
        </motion.div>

        {/* Progress Ring */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="rgba(124,58,237,0.15)"
              strokeWidth="4"
            />
            <motion.circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="175.93"
              animate={{ strokeDashoffset: [175.93, 0, 175.93] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        {/* Message */}
        <h2 className="text-white text-xl font-bold mb-2">
          {message}{dots}
        </h2>
        
        {/* Rotating Tips */}
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500 text-sm"
          >
            {submessage || LOADING_TIPS[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
