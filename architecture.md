# FitPlan — Architecture Document

**Purpose of this doc:** This is the build spec for an AI coding agent (Antigravity). It defines stack, data models, file structure, and feature logic precisely enough that the agent can scaffold and implement without asking clarifying questions. Follow the phase order — each phase is independently demoable.

---

## 1. Scope

**In scope (build this):**
- No-auth, single-session user profile (local state, no login)
- Onboarding form → BMR/TDEE calculation → macro plan
- Rule-based workout plan generator (weight training / cardio / mix)
- Exercise detail views with CSS animation, YouTube embed, benefits/warnings
- Daily logging (weight, workout completion)
- Progress dashboard (weight chart, streak, badges)
- Dummy subscription/pricing page with premium-locked UI

**Explicitly out of scope (do not build, mention as "future work" in UI copy only):**
- Real authentication / user accounts
- Real payment processing
- Micronutrient tracking
- Country/region-specific diet databases
- True AI-generated plans (optional stretch: one static "AI tip of the day" API call, see Section 8)

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fast dev loop, matches CSS-animation requirement |
| Charts | Recharts | Simple line/bar charts for progress |
| Backend | Node.js + Express | Thin REST API, no auth middleware needed |
| Database | MongoDB (Atlas free tier or local) + Mongoose | Single-collection-per-entity, no relational joins needed |
| Animation | Pure CSS keyframes | No animation library needed; keep exercise animations lightweight (SVG or div-based) |
| Video | YouTube iframe embed (`<iframe>` with stored video ID) | No YouTube API key required for basic embed |

No auth library. No payment SDK. No ORM beyond Mongoose.

---

## 3. High-Level Architecture

```
[React SPA] <--REST(JSON)--> [Express API] <--Mongoose--> [MongoDB]
```

- Single user model: since there's no login, the app creates **one profile document per browser session** and stores its `_id` in `localStorage`. All subsequent requests pass that `_id` to scope data. This simulates multi-user structure (good for your report) without building real auth.
- Backend is stateless; MongoDB is the only persistence layer.
- No server-side rendering needed — pure SPA + API.

---

## 4. Data Models (MongoDB Collections)

### 4.1 `profiles`
```js
{
  _id: ObjectId,
  name: String,
  age: Number,
  gender: String,        // "male" | "female" | "other" — needed for BMR formula
  weightKg: Number,
  heightCm: Number,
  goal: String,           // "cut" | "maintain" | "bulk"
  activityLevel: String,  // "sedentary" | "light" | "moderate" | "active" | "very_active"
  trainingStyle: String,  // "strength" | "cardio" | "mix"
  conditions: [String],   // free-text tags, e.g. ["knee injury", "peanut allergy"]
  isPremium: Boolean,     // default false, toggled by dummy subscription page
  createdAt: Date
}
```

### 4.2 `dietPlans`
```js
{
  _id: ObjectId,
  profileId: ObjectId,    // ref profiles._id
  bmr: Number,
  tdee: Number,
  macros: {
    calories: Number,
    proteinG: Number,
    carbsG: Number,
    fatG: Number
  },
  generatedAt: Date
}
```

### 4.3 `exercises` (static reference library — seed once, ~40-50 entries)
```js
{
  _id: ObjectId,
  name: String,
  category: String,       // "strength" | "cardio"
  muscleGroup: String,    // "chest" | "back" | "legs" | "shoulders" | "core" | "full_body" | "cardio"
  equipment: String,      // "bodyweight" | "dumbbell" | "barbell" | "machine" | "none"
  benefit: String,        // 1-2 sentence description
  warning: String,        // injury/form caution text
  youtubeId: String,      // video ID only, not full URL
  animationType: String   // key mapping to a predefined CSS animation component, e.g. "squat", "pushup", "generic"
}
```

### 4.4 `workoutPlans`
```js
{
  _id: ObjectId,
  profileId: ObjectId,
  days: [
    {
      dayLabel: String,     // "Day 1 - Push"
      exercises: [
        { exerciseId: ObjectId, sets: Number, reps: String } // reps as string to allow "12" or "20 min"
      ]
    }
  ],
  generatedAt: Date
}
```

### 4.5 `logs`
```js
{
  _id: ObjectId,
  profileId: ObjectId,
  date: Date,
  weightKg: Number,        // optional, only if logged that day
  workoutDayCompleted: String, // dayLabel, optional
  createdAt: Date
}
```

### 4.6 `badges` (static reference, seed once)
```js
{
  _id: ObjectId,
  code: String,            // "streak_7"
  label: String,           // "7-Day Streak"
  rule: String,            // human-readable, e.g. "Log workouts 7 days in a row"
  icon: String             // emoji or icon key
}
```
Badge *earning* is computed on read (check logs against rules), not stored per-user — simpler, no sync issues.

---

