# FitPlan — Athletic Performance & Macro System ⚡

FitPlan is a high-output, mobile-first fitness and nutrition web application designed for quick mid-workout glancing and athletic performance tracking. 

Built with **React, Vite, Tailwind CSS, Express, and MongoDB**, it features precision BMR/TDEE calculation, a rule-based workout split generator with condition filtering, CSS keyframe exercise technique animations, YouTube execution embeds, daily weight tracking, achievement badges, and a dummy Pro subscription model.

---

## 🚀 Key Features

- 🏋️ **No-Auth Single-Session Profile:** Instant access stored in `localStorage` — no sign-up friction.
- 📊 **Precision Macro Engine:** Calculates BMR using the Mifflin-St Jeor equation, TDEE activity multipliers, and macro splits for **Cut (-500 kcal)**, **Maintain (TDEE)**, or **Bulk (+300 kcal)** goals.
- 🛡️ **Rule-Based Workout Split Generator:** Automatically constructs target splits (Push/Pull/Legs, Cardio HIIT, or Hybrid) while excluding exercises incompatible with user-specified health conditions (e.g. knee or shoulder strain).
- 🎬 **Technique Motion & Safety Warnings:** CSS keyframe movement animations for exercises, safety warnings highlighted in caution tokens (`#FF6B4A`), benefits, and embedded YouTube execution videos.
- 📈 **Telemetry & Weight Progress:** Dynamic weight line chart powered by **Recharts**, plus daily logging.
- 🏆 **Achievement Badge Engine:** Computes earned badges dynamically from check-in logs and consecutive streaks.
- 💎 **Pro Performance Tier (Dummy):** Integrated toggle for Pro features like AI Coach Daily Execution Insights.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Node.js, Express.js, Mongoose (MongoDB)
- **Database:** MongoDB (Local, Atlas, or auto In-Memory fallback for zero-setup execution)
- **Design Tokens:** Dark Mode Palette (`#0E0F11` BG, `#1A1C1F` Surface, `#D6FF3F` Acid Green Accent)

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fitplan.git
   cd fitplan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Seed Database (Optional):**
   Seed the reference exercise library and badges:
   ```bash
   npm run seed
   ```

5. **Start Development Server:**
   Run frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛰️ API Routes Summary

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/profiles` | Create profile & auto-generate initial diet & workout plans |
| `GET` | `/api/profiles/:id` | Fetch profile details |
| `PATCH` | `/api/profiles/:id` | Update profile settings (e.g. `isPremium`) |
| `GET` | `/api/profiles/:id/diet-plan` | Fetch latest macro diet plan |
| `GET` | `/api/profiles/:id/workout-plan` | Fetch target workout split with exercise details |
| `POST` | `/api/profiles/:id/logs` | Log daily body weight or completed workout day |
| `GET` | `/api/profiles/:id/logs` | Fetch daily check-in history |
| `GET` | `/api/profiles/:id/badges` | Compute earned achievements from log history |
| `POST` | `/api/profiles/:id/ai-tip` | Fetch AI Coach tip of the day (Requires Pro status) |
