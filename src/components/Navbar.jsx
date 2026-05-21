import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSound } from "../hooks/useSound";

const navLinks = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/quiz", label: "Quiz", icon: "🧠" },
  { path: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { path: "/profile", label: "Profile", icon: "👤" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { soundEnabled, toggleSound, sounds } = useSound();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              onClick={() => sounds.click()}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
                🧠
              </div>
              <span className="font-display font-bold text-white text-lg hidden sm:block group-hover:text-purple-300 transition-colors">
                BrainrotIQ
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => sounds.click()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.path
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Sound toggle */}
              <button
                onClick={() => { toggleSound(); sounds.click(); }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Toggle sound"
                title={soundEnabled ? "Mute sounds" : "Enable sounds"}
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>

              {/* Start Quiz CTA */}
              <Link
                to="/quiz"
                onClick={() => sounds.click()}
                className="hidden sm:flex btn-neon text-sm py-2 px-4 rounded-lg items-center gap-1.5"
              >
                Start Quiz ⚡
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => { setMenuOpen((p) => !p); sounds.click(); }}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all"
                aria-label="Toggle menu"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 animate-fade-in">
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.path
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <Link
                to="/quiz"
                className="btn-neon text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 mt-2"
              >
                Start Quiz ⚡
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
