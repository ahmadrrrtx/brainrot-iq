// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingScreen from './components/LoadingScreen';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Results = lazy(() => import('./pages/Results'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/Profile'));

function PageFallback() {
  return <LoadingScreen message="Loading..." />;
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-4">🤖</div>
      <h1 className="text-4xl font-black text-white mb-2">404</h1>
      <p className="text-gray-400 mb-6">This page doesn't exist in our universe</p>
      <a href="/" className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl">
        🏠 Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
