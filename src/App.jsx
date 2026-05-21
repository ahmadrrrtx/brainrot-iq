// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Landing = lazy(() => import('./pages/Landing'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Results = lazy(() => import('./pages/Results'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/Profile'));

function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}>
      <div style={{ fontSize: '64px' }}>🧠</div>
      <div style={{ color: '#9f67fa', fontSize: '18px', fontWeight: '600' }}>
        Loading...
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px',
      color: 'white',
    }}>
      <div style={{ fontSize: '80px', marginBottom: '16px' }}>🤖</div>
      <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '8px' }}>404</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        This page doesn't exist in our universe
      </p>
      <a
        href="/"
        style={{
          padding: '12px 24px',
          background: '#7c3aed',
          color: 'white',
          borderRadius: '12px',
          fontWeight: '700',
          textDecoration: 'none',
        }}
      >
        🏠 Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
