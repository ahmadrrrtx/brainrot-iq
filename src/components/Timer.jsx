// src/components/Timer.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Timer({ duration = 20, onComplete, isPaused = false }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);
  const hasCompleted = useRef(false);

  useEffect(() => {
    setTimeLeft(duration);
    hasCompleted.current = false;
  }, [duration]);

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (!hasCompleted.current) {
            hasCompleted.current = true;
            onComplete?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPaused, onComplete]);

  const percentage = (timeLeft / duration) * 100;
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (timeLeft > duration * 0.5) return '#7c3aed'; // Purple
    if (timeLeft > duration * 0.25) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const isUrgent = timeLeft <= 5;

  return (
    <motion.div
      animate={isUrgent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={isUrgent ? { duration: 0.5, repeat: Infinity } : {}}
      className="relative flex items-center justify-center w-12 h-12"
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        {/* Background track */}
        <circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        {/* Progress */}
        <motion.circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke={getColor()}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s ease' }}
        />
      </svg>
      
      {/* Number */}
      <span
        className="absolute text-sm font-black tabular-nums"
        style={{ color: getColor(), transition: 'color 0.5s ease' }}
      >
        {timeLeft}
      </span>
    </motion.div>
  );
}
