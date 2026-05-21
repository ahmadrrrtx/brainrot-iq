import { BRAINROT_LEVELS, SHARE_MESSAGES, APP_CONFIG } from "./constants";

// ─── Get Brainrot Level ───────────────────
export const getBrainrotLevel = (score) => {
  return (
    BRAINROT_LEVELS.find((l) => score >= l.min && score <= l.max) ||
    BRAINROT_LEVELS[0]
  );
};

// ─── Format Score ─────────────────────────
export const formatScore = (score) => {
  return Math.round(score);
};

// ─── Calculate Percentage ────────────────
export const calcPercentage = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

// ─── Generate Share Text ─────────────────
export const generateShareText = (score, level, emoji) => {
  const template =
    SHARE_MESSAGES[Math.floor(Math.random() * SHARE_MESSAGES.length)];
  return (
    template
      .replace("{score}", score)
      .replace("{level}", level)
      .replace("{emoji}", emoji) +
    `\n\nTest yourself 👉 ${APP_CONFIG.url}`
  );
};

// ─── Share to Twitter ─────────────────────
export const shareToTwitter = (score, level, emoji) => {
  const text = generateShareText(score, level, emoji);
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

// ─── Share to WhatsApp ────────────────────
export const shareToWhatsApp = (score, level, emoji) => {
  const text = generateShareText(score, level, emoji);
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

// ─── Native Share ─────────────────────────
export const nativeShare = async (score, level, emoji) => {
  const text = generateShareText(score, level, emoji);
  if (navigator.share) {
    try {
      await navigator.share({
        title: "My Brainrot IQ Score",
        text,
        url: APP_CONFIG.url,
      });
      return true;
    } catch (e) {
      console.log("Share cancelled");
      return false;
    }
  }
  return false;
};

// ─── Copy to Clipboard ────────────────────
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  }
};

// ─── Format Time ─────────────────────────
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// ─── Shuffle Array ────────────────────────
export const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// ─── Generate Player ID ──────────────────
export const generatePlayerId = () => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ─── Truncate Text ────────────────────────
export const truncate = (str, len = 20) => {
  if (str.length <= len) return str;
  return str.slice(0, len) + "...";
};

// ─── Number abbreviation ─────────────────
export const abbreviateNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// ─── Debounce ────────────────────────────
export const debounce = (fn, ms = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

// ─── Local Storage Helpers ───────────────
export const storage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("Storage error:", e);
    }
  },
};

// ─── Rank medal ──────────────────────────
export const getRankMedal = (rank) => {
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  return medals[rank] || `#${rank}`;
};

// ─── Time since ──────────────────────────
export const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};
