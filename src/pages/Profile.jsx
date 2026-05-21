import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../utils";
import { PLAYER_NAME_KEY, PLAYER_ID_KEY, BRAINROT_LEVELS } from "../constants";
import { getBrainrotLevel } from "../utils";
import { useSound } from "../hooks/useSound";

export default function Profile() {
  const navigate = useNavigate();
  const { sounds, soundEnabled, toggleSound } = useSound();
  const [name, setName] = useState(storage.get(PLAYER_NAME_KEY, ""));
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [stats] = useState({
    gamesPlayed: parseInt(localStorage.getItem("games_played") || "0"),
    bestScore: parseInt(localStorage.getItem("best_score") || "0"),
    avgScore: parseInt(localStorage.getItem("avg_score") || "0"),
  });

  const level = getBrainrotLevel(stats.bestScore);

  const handleSave = () => {
    const trimmed = newName.trim();
    if (trimmed.length >= 2) {
      storage.set(PLAYER_NAME_KEY, trimmed);
      setName(trimmed);
      setEditing(false);
      sounds.correct();
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all your data? This cannot be undone.")) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="min-h-[85vh] py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Profile Card */}
        <div className="glass-card p-8 text-center animate-fade-up">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
            style={{
              background: `linear-gradient(135deg, ${level.color}20, transparent)`,
              border: `2px solid ${level.borderColor}`,
              boxShadow: `0 0 30px ${level.color}30`,
            }}>
            {level.emoji}
          </div>

          {editing ? (
            <div className="flex gap-2 justify-center mb-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value.slice(0, 20))}
                className="input-neon text-center text-lg max-w-[200px]"
                autoFocus
                maxLength={20}
              />
              <button onClick={handleSave} className="btn-neon px-4 py-2 text-sm">Save</button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-2xl font-display font-bold text-white">{name || "Anonymous"}</h1>
              <button onClick={() => { setEditing(true); setNewName(name); }}
                className="text-white/30 hover:text-white transition-colors text-sm">
                ✏️
              </button>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: level.bgColor, border: `1px solid ${level.borderColor}`, color: level.color }}>
            {level.emoji} {level.level}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up animate-delay-100">
          {[
            { label: "Tests Taken", value: stats.gamesPlayed || "–", icon: "🧪" },
            { label: "Best Score", value: stats.bestScore || "–", icon: "🏆" },
            { label: "Avg Score", value: stats.avgScore || "–", icon: "📊" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Brainrot Scale */}
        <div className="glass-card p-6 animate-fade-up animate-delay-200">
          <h2 className="font-display font-bold text-white mb-4">Brainrot Scale</h2>
          <div className="space-y-2">
            {BRAINROT_LEVELS.map((l) => {
              const isCurrentLevel = l.level === level.level;
              const barWidth = `${((l.max - l.min) / 100) * 100}%`;
              return (
                <div key={l.level} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  isCurrentLevel ? "bg-white/5" : ""
                }`}>
                  <span className="text-lg w-8 text-center">{l.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className={`text-xs font-medium ${isCurrentLevel ? "text-white" : "text-white/50"}`}>
                        {l.level}
                      </span>
                      <span className="text-white/30 text-xs">{l.min}–{l.max}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: isCurrentLevel ? `${((stats.bestScore - l.min) / (l.max - l.min)) * 100}%` : "0%",
                          background: l.color,
                          boxShadow: isCurrentLevel ? `0 0 8px ${l.color}` : "none",
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                  </div>
                  {isCurrentLevel && (
                    <span className="text-xs font-bold" style={{ color: l.color }}>YOU</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="glass-card p-6 animate-fade-up animate-delay-300">
          <h2 className="font-display font-bold text-white mb-4">Settings</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xl">{soundEnabled ? "🔊" : "🔇"}</span>
                <div>
                  <p className="text-white font-medium text-sm">Sound Effects</p>
                  <p className="text-white/40 text-xs">Quiz audio feedback</p>
                </div>
              </div>
              <button
                onClick={() => { toggleSound(); sounds.click(); }}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  soundEnabled ? "bg-purple-600" : "bg-white/10"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                  soundEnabled ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 animate-fade-up animate-delay-500">
          <button onClick={() => { sounds.click(); navigate("/quiz"); }} className="btn-neon py-4">
            New Test ⚡
          </button>
          <button
            onClick={handleReset}
            className="py-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
          >
            Reset Data 🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
