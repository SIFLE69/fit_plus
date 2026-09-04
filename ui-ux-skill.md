---
name: fitplan-ui-ux
description: Visual and interaction design spec for the FitPlan fitness app (onboarding, diet plan, workout plan, exercise detail, progress dashboard, pricing page). Use this whenever building or styling any screen in this project — it defines the palette, type, layout, component rules, and copy voice so every screen looks like one product instead of default SaaS-template output.
---

# FitPlan UI/UX Spec

This app is used mid-workout, on a phone, often sweaty and glancing quickly — not read leisurely at a desk. Every design decision should be judged against that: **can this be read/tapped in under 2 seconds by someone who isn't paying full attention?** If not, simplify it.

Do not default to generic SaaS-dashboard styling (identical rounded cards, one grey drop-shadow on everything, a tracked-out ALL-CAPS eyebrow above every heading, gradient accent washes). Those are template defaults, not choices — this doc replaces them with actual choices for this product.

---

## 1. Design Personality

Athletic, not corporate-wellness. Think **stopwatch and chalk dust**, not spa and smoothie bowl. The user opened this app to work, not to relax — the tone should feel like a coach giving clear instructions, not a wellness app being gentle with you.

Avoid: soft pastel gradients, rounded-everything "friendly app" look, stock fitness photography, motivational-poster clichés ("Your only limit is you").

---

## 2. Color

Base palette — 5 tokens, used consistently everywhere (define as CSS variables, do not introduce new colors per-component):

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0E0F11` | App background — near-black, not pure black |
| `--surface` | `#1A1C1F` | Card/panel background |
| `--text` | `#F2F1ED` | Primary text |
| `--text-muted` | `#8B8D92` | Secondary text, timestamps, labels |
| `--accent` | `#D6FF3F` | Single accent — acid/lime green. Used for primary CTAs, active states, progress fills. Nothing else gets this color. |

Semantic colors (use sparingly, only where they carry real meaning):
- `--warning: #FF6B4A` — exercise caution/warning text and icon only
- `--success: #4ADE80` — completed workout state, streak confirmation only

Dark mode is the only mode for v1 — don't build a light theme, it doubles your styling work for zero grading benefit.

**Rule:** the accent color is spent in one place per screen — usually the primary action button or the active nav state. Do not tint multiple elements with it or it stops meaning "this is the important thing."

---

## 3. Typography

Two fonts:
- **Display/headings:** `Space Grotesk` (or `General Sans` if available) — geometric, slightly technical, works for big numbers (calorie counts, weights, streaks)
- **Body/UI text:** `Inter` — for everything else, form labels, descriptions

Numbers matter more than words in this app (weight, reps, calories, streak count). Give numeric displays real visual weight: large size, tabular-nums, high contrast. A "247 kcal" or "Day 12" should be the biggest thing on its card, not the same size as its label.

No all-caps labels. No letter-spacing tricks for "premium" text effects. Sentence case everywhere, including buttons and nav items.

---

## 4. Layout

- Mobile-first, single-column. Test every screen at 375px width before anything else — this is a "workout companion," it will be judged/demoed on a phone-sized viewport even if built in a browser window.
- Bottom tab nav on mobile (Dashboard / Workout / Progress / Profile), not a hamburger menu — hamburgers hide the thing people need mid-workout.
- Generous tap targets: minimum 44px height on any interactive element. This isn't a nice-to-have here — small buttons in a fitness app are a real usability failure, not just a style nitpick.
- Cards differentiate by **content hierarchy, not uniform chrome.** Not every panel needs the same border-radius/shadow/padding recipe. A "today's workout" card should look more important than a "past log entry" row — through size and placement, not just color.

---

## 5. Component-Specific Direction

**Onboarding form**
One question (or tight group) per screen, progress dots at top, not one long scrolling form. This is the first impression — a single giant form reads exactly like a template.

**Diet plan card**
Lead with the calorie target as the hero number. Macros (protein/carbs/fat) as three compact stat blocks below it, not a table. A table here is the generic default — three cards works better on mobile and demos better.

**Workout day view**
List of exercise cards, each showing: name, sets×reps, small icon by category (strength vs cardio), and a checkbox/checkmark for completion. Tapping a card opens the detail modal — don't cram animation/video into the list view.

