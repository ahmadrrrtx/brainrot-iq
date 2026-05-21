import { useState, useEffect, useRef } from "react";
import { storage } from "../utils";
import { PLAYER_NAME_KEY, PLAYER_ID_KEY } from "../constants";
import { generatePlayerId } from "../utils";

export default function NameModal({ onConfirm }) {
  const [name, setName] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const saved = storage.get(PLAYER_NAME_KEY, "");
    if (saved) setName(saved);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    const playerId = storage.get(PLAYER_ID_KEY) || generatePlayerId();
    storage.set(PLAYER_NAME_KEY, trimmed);
    storage.set(PLAYER_ID_KEY, playerId);
    onConfirm(trimmed, playerId);
  };

  const suggestions = ["SigmaBrain", "RizzKing", "OhioLord", "GigaCooked", "NPC_Mode"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative glass-card p-8 max-w-md w-full animate-zoom-in">
        {/* Glow */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-bounce-slow">🧠</div>
          <h2 className="text-2xl font-display font-bold gradient-text mb-1">
            Who's Getting Cooked?
          </h2>
          <p className="text-white/50 text-sm">
            Enter your name to appear on the global leaderboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={shake ? "animate-wiggle" : ""}>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="Your username..."
              maxLength={20}
              className="input-neon text-center text-lg"
              autoComplete="off"
              spellCheck="false"
            />
            <div className="flex justify-between mt-1.5 px-1">
              <span className="text-white/30 text-xs">Min 2 characters</span>
              <span className="text-white/30 text-xs">{name.length}/20</span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setName(s)}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-purple-500/40 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          <button type="submit" className="btn-neon w-full flex items-center justify-center gap-2 text-base">
            Let's Get Cooked ⚡
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-4">
          No account needed · Completely free
        </p>
      </div>
    </div>
  );
}
