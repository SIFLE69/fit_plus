import express from 'express';
import Profile from '../models/Profile.js';
import DietPlan from '../models/DietPlan.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import Exercise from '../models/Exercise.js';
import Log from '../models/Log.js';
import Badge from '../models/Badge.js';
import { calculateDietPlan } from '../services/dietCalculator.js';
import { generateWorkoutPlan } from '../services/workoutGenerator.js';
import { computeEarnedBadges } from '../services/badgeEngine.js';

const router = express.Router();

// POST /api/profiles — Create profile & auto-generate initial diet & workout plans
router.post('/', async (req, res) => {
    try {
        const profile = new Profile(req.body);
        await profile.save();

        // Auto-generate Diet Plan
        const dietData = calculateDietPlan(profile);
        const dietPlan = new DietPlan({
            profileId: profile._id,
            ...dietData,
        });
        await dietPlan.save();

        // Auto-generate Workout Plan
        const availableExercises = await Exercise.find({});
        const workoutData = generateWorkoutPlan(profile, availableExercises);
        const workoutPlan = new WorkoutPlan({
            profileId: profile._id,
            days: workoutData.days,
        });
        await workoutPlan.save();

        // Auto-create initial weight log entry
        await Log.create({
            profileId: profile._id,
            weightKg: profile.weightKg,
            date: new Date(),
        });

        res.status(201).json({
            profile,
            dietPlan,
            workoutPlan,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/profiles/:id — Fetch profile
router.get('/:id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/profiles/:id — Update profile (e.g. toggle isPremium)
router.patch('/:id', async (req, res) => {
    try {
        const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/profiles/:id/diet-plan — Generate + store new diet plan
router.post('/:id/diet-plan', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        const dietData = calculateDietPlan(profile);
        const dietPlan = new DietPlan({
            profileId: profile._id,
            ...dietData,
        });
        await dietPlan.save();

        res.json(dietPlan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/profiles/:id/diet-plan — Fetch latest diet plan
router.get('/:id/diet-plan', async (req, res) => {
    try {
        const dietPlan = await DietPlan.findOne({ profileId: req.params.id }).sort({ generatedAt: -1 });
        if (!dietPlan) return res.status(404).json({ error: 'No diet plan found' });
        res.json(dietPlan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/profiles/:id/workout-plan — Generate + store new workout plan
router.post('/:id/workout-plan', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        const availableExercises = await Exercise.find({});
        const workoutData = generateWorkoutPlan(profile, availableExercises);

        const workoutPlan = new WorkoutPlan({
            profileId: profile._id,
            days: workoutData.days,
        });
        await workoutPlan.save();

        const populatedPlan = await WorkoutPlan.findById(workoutPlan._id).populate('days.exercises.exerciseId');
        res.json(populatedPlan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/profiles/:id/workout-plan — Fetch latest workout plan with populated exercise details
router.get('/:id/workout-plan', async (req, res) => {
    try {
        const workoutPlan = await WorkoutPlan.findOne({ profileId: req.params.id })
            .sort({ generatedAt: -1 })
            .populate('days.exercises.exerciseId');

        if (!workoutPlan) return res.status(404).json({ error: 'No workout plan found' });
        res.json(workoutPlan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/profiles/:id/logs — Add a daily log entry
router.post('/:id/logs', async (req, res) => {
    try {
        const { weightKg, workoutDayCompleted, date } = req.body;
        const log = new Log({
            profileId: req.params.id,
            weightKg: weightKg ? Number(weightKg) : undefined,
            workoutDayCompleted,
            date: date ? new Date(date) : new Date(),
        });
        await log.save();

        // If weight was updated, sync latest weight to Profile as well
        if (weightKg) {
            await Profile.findByIdAndUpdate(req.params.id, { weightKg: Number(weightKg) });
        }

        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/profiles/:id/logs — Fetch all logs for profile
router.get('/:id/logs', async (req, res) => {
    try {
        const logs = await Log.find({ profileId: req.params.id }).sort({ date: 1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/profiles/:id/badges — Compute and return badges
router.get('/:id/badges', async (req, res) => {
    try {
        const logs = await Log.find({ profileId: req.params.id });
        const allBadges = await Badge.find({});
        const computedBadges = computeEarnedBadges(logs, allBadges);
        res.json(computedBadges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/profiles/:id/ai-tip — AI Tip of the Day (honest rule + dynamic tip generation)
router.post('/:id/ai-tip', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        if (!profile.isPremium) {
            return res.status(403).json({ error: 'Premium subscription required for AI Coach Tips.' });
        }

        const dietPlan = await DietPlan.findOne({ profileId: profile._id }).sort({ generatedAt: -1 });

        const tipsByGoal = {
            cut: [
                `Prioritize your ${dietPlan?.macros?.proteinG || 160}g protein target early in the day to optimize satiety and preserve muscle mass during a calorie deficit.`,
                `Hydrate with 500ml water 20 minutes before compound lifting sets to maintain intramuscular pressure while cutting.`,
                `Maintain high lifting intensity (8-10 reps) on cut phases — lower volume slightly if recovery drops, but keep load heavy.`
            ],
            bulk: [
                `Distribute your ${dietPlan?.macros?.carbsG || 250}g carbohydrate target around intra-workout windows to maximize glycogen resynthesis and pump.`,
                `Focus on progressive overload on your core lifts: add 1-2kg or 1 rep each week while in surplus.`,
                `Incorporate easy-to-digest carbs post-workout to ensure full caloric intake without GI distress.`
            ],
            maintain: [
                `Keep your calorie input at steady equilibrium of ${dietPlan?.macros?.calories || 2200} kcal to convert body composition gradually while staying energized.`,
                `Vary your workout tempo: use a 3-second eccentric phase on main lifts to maximize mechanical tension.`,
                `Ensure 7.5 to 8 hours of quality sleep — body composition maintenance relies heavily on hormonal balance.`
            ]
        };

        const goalTips = tipsByGoal[profile.goal] || tipsByGoal.maintain;
        const randomTip = goalTips[Math.floor(Math.random() * goalTips.length)];

        res.json({
            tip: randomTip,
            generatedAt: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
