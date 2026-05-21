// src/utils.js

// ============================================
// SCORE CALCULATION
// ============================================
export const calculateScore = (answers, questions, timeData, difficulty = 'medium') => {
  const multipliers = { easy: 1, medium: 1.5, hard: 2 };
  const multiplier = multipliers[difficulty] || 1;
  
  let correctCount = 0;
  let totalTimeBonus = 0;
  let streak = 0;
  let maxStreak = 0;
  let totalStreakBonus = 0;
  
  const questionResults = questions.map((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.answer;
    const timeTaken = timeData?.[index] || 20;
    
    if (isCorrect) {
      correctCount++;
      streak++;
      maxStreak = Math.max(maxStreak, streak);
      
      // Time bonus
      let timeBonus = 0;
      if (timeTaken <= 5) timeBonus = 50;
      else if (timeTaken <= 10) timeBonus = 25;
      else if (timeTaken <= 15) timeBonus = 10;
      
      totalTimeBonus += timeBonus;
      
      // Streak bonus
      if (streak >= 3) {
        totalStreakBonus += 25;
      }
    } else {
      streak = 0;
    }
    
    return {
      question: question.question,
      userAnswer,
      correctAnswer: question.answer,
      isCorrect,
      timeTaken,
      category: question.category,
      explanation: question.explanation,
      emoji: question.emoji,
    };
  });
  
  const baseScore = correctCount * 100;
  const bonusScore = Math.round((totalTimeBonus + totalStreakBonus) * multiplier);
  const totalScore = baseScore + bonusScore;
  const percentage = Math.round((correctCount / questions.length) * 100);
  
  return {
    correctCount,
    totalQuestions: questions.length,
    percentage,
    baseScore,
    bonusScore,
    totalScore,
    maxStreak,
    questionResults,
    difficulty,
    accuracy: percentage,
  };
};

// ============================================
// FORMATTING
// ============================================
export const formatScore = (score) => score.toLocaleString();

export const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const truncateName = (name, maxLength = 15) => {
  if (!name) return 'Anonymous';
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
};

// ============================================
// LOCAL STORAGE
// ============================================
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

// ============================================
// SOCIAL SHARING
// ============================================
export const shareResult = async ({ score, total, tier, difficulty }) => {
  const percentage = Math.round((score / total) * 100);
  const text = `🧠 I just scored ${score}/${total} (${percentage}%) on BrainRot IQ!\n\nMy tier: "${tier.label}" ${tier.emoji}\nDifficulty: ${difficulty}\n\nTest YOUR brainrot IQ 👇`;
  const url = 'https://brainrot-iq.vercel.app';
  
  // Try native share first (mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'BrainRot IQ Result',
        text,
        url,
      });
      return { success: true, method: 'native' };
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  }
  
  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return { success: true, method: 'clipboard' };
  } catch {
    return { success: false, method: 'none' };
  }
};

export const getTwitterShareUrl = ({ score, total, tier }) => {
  const text = `I scored ${score}/${total} on the BrainRot IQ test and got "${tier.label}" ${tier.emoji}! How chronically online are you? 🧠`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://brainrot-iq.vercel.app')}&hashtags=BrainRotIQ,InternetCulture,GenZ`;
};

export const getWhatsAppShareUrl = ({ score, total, tier }) => {
  const text = `I scored ${score}/${total} on BrainRot IQ and got "${tier.label}" ${tier.emoji}! Test yourself: https://brainrot-iq.vercel.app`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

// ============================================
// VALIDATION
// ============================================
export const validateName = (name) => {
  if (!name || typeof name !== 'string') return { valid: false, error: 'Name is required' };
  const trimmed = name.trim();
  if (trimmed.length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  if (trimmed.length > 20) return { valid: false, error: 'Name must be under 20 characters' };
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) return { valid: false, error: 'Name can only contain letters, numbers, spaces, hyphens, and underscores' };
  return { valid: true, error: null };
};

// ============================================
// DEVICE DETECTION
// ============================================
export const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

// ============================================
// PERFORMANCE
// ============================================
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
