// src/components/Toast.jsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOAST_STYLES = {
  success: 'bg-green-500/15 border-green-500/30 text-green-300',
  error: 'bg-red-500/15 border-red-500/30 text-red-300',
  info: 'bg-violet-500/15 border-violet-500/30 text-violet-300',
  warning: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
};

export default function Toast({ message, type = 'info', onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={onClose}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-xl border backdrop-blur-xl text-sm font-semibold cursor-pointer shadow-xl max-w-xs text-center ${TOAST_STYLES[type] || TOAST_STYLES.info}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