## 5. API Endpoints

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/profiles` | Create profile from onboarding form, returns `_id` |
| GET | `/api/profiles/:id` | Fetch profile |
| PATCH | `/api/profiles/:id` | Update profile (e.g. toggle `isPremium`) |
| POST | `/api/profiles/:id/diet-plan` | Generate + store diet plan (calls BMR/TDEE logic, Section 6) |
| GET | `/api/profiles/:id/diet-plan` | Fetch latest diet plan |
| POST | `/api/profiles/:id/workout-plan` | Generate + store workout plan (calls generator, Section 7) |
| GET | `/api/profiles/:id/workout-plan` | Fetch latest workout plan |
| GET | `/api/exercises/:id` | Fetch single exercise detail |
| POST | `/api/profiles/:id/logs` | Add a daily log entry |
| GET | `/api/profiles/:id/logs` | Fetch all logs (for chart + streak calc) |
| GET | `/api/profiles/:id/badges` | Compute + return earned badges from logs |

Keep all responses flat JSON. No pagination needed at this data scale.

---

## 6. Diet Plan Logic (deterministic, not AI)

**BMR — Mifflin-St Jeor equation:**
```
male:   BMR = 10*weightKg + 6.25*heightCm - 5*age + 5
female: BMR = 10*weightKg + 6.25*heightCm - 5*age - 161
```

**TDEE — activity multiplier:**
```
sedentary:   BMR * 1.2
light:       BMR * 1.375
moderate:    BMR * 1.55
active:      BMR * 1.725
very_active: BMR * 1.9
```

**Calorie target by goal:**
```
cut:      TDEE - 500
maintain: TDEE
bulk:     TDEE + 300
```

**Macro split (grams), by goal:**
```
cut:      protein 2.2g/kg, fat 0.8g/kg, remainder from carbs
maintain: protein 1.8g/kg, fat 1.0g/kg, remainder from carbs
bulk:     protein 2.0g/kg, fat 1.0g/kg, remainder from carbs
```
`carbsG = (calorieTarget - protein*4 - fat*9) / 4` — clamp to minimum 50g to avoid negative values on aggressive cuts.

This logic lives in a single pure function, e.g. `services/dietCalculator.js`, unit-testable, no external calls.

---

## 7. Workout Plan Generation Logic (rule-based)

1. Filter `exercises` collection by `category` matching `trainingStyle`:
   - `strength` → category `strength`
   - `cardio` → category `cardio`
   - `mix` → both, roughly 60/40 split strength/cardio
2. Exclude exercises whose `muscleGroup` conflicts with any tag in `profile.conditions` (simple string-match rule, e.g. condition contains "knee" → exclude `muscleGroup: legs` exercises tagged high-impact — keep this mapping small and explicit, not smart).
3. Assign a split based on `trainingStyle` + implicit frequency:
   - Strength → 4-day split (Push / Pull / Legs / Full Body)
   - Cardio → 3-day split (HIIT / Steady-State / Active Recovery)
   - Mix → alternate strength day / cardio day, 5 days
4. For each day, randomly select 5-6 exercises matching that day's muscle group tag from the filtered pool, assign default sets/reps by category (strength: 3 sets x 10-12 reps; cardio: 1 "set" x duration string like "20 min").
5. Store result in `workoutPlans`.

This is a deterministic selection algorithm with a random component for variety — no ML, fully explainable in your report/defense.

---

## 8. Optional Stretch: Legitimate "AI" Touchpoint

If you want one real AI feature without overscoping: a single endpoint `POST /api/profiles/:id/ai-tip` that sends the profile JSON (goal, trainingStyle, macros) to an LLM API and returns a 2-3 sentence motivational/technique tip. This is the *only* place "AI" appears — label it clearly in the UI as "AI Tip of the Day" so it's honest about scope. Gate this behind `isPremium` for a natural monetization tie-in.

---

## 9. Frontend Structure

```
src/
  components/
    OnboardingForm.jsx
    DietPlanCard.jsx
    WorkoutDayCard.jsx
    ExerciseDetailModal.jsx      // CSS animation + video + benefit/warning
    ProgressChart.jsx
    BadgeList.jsx
    PricingPage.jsx              // dummy subscription page
    PremiumLock.jsx              // wrapper component, shows lock overlay if !isPremium
  pages/
    Onboarding.jsx
    Dashboard.jsx
    WorkoutPlan.jsx
    Progress.jsx
    Pricing.jsx
  animations/
    SquatAnimation.css
    PushupAnimation.css
    GenericAnimation.css
  services/
    api.js                      // fetch wrapper for backend calls
  App.jsx
  main.jsx
```

## 10. Backend Structure

```
server/
  models/
    Profile.js
    DietPlan.js
    Exercise.js
    WorkoutPlan.js
    Log.js
    Badge.js
  services/
    dietCalculator.js           // Section 6 logic, pure functions
    workoutGenerator.js         // Section 7 logic
    badgeEngine.js               // computes earned badges from logs
  routes/
    profiles.js
    exercises.js
    logs.js
  seed/
    seedExercises.js            // run once to populate exercises collection
    seedBadges.js
  server.js
```

---

## 11. Build Order (maps to the 10-day plan)

1. MongoDB connection + Profile model + onboarding form + POST/GET profile
2. `dietCalculator.js` + diet plan endpoint + DietPlanCard UI
3. Seed `exercises` collection + `workoutGenerator.js` + workout plan endpoint
4. WorkoutPlan UI (daily view, exercise cards)
5. ExerciseDetailModal — CSS animation + YouTube iframe + benefit/warning text
6. Logs model + endpoint + daily logging UI
7. ProgressChart (Recharts) + `badgeEngine.js` + BadgeList UI
8. Pricing.jsx (dummy) + PremiumLock wrapper + isPremium toggle
9. Styling pass, responsive fixes, loading/empty states
10. Seed demo profile with realistic data, bug fixes, rehearse walkthrough

---

## 12. Notes for the Coding Agent

- Do not implement JWT, sessions, or password hashing anywhere — there is no login.
- Do not integrate any payment SDK (Stripe, Razorpay, etc.) — `isPremium` is a plain boolean toggled by a button on `Pricing.jsx`.
- Do not build a micronutrient database or region-specific diet logic — these are explicitly cut.
- Keep `dietCalculator.js` and `workoutGenerator.js` as pure, testable functions with no side effects — this is where a professor will ask "how does this work," so it needs to be traceable line-by-line, not buried in a controller.
- Every exercise document needs a `warning` field populated before demo — do not leave it null, since the "prevent legal issues" framing in the product spec depends on this field always rendering.
