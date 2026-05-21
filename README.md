<div align="center">

# 🧠 BrainRot IQ

### *How chronically online are you?*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-brainrot--iq.vercel.app-7c3aed?style=for-the-badge&logoColor=white)](https://brainrot-iq.vercel.app)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Powered by Groq](https://img.shields.io/badge/AI-Groq_LLaMA_3.3-FF6B35?style=for-the-badge)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

**BrainRot IQ** is an AI-powered internet culture quiz that tests your knowledge of  
memes, Gen-Z slang, TikTok trends, viral moments, and brainrot content.

[🎮 Play Now](https://brainrot-iq.vercel.app) · [🏆 Leaderboard](https://brainrot-iq.vercel.app/leaderboard) · [🐛 Report Bug](https://github.com/ahmadrrrtx/brainrot-iq/issues) · [⭐ Star this repo](https://github.com/ahmadrrrtx/brainrot-iq)

</div>

---

## 📊 Project Stats
┌─────────────────────────────────────────────────────────────┐
│ BRAINROT IQ METRICS │
├──────────────────┬──────────────────┬───────────────────────┤
│ 🤖 AI Engine │ ⚡ Performance │ 🌐 Reach │
│ Groq LLaMA 3.3 │ <100ms API │ SEO Optimized │
│ 70B Parameters │ 95+ Lighthouse │ Open Graph Ready │
│ Unique per game │ PWA Support │ Schema Markup │
├──────────────────┼──────────────────┼───────────────────────┤
│ 🎮 Gameplay │ 🏆 Social │ 🔒 Security │
│ 10 Questions │ Global Ranks │ Serverless API │
│ 3 Difficulties │ Share Results │ No Keys Exposed │
│ 20s Timer │ Streak Bonuses │ Rate Limited │
└──────────────────┴──────────────────┴───────────────────────┘


## 🎯 Quiz Difficulty Tiers

EASY ████████████░░░░░░░░ Multiplier: 1x
"For casuals who occasionally touch grass"

MEDIUM ████████████████░░░ Multiplier: 1.5x ← Most Popular
"For those who know what NPC means"

HARD ████████████████████ Multiplier: 2x
"Only true sigma level brainrot masters"


## 🧠 IQ Score Tiers
Score % Tier Description
─────────────────────────────────────────────────
0-10% → 🤖 NPC Mode "Still using Internet Explorer"
11-20% → 📱 Casual Scroller "Seen memes. In a museum."
21-35% → ✨ Main Character Era "Living your best life"
36-50% → 🌐 Internet Citizen "Fluent in meme language"
51-65% → ⚡ Chronically Online "When did you last go outside?"
66-80% → 🧠 Certified Brainrot "Memes are your 2nd language"
81-90% → 👑 Sigma Grindset "Different wavelength entirely"
91-100%→ 🚀 Supreme BrainRot "You ARE the algorithm"


## 🏗️ Architecture
brainrot-iq/
├── 🌐 Frontend (React + Vite)
│ ├── src/
│ │ ├── pages/ # Route-level components
│ │ │ ├── Landing.jsx # Home page with difficulty selector
│ │ │ ├── Quiz.jsx # Main quiz engine
│ │ │ ├── Results.jsx # Score display + sharing
│ │ │ ├── Leaderboard.jsx
│ │ │ └── Profile.jsx
│ │ ├── components/ # Reusable UI components
│ │ │ ├── Timer.jsx # Countdown with SVG ring
│ │ │ ├── LoadingScreen.jsx
│ │ │ ├── Toast.jsx
│ │ │ ├── Navbar.jsx
│ │ │ └── NameModal.jsx
│ │ ├── hooks/ # Custom React hooks
│ │ │ ├── useQuiz.js # Core quiz state machine
│ │ │ ├── useLeaderboard.js
│ │ │ └── useSound.js
│ │ ├── constants.js # Config, tiers, scoring
│ │ ├── supabase.js # DB client + operations
│ │ └── utils.js # Pure utility functions
│ └── public/ # Static assets + SEO files
│ ├── manifest.json # PWA manifest
│ ├── robots.txt # Search engine directives
│ └── sitemap.xml # URL sitemap
│
├── ⚡ Serverless API (Vercel Functions)
│ └── api/
│ └── generate-questions.js # Groq AI integration
│
└── 🗄️ Database (Supabase)
└── scores table # Leaderboard data


## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI rendering |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Animation** | Framer Motion | Smooth transitions |
| **AI Engine** | Groq (LLaMA 3.3 70B) | Question generation |
| **Database** | Supabase (PostgreSQL) | Leaderboard storage |
| **Routing** | React Router v6 | Client-side navigation |
| **Hosting** | Vercel | Edge deployment |
| **API** | Vercel Serverless | Secure AI proxy |

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- A Groq API key (free at [console.groq.com](https://console.groq.com))
- A Supabase project (free at [supabase.com](https://supabase.com))

### 1. Clone & Install
```bash
git clone https://github.com/ahmadrrrtx/brainrot-iq.git
cd brainrot-iq
npm install
```
2. Environment Variables
Create .env.local:

env
```
# Client-side (Supabase only - safe to expose with RLS)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server-side only (Vercel Functions - never exposed to client)
GROQ_API_KEY=gsk_your_groq_key_here
```
3. Supabase Setup
Run this SQL in your Supabase dashboard:
```
-- Create scores table
CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL DEFAULT 10,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  time_taken INTEGER DEFAULT 0,
  tier TEXT,
  percentage INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores
CREATE POLICY "Anyone can read scores" ON scores
  FOR SELECT USING (true);

-- Allow anyone to insert scores  
CREATE POLICY "Anyone can insert scores" ON scores
  FOR INSERT WITH CHECK (true);

-- Index for performance
CREATE INDEX idx_scores_score ON scores(score DESC);
CREATE INDEX idx_scores_difficulty ON scores(difficulty);
CREATE INDEX idx_scores_created_at ON scores(created_at DESC);
```
4. Run Locally
```
Bash

npm run dev
```
App runs at http://localhost:3000

Note: For local API testing, use Vercel CLI:

```Bash

npm i -g vercel
vercel dev
```
### 🚀 Deployment
Vercel (Recommended - Auto Deploy)
Fork this repo on GitHub
Connect to Vercel: vercel.com/new → Import from GitHub
Add Environment Variables in Vercel dashboard:
```text

VITE_SUPABASE_URL      = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key  
GROQ_API_KEY           = your_groq_api_key
```
Deploy → Every git push to main auto-deploys ✅
### 🔍 SEO & Discoverability
This project is optimized for:
```text

Search Visibility
─────────────────
✅ Google (Schema.org structured data)
✅ Bing (Open Graph tags)
✅ Twitter/X (Twitter Cards)
✅ Facebook (Open Graph)
✅ WhatsApp (Rich previews)
✅ AI Search (ChatGPT, Perplexity, etc.)
✅ PWA (Installable on mobile)
✅ Core Web Vitals optimized
```
### Target Keywords:

brainrot iq test
internet culture quiz
gen-z meme quiz
chronically online quiz
tiktok knowledge test
brainrot quiz 2026

### 📈 Scoring System
```text

Base Score:    Correct × 100 points

Time Bonuses:
  ≤ 5 seconds  → +50 points
  ≤ 10 seconds → +25 points  
  ≤ 15 seconds → +10 points

Streak Bonus: 
  3+ correct in a row → +25 points per answer

Difficulty Multiplier:
  Easy   × 1.0
  Medium × 1.5
  Hard   × 2.0

Final = (Base + Bonuses) × Difficulty Multiplier
```
🤝 Contributing
Contributions are welcome! Please:

Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Commit changes: git commit -m 'Add amazing feature'
Push: git push origin feature/amazing-feature
Open a Pull Request
📄 License
MIT License - see LICENSE for details.
<div align="center">
Made with 🧠 and too much internet culture

⭐ Star this repo if you found it useful!

brainrot-iq.vercel.app

</div> ```
