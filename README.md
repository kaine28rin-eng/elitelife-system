# EliteLife System — Cinematic Poll Experience

A premium, cinematic web experience for student polling. Built with React + GSAP + Three.js.

---

## Stack

- **React** (Vite)
- **GSAP** + **ScrollTrigger** — all major animations
- **Three.js** — WebGL particle field background
- **Tailwind CSS** — utility styling
- **Supabase** — data backend

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Copy `.env.example` to `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create Supabase table

Run this SQL in your Supabase SQL editor:

```sql
CREATE TABLE poll_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  need TEXT NOT NULL,
  difficulty_module TEXT NOT NULL,
  weak_module TEXT NOT NULL,
  level TEXT NOT NULL,
  study_method TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;

-- Allow insert only (no read from client)
CREATE POLICY "Allow insert" ON poll_responses
  FOR INSERT WITH CHECK (true);
```

### 4. Run dev server

```bash
npm run dev
```

### 5. Usage with UID

Share links in the format:

```
https://your-domain.com/?uid=STUDENT_ID_HERE
```

The `uid` prevents duplicate submissions and identifies each student.

---

## Architecture

```
src/
├── components/
│   ├── ThreeBackground.jsx   — WebGL particle field (Three.js)
│   ├── Cursor.jsx            — Custom cursor with GSAP follow
│   ├── Hero.jsx              — Cinematic landing section
│   ├── ScrollSections.jsx    — ScrollTrigger storytelling (3 sections)
│   ├── PollExperience.jsx    — 5-question guided poll
│   ├── LoadingScreen.jsx     — Submission loading animation
│   └── ResultScreen.jsx      — Cinematic result reveal
├── utils/
│   └── supabase.js           — POST to Supabase REST API
├── App.jsx                   — Phase state machine
├── main.jsx
└── index.css                 — Global styles + utilities
```

## Animation System

All major transitions use GSAP timelines with custom easing `cubic-bezier(0.16, 1, 0.3, 1)`.

- Hero: staggered char reveal with rotateX
- Scroll sections: ScrollTrigger with slide/blur
- Poll transitions: horizontal slide + blur out/in
- Result: staggered fade from bottom

## Security

- `uid` is read from URL query param only
- No GET endpoints exposed
- Duplicate prevention via Supabase UNIQUE constraint
- RLS enabled — insert only, no read
