// src/constants.js

export const APP_CONFIG = {
  name: 'BrainRot IQ',
  version: '2.0.0',
  url: 'https://brainrot-iq.vercel.app',
  description: 'Test your internet culture IQ',
};

export const QUIZ_CONFIG = {
  totalQuestions: 10,
  timePerQuestion: 20,
  difficulties: {
    easy: {
      label: '😎 Easy Mode',
      description: 'For casuals who occasionally touch grass',
      multiplier: 1,
      color: 'from-green-500 to-emerald-500',
    },
    medium: {
      label: '🔥 Chronically Online',
      description: 'For those who know what NPC means',
      multiplier: 1.5,
      color: 'from-yellow-500 to-orange-500',
    },
    hard: {
      label: '🧠 Full Brainrot',
      description: 'Only true sigma level brainrot masters',
      multiplier: 2,
      color: 'from-red-500 to-pink-500',
    },
  },
  scoring: {
    baseScore: 100,
    timeBonus: {
      fast: { threshold: 5, bonus: 50 },
      medium: { threshold: 10, bonus: 25 },
      slow: { threshold: 15, bonus: 10 },
    },
    streakBonus: 25,
  },
};

export const IQ_TIERS = [
  {
    min: 0,
    max: 10,
    label: 'NPC Mode',
    emoji: '🤖',
    description: 'You probably still use Internet Explorer',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-900',
    advice: "Bro... go touch some grass and come back when you've downloaded some internet culture",
  },
  {
    min: 11,
    max: 20,
    label: 'Casual Scroller',
    emoji: '📱',
    description: "You've seen memes before. In a museum.",
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-950',
    advice: "You've opened TikTok at least once. Growth!",
  },
  {
    min: 21,
    max: 35,
    label: 'Main Character Era',
    emoji: '✨',
    description: 'Living your best life, chronically mid',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-950',
    advice: "You're giving main character energy but forgetting your lines",
  },
  {
    min: 36,
    max: 50,
    label: 'Internet Citizen',
    emoji: '🌐',
    description: 'Fluent in meme language',
    color: 'from-indigo-500 to-violet-600',
    bgColor: 'bg-indigo-950',
    advice: 'Your rizz is moderate. Keep grinding.',
  },
  {
    min: 51,
    max: 65,
    label: 'Chronically Online',
    emoji: '⚡',
    description: 'When did you last go outside?',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-950',
    advice: 'Your brain is beautifully rotted. Touch grass occasionally.',
  },
  {
    min: 66,
    max: 80,
    label: 'Certified Brainrot',
    emoji: '🧠',
    description: 'Memes are your second language',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-950',
    advice: 'Full send on the brainrot. No ragrets.',
  },
  {
    min: 81,
    max: 90,
    label: 'Sigma Grindset',
    emoji: '👑',
    description: 'Operating on a different wavelength',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-950',
    advice: 'You ate and left no crumbs. Understood the assignment.',
  },
  {
    min: 91,
    max: 100,
    label: 'Supreme BrainRot Lord',
    emoji: '🚀',
    description: 'You ARE the algorithm',
    color: 'from-violet-500 via-purple-500 to-pink-500',
    bgColor: 'bg-violet-950',
    advice: 'You are the chosen one. The algorithm bows to you.',
  },
];

export const getIQTier = (score, total = 10) => {
  const percentage = Math.round((score / total) * 100);
  return (
    IQ_TIERS.find(
      tier => percentage >= tier.min && percentage <= tier.max
    ) || IQ_TIERS[0]
  );
};

export const CATEGORIES = [
  'TikTok Culture',
  'Gen-Z Slang',
  'Meme History',
  'Viral Moments',
  'Internet Beef',
  'Gaming Culture',
  'Social Media',
  'Brainrot Content',
  'Sigma Culture',
  'Twitter/X Drama',
];
