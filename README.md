<div align="center">

<img src="public/favicon.svg" alt="BrainRot IQ Logo" width="80" height="80" />

# 🧠 BrainRot IQ

**The AI-powered internet culture quiz that tests how chronically online you really are.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-brainrot--iq.vercel.app-7c3aed?style=for-the-badge)](https://brainrot-iq.vercel.app)
[![Deploy Status](https://img.shields.io/github/deployments/ahmadrrrtx/brainrot-iq/production?label=Vercel&logo=vercel&style=for-the-badge&color=000000)](https://brainrot-iq.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

<p align="center">
  <a href="https://brainrot-iq.vercel.app">
    <img src="public/og-image.png" alt="BrainRot IQ Screenshot" width="600" style="border-radius: 16px;" />
  </a>
</p>

<br />

[🎮 **Play Now**](https://brainrot-iq.vercel.app) · [🏆 **Leaderboard**](https://brainrot-iq.vercel.app/leaderboard) · [🐛 **Report Bug**](https://github.com/ahmadrrrtx/brainrot-iq/issues/new?template=bug_report.md) · [💡 **Request Feature**](https://github.com/ahmadrrrtx/brainrot-iq/issues/new?template=feature_request.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [IQ Tiers](#-iq-tiers)
- [Scoring System](#-scoring-system)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [SEO & Performance](#-seo--performance)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Overview

**BrainRot IQ** is a free, AI-powered quiz application that tests your knowledge of internet culture, Gen-Z slang, TikTok trends, viral memes, and brainrot content. Every quiz is **100% unique** — powered by Groq's LLaMA 3.3 70B model to generate fresh questions each time.

> *No signup. No payment. Just pure, unfiltered brainrot.*

### Why BrainRot IQ?

| Problem | Our Solution |
|---------|-------------|
| Static quiz sites get boring fast | ✅ AI generates unique questions every game |
| Most quizzes have no social element | ✅ Global leaderboard + shareable result cards |
| Complex onboarding kills engagement | ✅ Just enter your name and play — that's it |
| No feedback on performance | ✅ 8 IQ tiers with AI-generated personalized verdicts |

---

## ✨ Features

<table>
  <tr>
    <td align="center">🤖</td>
    <td><strong>AI-Generated Questions</strong><br/>Groq LLaMA 3.3 70B creates unique questions every session across 10+ topic categories</td>
  </tr>
  <tr>
    <td align="center">🎴</td>
    <td><strong>Shareable Result Cards</strong><br/>Download a beautiful 1080×1080px PNG card perfect for Instagram Stories, Twitter, and WhatsApp</td>
  </tr>
  <tr>
    <td align="center">🏆</td>
    <td><strong>Global Leaderboard</strong><br/>Real-time rankings powered by Supabase with difficulty filtering and live updates</td>
  </tr>
  <tr>
    <td align="center">⏱️</td>
    <td><strong>Speed Scoring</strong><br/>20-second countdown timer with bonus points for fast answers</td>
  </tr>
  <tr>
    <td align="center">🔥</td>
    <td><strong>Streak Bonuses</strong><br/>Chain correct answers for multiplied bonus points</td>
  </tr>
  <tr>
    <td align="center">🎯</td>
    <td><strong>3 Difficulty Modes</strong><br/>Easy (1×), Medium (1.5×), Hard (2×) — each with different multipliers</td>
  </tr>
  <tr>
    <td align="center">📱</td>
    <td><strong>Mobile-First PWA</strong><br/>Installable on mobile, works offline, optimized for all screen sizes</td>
  </tr>
  <tr>
    <td align="center">🔒</td>
    <td><strong>Secure Architecture</strong><br/>API keys never exposed client-side — all AI calls go through Vercel serverless functions</td>
  </tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | [React 19](https://react.dev) | UI rendering |
| **Build Tool** | [Vite 5](https://vitejs.dev) | Fast builds & HMR |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) | Utility-first CSS |
| **Animation** | [Framer Motion 11](https://framer.com/motion) | Smooth transitions |
| **Routing** | [React Router v6](https://reactrouter.com) | Client-side navigation |
| **AI Engine** | [Groq API](https://groq.com) (LLaMA 3.3 70B) | Question generation |
| **Database** | [Supabase](https://supabase.com) (PostgreSQL) | Leaderboard storage |
| **API Layer** | [Vercel Serverless Functions](https://vercel.com/docs/functions) | Secure AI proxy |
| **Hosting** | [Vercel](https://vercel.com) | Edge deployment + CDN |
| **Cards** | HTML5 Canvas API | Result card generation |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                     │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Landing  │  │  Quiz    │  │ Results  │   (React)    │
│  │  Page    │  │  Engine  │  │  + Card  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│        │              │              │                  │
│        └──────────────┼──────────────┘                  │
│                       │                                 │
│              ┌────────┴────────┐                        │
│              │   React Router  │                        │
│              │   + Lazy Load   │                        │
│              └────────┬────────┘                        │
└───────────────────────┼─────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
┌──────────────┐  ┌──────────┐  ┌──────────────┐
│  Vercel Edge │  │ Supabase │  │   Vercel CDN │
│  Function    │  │ (DB)     │  │   (Assets)   │
│              │  │          │  │              │
│ /api/        │  │ scores   │  │ /dist/*      │
│ generate-    │  │ table    │  │              │
│ questions    │  │          │  │              │
└──────┬───────┘  └──────────┘  └──────────────┘
       │
       ▼
┌──────────────┐
│  Groq API    │
│  LLaMA 3.3   │
│  70B Model   │
└──────────────┘
```

### Data Flow

```
User starts quiz
      │
      ▼
POST /api/generate-questions
      │
      ▼
Vercel Function → Groq API → Returns 10 questions
      │
      ▼
User answers questions (client-side state)
      │
      ▼
Quiz completes → calculateScore()
      │
      ├──► Save to Supabase (leaderboard)
      │
      ├──► Save to localStorage (results page)
      │
      └──► Navigate to /results
                │
                ├──► Display tier + stats
                ├──► Generate Canvas card (PNG)
                └──► Share options
```

---

## 🧠 IQ Tiers

| % Score | Tier | Emoji | Description |
|---------|------|-------|-------------|
| 0 – 10% | NPC Mode | 🤖 | You probably still use Internet Explorer |
| 11 – 20% | Casual Scroller | 📱 | You've seen memes before. In a museum. |
| 21 – 35% | Main Character Era | ✨ | Living your best life, chronically mid |
| 36 – 50% | Internet Citizen | 🌐 | Fluent in meme language |
| 51 – 65% | Chronically Online | ⚡ | When did you last go outside? |
| 66 – 80% | Certified Brainrot | 🧠 | Memes are your second language |
| 81 – 90% | Sigma Grindset | 👑 | Operating on a different wavelength |
| 91 – 100% | Supreme BrainRot Lord | 🚀 | You ARE the algorithm |

---

## 📊 Scoring System

```
Final Score = (Base + Time Bonus + Streak Bonus) × Difficulty Multiplier
```

### Base Score
```
Each correct answer = +100 points
```

### Time Bonus (per correct answer)
```
≤  5 seconds  →  +50 points  ⚡ Lightning
≤ 10 seconds  →  +25 points  🔥 Fast
≤ 15 seconds  →  +10 points  ✅ Normal
>  15 seconds →   +0 points  🐢 Slow
```

### Streak Bonus
```
3+ correct answers in a row → +25 points per answer
```

### Difficulty Multiplier
```
Easy    ×1.0  →  "For casuals who occasionally touch grass"
Medium  ×1.5  →  "For those who know what NPC means"
Hard    ×2.0  →  "Only true sigma level brainrot masters"
```

### Example Calculation
```
10/10 correct on Hard difficulty, avg 7s response time:
  Base:    10 × 100 = 1,000
  Time:    10 × 25  =   250
  Streak:  8  × 25  =   200  (streak bonus kicks in at Q3)
  Total:   (1000 + 250 + 200) × 2.0 = 2,900 points
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **Groq API Key** — Free at [console.groq.com](https://console.groq.com)
- **Supabase Project** — Free at [supabase.com](https://supabase.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/ahmadrrrtx/brainrot-iq.git
cd brainrot-iq
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the root:
```env
# Supabase (client-side — safe with RLS enabled)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Groq (server-side only — NEVER expose this to client)
GROQ_API_KEY=gsk_your_groq_api_key_here
```

> ⚠️ `GROQ_API_KEY` has **no `VITE_` prefix** intentionally — it's only used in `api/generate-questions.js` (server-side)

**4. Set up Supabase database**

Run this SQL in your [Supabase SQL Editor](https://app.supabase.com):

```sql
-- Create scores table
CREATE TABLE scores (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  score       INTEGER     NOT NULL,
  total       INTEGER     NOT NULL DEFAULT 10,
  difficulty  TEXT        NOT NULL DEFAULT 'medium',
  time_taken  INTEGER     DEFAULT 0,
  tier        TEXT        DEFAULT '',
  percentage  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "allow_read_scores" ON scores
  FOR SELECT TO anon, authenticated USING (true);

-- Public write policy
CREATE POLICY "allow_insert_scores" ON scores
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Performance indexes
CREATE INDEX idx_scores_score_desc   ON scores(score DESC);
CREATE INDEX idx_scores_difficulty   ON scores(difficulty);
CREATE INDEX idx_scores_created_at   ON scores(created_at DESC);
CREATE INDEX idx_scores_percentage   ON scores(percentage DESC);
```

**5. Run locally**

```bash
# Option A: Vite dev server (frontend only)
npm run dev

# Option B: Full stack with serverless functions (recommended)
npx vercel dev
```

App runs at `http://localhost:3000`

---

## 🚢 Deployment

### Vercel (Recommended)

BrainRot IQ is optimized for Vercel. Every push to `main` auto-deploys.

**Step 1:** Fork this repo

**Step 2:** Import to Vercel
```
vercel.com/new → Import Git Repository → Select brainrot-iq
```

**Step 3:** Add Environment Variables in Vercel Dashboard

```
Settings → Environment Variables → Add:

┌────────────────────────┬─────────────────────────────────────┬─────────────┐
│ Name                   │ Value                               │ Environment │
├────────────────────────┼─────────────────────────────────────┼─────────────┤
│ VITE_SUPABASE_URL      │ https://xxx.supabase.co             │ All         │
│ VITE_SUPABASE_ANON_KEY │ eyJhbGciOiJIUzI1NiIs...            │ All         │
│ GROQ_API_KEY           │ gsk_xxxxxxxxxxxxxxxxxxxx            │ All         │
└────────────────────────┴─────────────────────────────────────┴─────────────┘
```

**Step 4:** Deploy — done! ✅

Every `git push` to `main` triggers automatic deployment.

---

## 📁 Project Structure

```
brainrot-iq/
│
├── 📂 api/                          # Vercel Serverless Functions
│   └── generate-questions.js        # Groq AI integration (server-side)
│
├── 📂 public/                       # Static assets
│   ├── favicon.svg
│   ├── manifest.json                # PWA manifest
│   ├── robots.txt                   # Search engine directives
│   └── sitemap.xml                  # URL sitemap
│
├── 📂 src/
│   ├── 📂 components/               # Reusable UI components
│   │   ├── LoadingScreen.jsx        # Animated loading state
│   │   ├── NameModal.jsx            # Name input modal
│   │   ├── Navbar.jsx               # Navigation bar
│   │   ├── ShareCard.jsx            # 🎴 Result card generator (Canvas)
│   │   ├── Timer.jsx                # SVG countdown ring
│   │   └── Toast.jsx                # Notification toasts
│   │
│   ├── 📂 hooks/                    # Custom React hooks
│   │   ├── useLeaderboard.js        # Leaderboard data fetching
│   │   ├── useQuiz.js               # Core quiz state machine
│   │   └── useSound.js              # Sound effects
│   │
│   ├── 📂 pages/                    # Route-level components
│   │   ├── Landing.jsx              # Home page (6 sections)
│   │   ├── Leaderboard.jsx          # Global rankings
│   │   ├── Profile.jsx              # User profile
│   │   ├── Quiz.jsx                 # Quiz engine
│   │   └── Results.jsx              # Score + card sharing
│   │
│   ├── App.jsx                      # Root component + routing
│   ├── constants.js                 # Config, tiers, scoring
│   ├── index.css                    # Global styles + Tailwind
│   ├── main.jsx                     # React entry point
│   ├── supabase.js                  # Supabase client + DB ops
│   └── utils.js                     # Pure utility functions
│
├── index.html                       # HTML entry + SEO meta tags
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json                      # Vercel routing config
```

---

## 🔌 API Reference

### `POST /api/generate-questions`

Generates AI-powered quiz questions using Groq.

**Request Body**
```json
{
  "difficulty": "easy" | "medium" | "hard",
  "count": 10
}
```

**Response (Success)**
```json
{
  "questions": [
    {
      "id": 1,
      "question": "What does 'rizz' mean in Gen-Z slang?",
      "options": [
        "Natural charm and charisma",
        "Being angry or upset",
        "Feeling very tired",
        "A type of hairstyle"
      ],
      "answer": "Natural charm and charisma",
      "explanation": "Rizz = charisma. W rizz = great charm!",
      "category": "Gen-Z Slang",
      "emoji": "✨"
    }
  ],
  "fallback": false
}
```

**Response (Fallback — AI unavailable)**
```json
{
  "questions": [...],
  "fallback": true,
  "reason": "Groq API timeout"
}
```

> The API always returns questions — either AI-generated or from the curated fallback bank. The app never breaks.

---

## 🗄️ Database Schema

### `scores` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` | Primary key (auto-generated) |
| `name` | `TEXT` | Player name (max 20 chars) |
| `score` | `INTEGER` | Correct answers (0–10) |
| `total` | `INTEGER` | Total questions (default: 10) |
| `difficulty` | `TEXT` | `easy` \| `medium` \| `hard` |
| `time_taken` | `INTEGER` | Total time in seconds |
| `tier` | `TEXT` | Score percentage string |
| `percentage` | `INTEGER` | Score percentage (0–100) |
| `created_at` | `TIMESTAMPTZ` | Submission timestamp |

**Indexes**
```sql
idx_scores_score_desc   -- Fast leaderboard queries
idx_scores_difficulty   -- Filter by difficulty
idx_scores_created_at   -- Recent scores
idx_scores_percentage   -- Sort by percentage
```

---

## 🔍 SEO & Performance

### Lighthouse Scores (Target)

```
Performance    ████████████████████  95+
Accessibility  ████████████████████  95+
Best Practices ████████████████████  95+
SEO            ████████████████████  100
```

### SEO Implementation

| Feature | Implementation |
|---------|---------------|
| Meta tags | Complete Open Graph + Twitter Card |
| Structured data | Schema.org `WebApplication` + `FAQPage` |
| Sitemap | `/sitemap.xml` with all routes |
| Robots | `/robots.txt` allowing all crawlers |
| PWA | `manifest.json` + installable |
| Performance | Code splitting + lazy loading |
| Fonts | Google Fonts with `display=swap` |

### Target Keywords

```
Primary:    brainrot iq, brainrot quiz, internet culture quiz
Secondary:  gen-z quiz, meme quiz, chronically online quiz
Long-tail:  tiktok knowledge test 2024, sigma quiz, rizz test
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

**1. Fork & Clone**
```bash
git clone https://github.com/YOUR_USERNAME/brainrot-iq.git
```

**2. Create a branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**3. Make changes & commit**
```bash
git add .
git commit -m "feat: add your feature description"
```

**4. Push & PR**
```bash
git push origin feature/your-feature-name
# Then open a Pull Request on GitHub
```

### Commit Convention

| Prefix | Use for |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `ui:` | UI/UX changes |
| `perf:` | Performance improvements |
| `docs:` | Documentation |
| `chore:` | Maintenance |

---

## 📄 License

```
MIT License

Copyright (c) 2024 BrainRot IQ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

### 🧠 BrainRot IQ

**Built for the chronically online. No cap.**

[![Play Now](https://img.shields.io/badge/🎮_Play_Now-brainrot--iq.vercel.app-7c3aed?style=for-the-badge)](https://brainrot-iq.vercel.app)

<br/>

⭐ **Star this repo** if you found it useful — it helps more people discover it!

<br/>

*Made with 🧠 + too much internet culture*

</div>