**Exercise detail modal**
This is the one place to spend real design effort — it's the most "impressive" screen in a demo. Structure top to bottom: CSS animation loop (small, contained, not full-width — it's a demonstration, not a hero visual) → exercise name → benefit (1-2 lines) → warning (visually distinct, use `--warning` color + a small icon, not a scary red alert box) → embedded YouTube video. Keep the warning readable but not alarming — it's a caution, not an error state.

**Progress dashboard**
Weight line chart as the primary element. Streak counter as a secondary stat, styled like a scoreboard number (large, `--accent` color, short label beneath) rather than a badge/sticker. Badges/ranks live in their own row below — small icon grid, locked ones shown greyed out with a lock icon rather than hidden, so progress toward them is visible.

**Pricing/subscription page (dummy)**
Two columns (Free / Premium) side by side on desktop, stacked on mobile. Premium column gets the `--accent` border/highlight. Locked features elsewhere in the app show a small lock icon + "Premium" tag inline — don't fully hide premium features, showing what's locked is what sells the tier system in a demo.

---

## 6. Motion

One deliberate animation per exercise (the CSS loop in the detail modal) — this is the product's signature interaction, so it's worth actually polishing rather than treating as decoration. Keep it simple: a looping 2-4 keyframe illustration of the movement (e.g., a stick-figure or simplified shape moving through the rep), not a literal illustration attempt.

Elsewhere, motion should only respond to user action:
- Checkbox → checkmark: quick scale/fade, under 200ms
- Streak increment: a brief number tick-up, not a confetti burst
- Page transitions: none needed — keep navigation instant

Do not add scroll-triggered fade-ins on every section or hover effects on every card. That's the generic AI-generated tell, and it will also visibly hurt performance/demo smoothness on a lower-end laptop.

---

## 7. Copy Voice

Coach, not therapist. Direct, short sentences, active voice.

- Button labels say the action: "Log weight," "Start workout," "Mark done" — not "Submit."
- Empty states give an instruction, not a mood: "No workouts logged yet — generate your first plan" not "Looks like it's a little quiet here!"
- Warnings state the risk plainly: "High knee-strain movement — skip if you have joint pain" not hedged legal-sounding language.
- No exclamation points on system messages. No "Great job!" cheerleading copy — let the visual (checkmark, streak number) carry the positive feedback instead of words.

---

## 8. Accessibility Floor (non-negotiable, not optional polish)

- Visible keyboard focus states on all interactive elements
- Color is never the only signal — completed/locked/warning states pair color with an icon or text label
- Contrast: body text on `--bg`/`--surface` must pass WCAG AA at minimum (the palette above already does — don't substitute lighter greys without checking)
- Respect `prefers-reduced-motion` — exercise animations can pause/simplify, don't just ignore the setting

---

## 9. Self-Check Before Calling a Screen Done

Before moving to the next screen, check it against these — if any answer is "no," fix before continuing:
1. Does it work at 375px width?
2. Is there exactly one accent-colored focal point, not several competing ones?
3. Are tap targets ≥44px?
4. Would this screen be readable in under 2 seconds by someone mid-workout?
5. Does it look like *this* app, or could it be pasted into any other SaaS product unchanged? If the second, revise.



## 10. Theme: Minimal Enterprise
Treat this as an internal ops tool, not a consumer lifestyle app — think Linear, Notion, or a fintech dashboard, not a fitness brand. Flat surfaces, no gradients, no illustrative flourishes. Neutral grayscale base (
#FAFAFA / 
#FFFFFF light surfaces, 
#18181B–
#27272A dark surfaces) with a single restrained accent (a muted blue or indigo, not the lime — lime reads as consumer/energetic, which conflicts with "enterprise"). Typography stays quiet: one grotesk/sans family, no display font doing personality work, weight and size carry hierarchy instead of color or flourish. Borders and hairline dividers over shadows and cards-on-cards. Density over whitespace-as-decoration — enterprise users expect more information per screen, not generous marketing-site spacing. Motion near-zero: state changes, no orchestrated reveals.

If you want, I'll rewrite Sections 1–7 to match this instead of leaving them half athletic-brand, half enterprise — right now they'd conflict if you just append this.