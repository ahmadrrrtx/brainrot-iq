import { useEffect } from "react";
import { QUIZ_CONFIG } from "../constants";
import { useSound } from "../hooks/useSound";

export default function Timer({ timeLeft, onTimeout }) {
  const { sounds } = useSound();
  const total = QUIZ_CONFIG.timePerQuestion;
  const percentage = (timeLeft / total) * 100;
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isWarning = timeLeft <= 5;
  const isCritical = timeLeft <= 3;

  // Play warning sounds
  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      sounds.tick();
    }
    if (timeLeft === 0) {
      onTimeout?.();
    }
  }, [timeLeft]);

  const color = isCritical
    ? "#ef4444"
    : isWarning
    ? "#f59e0b"
    : "#7c3aed";

  return (
    <div className={`relative flex items-center justify-center ${isCritical ? "animate-wiggle" : ""}`}>
      {/* SVG Ring */}
      <svg width="56" height="56" className="-rotate-90">
        {/* Background ring */}
        <circle
          cx="28"
          cy="28"
          r="20"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
        {/* Progress ring */}
        <circle
          cx="28"
          cy="28"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.9s linear, stroke 0.3s ease",
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>

      {/* Time number */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-sm font-bold transition-colors duration-300 ${
            isCritical ? "text-red-400" : isWarning ? "text-amber-400" : "text-white"
          }`}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  );
}
