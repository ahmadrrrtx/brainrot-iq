import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Page title updater
function PageTitleUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titles = {
      "/": "Brainrot IQ Test — How Cooked Is Your Brain? 🧠",
      "/quiz": "Take the Quiz — Brainrot IQ Test",
      "/results": "Your Results — Brainrot IQ Test",
      "/leaderboard": "Global Leaderboard — Brainrot IQ Test",
      "/profile": "Your Profile — Brainrot IQ Test",
    };
    document.title = titles[pathname] || "Brainrot IQ Test";
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <PageTitleUpdater />
      <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <footer className="text-center py-6 text-white/30 text-sm">
          <p>
            Made with 🧠 brainrot ·{" "}
            <a
              href="https://github.com/ahmadrrrtx/brainrot-iq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </Router>
  );
}
