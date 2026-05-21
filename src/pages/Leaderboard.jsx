import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useSound } from "../hooks/useSound";
import { getRankMedal, timeSince, truncate } from "../utils";
import { storage } from "../utils";
import { PLAYER_NAME_KEY, BRAINROT_LEVELS } from "../constants";
import LoadingScreen from "../components/LoadingScreen";

function TopThreeCard({ entry, rank }) {
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const sizes = { 1: "scale-110", 2: "scale-100", 3: "scale-100" };
  const orders = { 1: "order-2", 2: "order-1", 3: "order-3" };

  return (
    <div className={`flex flex-col items-center gap-2 ${orders[rank]} ${sizes[rank]}`}>
      <div className="text-2xl animate-bounce-slow" style={{ animationDelay: `${rank * 200}ms` }}>
        {medals[rank]}
      </div>

      <div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border"
        style={{
          background: "rgba(124,58,237,0.15)",
          borderColor: rank === 1 ? "#fbbf24" : rank === 2 ? "#94a3b8" : "#f97316",
          boxShadow: `0 0 20px ${rank === 1 ? "rgba(251,191,36,0.3)" : rank === 2 ? "rgba(148,163,184,0.2)" : "rgba(249,115,22,0.3)"}`,
        }}
      >
        {entry.emoji || "🧠"}
        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-black border border-white/10">
          {rank}
        </div>
      </div>

      <div className="text-center">
        <p className="font-bold text-white text-sm truncate max-w-[80px]">
          {truncate(entry.name, 10)}
        </p>
        <p className="text-purple-300 font-mono text-sm font-bold">{entry.score}</p>
        <p className="text-white/30 text-xs">{truncate(entry.level || "", 12)}</p>
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, rank, isCurrentUser }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
        isCurrentUser
          ? "border-purple-500/40 bg-purple-500/10"
          : "border-white/5 bg-white/[0.02] hover:border-white/10"
      }`}
    >
      {/* Rank */}
      <div className="w-10 text-center flex-shrink-0">
        {rank <= 3 ? (
          <span className={`text-xl ${rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : "rank-3"}`}>
            {getRankMedal(rank)}
          </span>
        ) : (
          <span className="text-white/40 text-sm font-mono">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
        {entry.emoji || "🧠"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white text-sm truncate">{truncate(entry.name, 18)}</p>
          {isCurrentUser && (
            <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30">You</span>
          )}
        </div>
        <p className="text-white/40 text-xs">{truncate(entry.level || "Brainrot Enjoyer", 22)}</p>
      </div>

      {/* Score */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-purple-300 font-mono">{entry.score}</p>
        <p className="text-white/30 text-xs">{timeSince(entry.created_at)}</p>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const { sounds } = useSound();
  const { entries, isLoading, error, lastUpdated, fetchLeaderboard } = useLeaderboard(true);
  const [filter, setFilter] = useState("all");
  const currentUser = storage.get(PLAYER_NAME_KEY, "");

  const filters = [
    { id: "all", label: "All Time 🌍" },
    { id: "today", label: "Today 📅" },
    { id: "top10", label: "Top 10 🏅" },
  ];

  const filteredEntries = entries.filter((e) => {
    if (filter === "today") {
      const today = new Date().toDateString();
      return new Date(e.created_at).toDateString() === today;
    }
    if (filter === "top10") return true;
    return true;
  }).slice(0, filter === "top10" ? 10 : 50);

  return (
    <div className="min-h-[85vh] py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl font-display font-bold gradient-text mb-2">
            Global Leaderboard
          </h1>
          <p className="text-white/50">The most cooked brains on the planet 🧠</p>
          {lastUpdated && (
            <p className="text-white/20 text-xs mt-2">
              Updated {timeSince(lastUpdated)}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 justify-center mb-6 animate-fade-up animate-delay-100">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); sounds.click(); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-white/50 hover:text-white bg-white/5 border border-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass-card p-6 text-center">
            <p className="text-red-400 mb-3">⚠️ {error}</p>
            <button onClick={fetchLeaderboard} className="btn-ghost">Retry</button>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && filteredEntries.length > 0 && (
          <>
            {/* Top 3 podium */}
            {filter !== "top10" && filteredEntries.length >= 3 && (
              <div className="glass-card p-8 mb-6 animate-fade-up animate-delay-200">
                <div className="flex items-end justify-center gap-4">
                  {[filteredEntries[1], filteredEntries[0], filteredEntries[2]].map(
                    (entry, i) => entry && <TopThreeCard key={entry.id} entry={entry} rank={i === 0 ? 2 : i === 1 ? 1 : 3} />
                  )}
                </div>
              </div>
            )}

            {/* Full list */}
            <div className="space-y-2 animate-fade-up animate-delay-300">
              {filteredEntries.map((entry, i) => (
                <LeaderboardRow
                  key={entry.id || i}
                  entry={entry}
                  rank={i + 1}
                  isCurrentUser={
                    currentUser && entry.name.toLowerCase() === currentUser.toLowerCase()
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredEntries.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">🏜️</div>
            <h3 className="text-xl font-bold text-white mb-2">No scores yet</h3>
            <p className="text-white/50 mb-6">Be the first to claim the throne!</p>
            <button onClick={() => { sounds.click(); navigate("/quiz"); }} className="btn-neon">
              Take the Test ⚡
            </button>
          </div>
        )}

        {/* CTA */}
        {filteredEntries.length > 0 && (
          <div className="text-center mt-8 animate-fade-up animate-delay-500">
            <button
              onClick={() => { sounds.click(); navigate("/quiz"); }}
              className="btn-neon inline-flex items-center gap-2"
            >
              🔥 Claim Your Spot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
