import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getBrainrotLevel, shareToTwitter, shareToWhatsApp, copyToClipboard, generateShareText } from "../utils";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useSound } from "../hooks/useSound";
import { ANSWER_LETTERS, APP_CONFIG } from "../constants";
import LoadingScreen from "../components/LoadingScreen";

// ─── Score Circle ─────────────────────────
function ScoreCircle({ score, total }) {
  const percentage = Math.round((score / total) * 100);
  const circumference = 2 * Math.PI * 52;
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = percentage / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= percentage) {
        setAnimatedPercent(percentage);
        clearInterval(timer);
      } else {
        setAnimatedPercent(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [percentage]);

  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg width="144" height="144" className="-rotate-90">
        <circle cx="72" cy="72" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="72"
          cy="72"
          r="52"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-display font-bold text-white">{score}</span>
        <span className="text-white/40 text-sm">/{total}</span>
      </div>
    </div>
  );
}

// ─── Share Card ───────────────────────────
function ShareCard({ playerName, score, total, level }) {
  const [copied, setCopied] = useState(false);
  const percentage = Math.round((score / total) * 100);
  const shareText = generateShareText(percentage, level.level, level.emoji);

  const handleCopy = async () => {
    const success = await copyToClipboard(shareText + `\n\n${APP_CONFIG.url}`);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-bold text-white mb-4 text-center">Share Your Results 🔥</h3>

      {/* Preview */}
      <div className="rounded-xl p-4 mb-4 text-center"
        style={{
          background: level.bgColor,
          border: `1px solid ${level.borderColor}`,
        }}>
        <div className="text-3xl mb-1">{level.emoji}</div>
        <p className="font-bold text-white text-sm">{playerName}</p>
        <p className="text-white/60 text-xs">scored {percentage}/100 — {level.level}</p>
        <p className="text-white/30 text-xs mt-1">{APP_CONFIG.url}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => shareToTwitter(percentage, level.level, level.emoji)}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-all text-sm font-medium"
        >
          𝕏 Twitter
        </button>
        <button
          onClick={() => shareToWhatsApp(percentage, level.level, level.emoji)}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all text-sm font-medium"
        >
          💬 WhatsApp
        </button>
        <button
          onClick={handleCopy}
          className={`col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-sm font-medium ${
            copied
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
        </button>
      </div>
    </div>
  );
}

// ─── Answer Review ────────────────────────
function AnswerReview({ answers, questions }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-6">
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between font-display font-bold text-white"
      >
        <span>📋 Review Answers</span>
        <span className={`text-purple-400 transition-transform ${expanded ? "rotate-180" : ""}`}>▼</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {answers.map((answer, i) => {
            const q = questions[answer.questionIndex];
            if (!q) return null;
            return (
              <div
                key={i}
                className={`p-3 rounded-xl border text-sm ${
                  answer.isCorrect
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span>{answer.isCorrect ? "✅" : answer.timedOut ? "⏰" : "❌"}</span>
                  <span className="text-white/80 font-medium leading-snug">{q.question}</span>
                </div>
                {!answer.isCorrect && (
                  <div className="ml-6 text-xs">
                    <span className="text-red-400">
                      Your answer: {answer.selectedAnswer >= 0 ? q.options[answer.selectedAnswer] : "Timed out"}
                    </span>
                    <br />
                    <span className="text-green-400">
                      Correct: {q.options[answer.correctAnswer]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN RESULTS ─────────────────────────
export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { sounds } = useSound();
  const { submitScore } = useLeaderboard(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const hasSubmitted = useRef(false);

  // Redirect if no state
  useEffect(() => {
    if (!state?.questions?.length) {
      navigate("/quiz");
    }
  }, [state, navigate]);

  if (!state?.questions?.length) return <LoadingScreen />;

  const { answers = [], questions = [], playerName, playerId, score, total } = state;
  const percentage = Math.round((score / total) * 100);
  const level = getBrainrotLevel(percentage);

  // ─── Submit score to leaderboard ─────────
  useEffect(() => {
    if (hasSubmitted.current || !playerName || !score) return;
    hasSubmitted.current = true;

    const submit = async () => {
      setSubmitting(true);
      await submitScore({
        name: playerName,
        score: percentage,
        level: level.level,
        emoji: level.emoji,
      });
      setSubmitted(true);
      setSubmitting(false);
    };

    submit();
    sounds.complete();
  }, []);

  return (
    <div className="min-h-[85vh] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Main Result Card ─── */}
        <div className="glass-card p-8 text-center animate-fade-up"
          style={{ borderColor: level.borderColor }}>
          {/* Confetti emoji */}
          <div className="text-4xl mb-4 animate-bounce-slow">{level.emoji}</div>

          {/* Level */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
            style={{ background: level.bgColor, border: `1px solid ${level.borderColor}`, color: level.color }}>
            {level.level}
          </div>

          {/* Score circle */}
          <ScoreCircle score={score} total={total} />

          <div className="mt-4">
            <p className="text-2xl font-display font-bold text-white mb-1">
              {percentage}% Brainrot Score
            </p>
            <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
              {level.description}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "Correct", value: score, icon: "✅" },
              { label: "Wrong", value: total - score, icon: "❌" },
              { label: "Score", value: `${percentage}%`, icon: "🎯" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-3 text-center">
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-white/40 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Leaderboard status */}
          {submitting && (
            <p className="text-white/40 text-xs mt-4">Uploading to leaderboard...</p>
          )}
          {submitted && (
            <p className="text-green-400 text-xs mt-4">✅ Score saved to global leaderboard!</p>
          )}
        </div>

        {/* ─── Share Card ─── */}
        <div className="animate-fade-up animate-delay-200">
          <ShareCard
            playerName={playerName}
            score={score}
            total={total}
            level={level}
          />
        </div>

        {/* ─── Answer Review ─── */}
        <div className="animate-fade-up animate-delay-300">
          <AnswerReview answers={answers} questions={questions} />
        </div>

        {/* ─── Action Buttons ─── */}
        <div className="grid grid-cols-2 gap-3 animate-fade-up animate-delay-500">
          <button
            onClick={() => { sounds.click(); navigate("/quiz"); }}
            className="btn-neon flex items-center justify-center gap-2 py-4"
          >
            🔄 Retry
          </button>
          <Link
            to="/leaderboard"
            className="btn-ghost flex items-center justify-center gap-2 py-4"
            onClick={() => sounds.click()}
          >
            🏆 Rankings
          </Link>
        </div>
      </div>
    </div>
  );
}
