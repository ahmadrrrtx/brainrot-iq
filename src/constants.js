// ═══════════════════════════════════════
//         BRAINROT IQ CONSTANTS
// ═══════════════════════════════════════

export const APP_CONFIG = {
  name: "Brainrot IQ Test",
  url: "https://brainrot-iq.vercel.app",
  description: "The ultimate AI-powered Gen-Z Brainrot IQ Test",
  version: "2.0.0",
};

// ─── Quiz Settings ───────────────────────
export const QUIZ_CONFIG = {
  totalQuestions: 10,
  timePerQuestion: 20, // seconds
  pointsPerCorrect: 10,
  bonusTimePoints: 5,   // bonus if answered in first 5s
  categories: ["general", "slang", "memes", "ohio", "sigma", "rizz", "skibidi"],
};

// ─── Brainrot Levels ─────────────────────
export const BRAINROT_LEVELS = [
  {
    min: 0,
    max: 10,
    level: "NPC Energy",
    emoji: "🤖",
    description: "You have zero brainrot. You're basically a LinkedIn user. Touch grass, then maybe come back.",
    color: "#6b7280",
    gradient: "from-gray-600 to-gray-800",
    bgColor: "rgba(107, 114, 128, 0.1)",
    borderColor: "rgba(107, 114, 128, 0.3)",
    badge: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
  {
    min: 11,
    max: 25,
    level: "Normie Detected",
    emoji: "😐",
    description: "Some brainrot detected but you're still functioning in society. Barely.",
    color: "#3b82f6",
    gradient: "from-blue-600 to-blue-800",
    bgColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.3)",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    min: 26,
    max: 45,
    level: "Mid Tier Enjoyer",
    emoji: "😏",
    description: "You know the lore but you're not fully committed. Your brain is 50% cooked.",
    color: "#10b981",
    gradient: "from-emerald-600 to-emerald-800",
    bgColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    min: 46,
    max: 65,
    level: "Sigma Aspirant",
    emoji: "😤",
    description: "Solid brainrot level. You know your skibidi from your rizz. Respect.",
    color: "#8b5cf6",
    gradient: "from-violet-600 to-violet-800",
    bgColor: "rgba(139, 92, 246, 0.1)",
    borderColor: "rgba(139, 92, 246, 0.3)",
    badge: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
  {
    min: 66,
    max: 80,
    level: "Certified Gyatt Lord",
    emoji: "🔥",
    description: "Your brain is beautifully cooked. You eat brainrot content for breakfast.",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-600",
    bgColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    min: 81,
    max: 90,
    level: "Ohio Overlord",
    emoji: "👑",
    description: "Only in Ohio could someone achieve this level of brainrot. You are the lore.",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-600",
    bgColor: "rgba(236, 72, 153, 0.1)",
    borderColor: "rgba(236, 72, 153, 0.3)",
    badge: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  },
  {
    min: 91,
    max: 100,
    level: "FINAL BOSS SIGMA",
    emoji: "⚡",
    description: "MAXIMUM BRAINROT ACHIEVED. You ARE the brainrot. The internet fears you.",
    color: "#00f5ff",
    gradient: "from-cyan-400 to-blue-600",
    bgColor: "rgba(0, 245, 255, 0.1)",
    borderColor: "rgba(0, 245, 255, 0.3)",
    badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
];

// ─── Get level from score ─────────────────
export const getBrainrotLevel = (score) => {
  return BRAINROT_LEVELS.find((l) => score >= l.min && score <= l.max) || BRAINROT_LEVELS[0];
};

// ─── Share Messages ───────────────────────
export const SHARE_MESSAGES = [
  "I just scored {score}/100 on the Brainrot IQ Test! My level: {level} {emoji}",
  "My brainrot is officially '{level}' {emoji} — I scored {score}/100 on the Brainrot IQ Test!",
  "Just took the Brainrot IQ Test and got {score}/100. I am {level} {emoji} certified!",
  "The AI judged my brainrot level as '{level}' {emoji} — scored {score}/100. Take the test!",
];

// ─── Fun Loading Messages ─────────────────
export const LOADING_MESSAGES = [
  "Calibrating your brainrot detector... 🧠",
  "Consulting the Ohio council... 🏛️",
  "Measuring your sigma levels... 📊",
  "Analyzing your rizz quotient... 💅",
  "Running skibidi diagnostics... 🚽",
  "Computing your gyatt score... 📐",
  "Checking if you're cooked... 🍳",
  "Summoning the AI overlords... 👾",
];

// ─── Answer Letters ───────────────────────
export const ANSWER_LETTERS = ["A", "B", "C", "D"];

// ─── Leaderboard ─────────────────────────
export const LEADERBOARD_CONFIG = {
  limit: 50,
  refreshInterval: 30000, // 30 seconds
};

// ─── Sounds ──────────────────────────────
export const SOUND_ENABLED_KEY = "brainrot_sound_enabled";
export const PLAYER_NAME_KEY = "brainrot_player_name";
export const PLAYER_ID_KEY = "brainrot_player_id";
