import { useEffect, useState } from "react";
import { LOADING_MESSAGES } from "../constants";

export default function LoadingScreen({ message }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(msgTimer);
  }, []);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(dotTimer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Animated Brain */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl animate-float"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))",
            border: "2px solid rgba(124,58,237,0.4)",
            boxShadow: "0 0 40px rgba(124,58,237,0.3)",
          }}>
          🧠
        </div>
        {/* Orbiting dot */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="w-3 h-3 bg-purple-400 rounded-full absolute -top-1 left-1/2 -translate-x-1/2"
            style={{ boxShadow: "0 0 8px rgba(124,58,237,0.8)" }} />
        </div>
      </div>

      {/* Loading bar */}
      <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full animate-pulse"
          style={{
            background: "linear-gradient(90deg, #7c3aed, #c084fc, #06b6d4)",
            animation: "shimmer 1.5s infinite",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Message */}
      <p className="text-white/80 font-medium text-center max-w-xs animate-fade-in" key={msgIndex}>
        {message || LOADING_MESSAGES[msgIndex]}
        <span className="text-purple-400">{dots}</span>
      </p>

      <p className="text-white/30 text-sm mt-3">Powered by Groq AI ⚡</p>
    </div>
  );
}
