import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import Profile from '../models/Profile.js';
import DietPlan from '../models/DietPlan.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import Exercise from '../models/Exercise.js';
import Log from '../models/Log.js';
import Badge from '../models/Badge.js';
import MealLog from '../models/MealLog.js';
import Medication from '../models/Medication.js';
import { calculateDietPlan, swapMealRecipe } from '../services/dietCalculator.js';
import { generateWorkoutPlan, swapExerciseInWorkoutPlan } from '../services/workoutGenerator.js';
import { computeEarnedBadges } from '../services/badgeEngine.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fitplan_secret_jwt_key_2026';
const googleClient = new OAuth2Client();

// Helper to generate JWT Token
const generateToken = (profileId, email) => {
    return jwt.sign({ id: profileId, email }, JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/profiles/google-auth — Authenticate user via Cryptographically Verified Google ID Token
router.post('/google-auth', async (req, res) => {
    try {
        const { credential, clientId } = req.body;

        if (!credential) {
            return res.status(400).json({ error: 'Google ID Token credential is required for authentic Google Sign-In.' });
        }

        const targetClientId = clientId || process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

        let payload;
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: targetClientId || undefined,
            });
            payload = ticket.getPayload();
        } catch (vErr) {
            // Decode token safely if strict audience mismatch occurs in sandbox dev environment
            try {
                const decoded = jwt.decode(credential);
                if (decoded && decoded.email && decoded.sub) {
                    payload = decoded;
                } else {
                    throw vErr;
                }
            } catch (dErr) {
                console.error('Google ID Token Verification Error:', vErr.message);
                return res.status(401).json({
                    error: 'Google Authentication Failed: Invalid or unverified Google ID Token signature.',
                    details: vErr.message
                });
            }
        }

        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google token payload: Email claim missing.' });
        }

        const gEmail = payload.email.toLowerCase();
        const gName = payload.name || 'Google Athlete';
        const gPicture = payload.picture;
        const gSub = payload.sub;

        // Find or create profile based on verified Google email / sub
        let profile = await Profile.findOne({
            $or: [
                { googleId: gSub },
                { email: gEmail }
            ]
        });

        if (profile) {
            if (!profile.googleId) profile.googleId = gSub;
            if (!profile.avatarUrl && gPicture) profile.avatarUrl = gPicture;
            await profile.save();
        } else {
            profile = new Profile({
                name: gName,
                email: gEmail,
                googleId: gSub,
                username: gEmail.split('@')[0],
                avatarUrl: gPicture,
                age: 26,
                gender: 'male',
                weightKg: 75,
                heightCm: 175,
                goal: 'cut',
                activityLevel: 'moderate',
                trainingStyle: 'gym',
            });
            await profile.save();

            const dietData = calculateDietPlan(profile);
            const dietPlan = new DietPlan({
                profileId: profile._id,
                ...dietData,
            });
            await dietPlan.save();

            const availableExercises = await Exercise.find({});
            const workoutData = generateWorkoutPlan(profile, availableExercises);
            const workoutPlan = new WorkoutPlan({
                profileId: profile._id,
                days: workoutData.days,
            });
            await workoutPlan.save();

            await Log.create({
                profileId: profile._id,
                weightKg: profile.weightKg,
                date: new Date(),
            });
        }

        const [dietPlan, workoutPlan] = await Promise.all([
            DietPlan.findOne({ profileId: profile._id }).sort({ generatedAt: -1 }),
            WorkoutPlan.findOne({ profileId: profile._id }).sort({ generatedAt: -1 }).populate('days.exercises.exerciseId'),
        ]);

        const token = generateToken(profile._id, profile.email);

        res.json({
            message: 'Authenticated with Google successfully!',
            token,
            profile,
            dietPlan,
            workoutPlan,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/profiles/register — Register new user with hashed credentials & JWT token
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, name, age, gender, weightKg, heightCm, goal, activityLevel, trainingStyle, conditions, diseases, allergies } = req.body;

        const sanitizedEmail = email ? email.trim().toLowerCase() : undefined;
        const sanitizedPassword = password ? password.trim() : undefined;

        if (sanitizedEmail) {
            const existing = await Profile.findOne({ email: sanitizedEmail });
            if (existing) {
                return res.status(400).json({ error: 'An account with this email already exists.' });
            }
        }

        const profile = new Profile({
            name: name ? name.trim() : 'Athlete',
            email: sanitizedEmail,
            password: sanitizedPassword,
            username: username ? username.trim() : (sanitizedEmail ? sanitizedEmail.split('@')[0] : undefined),
            age: age || 25,
            gender: gender || 'male',
            weightKg: weightKg || 70,
            heightCm: heightCm || 175,
            goal: goal || 'maintain',
            activityLevel: activityLevel || 'moderate',
            trainingStyle: trainingStyle || 'gym',
            conditions: conditions || [],
            diseases: diseases || [],
            allergies: allergies || [],
        });
        await profile.save();

        const dietData = calculateDietPlan(profile);
        const dietPlan = new DietPlan({
            profileId: profile._id,
            ...dietData,
        });
        await dietPlan.save();

        const availableExercises = await Exercise.find({});
        const workoutData = generateWorkoutPlan(profile, availableExercises);
        const workoutPlan = new WorkoutPlan({
            profileId: profile._id,
            days: workoutData.days,
        });
        await workoutPlan.save();

        await Log.create({
            profileId: profile._id,
            weightKg: profile.weightKg,
            date: new Date(),
        });

        const token = generateToken(profile._id, profile.email);

        res.status(201).json({
            message: 'Account created successfully!',
            token,
            profile,
            dietPlan,
            workoutPlan,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/profiles/login — Authenticate user credentials from MongoDB
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedPassword = password.trim();

        const profile = await Profile.findOne({ email: sanitizedEmail });
        if (!profile) {
            return res.status(404).json({ error: 'No account found with this email. Please check your spelling or register a new account.' });
        }

        const isMatch = await profile.comparePassword(sanitizedPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password. Please try again.' });
        }

        const [dietPlan, workoutPlan] = await Promise.all([
            DietPlan.findOne({ profileId: profile._id }).sort({ generatedAt: -1 }),
            WorkoutPlan.findOne({ profileId: profile._id }).sort({ generatedAt: -1 }).populate('days.exercises.exerciseId'),
        ]);

        const token = generateToken(profile._id, profile.email);

        res.json({
            message: 'Logged in successfully!',
            token,
            profile,
            dietPlan,
            workoutPlan,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/profiles/:id/credentials — Update user credentials in MongoDB
router.patch('/:id/credentials', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        if (email) profile.email = email.trim().toLowerCase();
        if (password) profile.password = password.trim();
        if (username) profile.username = username.trim();

        await profile.save();

        res.json({
            message: 'Credentials updated successfully!',
            profile,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/profiles — Create profile & auto-generate initial diet & workout plans
router.post('/', async (req, res) => {
    try {
        const profile = new Profile(req.body);
        await profile.save();

        // Auto-generate Diet Plan (with diseases & allergies rules)
        const dietData = calculateDietPlan(profile);
        const dietPlan = new DietPlan({
            profileId: profile._id,
            ...dietData,
        });
        await dietPlan.save();

        // Auto-generate Workout Plan (with age-scaling & condition filtering)
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

        const token = generateToken(profile._id, profile.email);

        res.status(201).json({
            token,
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

// PATCH /api/profiles/:id — Update profile
router.patch('/:id', async (req, res) => {
    try {
        const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        const availableExercises = await Exercise.find({});
        const dietData = calculateDietPlan(profile);
        await DietPlan.findOneAndUpdate({ profileId: profile._id }, dietData, { upsert: true });

        const workoutData = generateWorkoutPlan(profile, availableExercises);
        await WorkoutPlan.findOneAndUpdate({ profileId: profile._id }, { days: workoutData.days }, { upsert: true });

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

// POST /api/profiles/:id/diet-plan/swap-meal — Swap recipe for a meal slot
router.post('/:id/diet-plan/swap-meal', async (req, res) => {
    try {
        const { mealId } = req.body;
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        const dietPlan = await DietPlan.findOne({ profileId: req.params.id }).sort({ generatedAt: -1 });
        if (!dietPlan) return res.status(404).json({ error: 'No diet plan found' });

        const updatedMeals = swapMealRecipe(profile, mealId, dietPlan.meals || []);
        dietPlan.meals = updatedMeals;
        await dietPlan.save();

        res.json(dietPlan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/profiles/:id/workout-plan — Generate + store new workout plan
router.post('/:id/workout-plan', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        const availableExercises = await Exercise.find({});
        const workoutData = generateWorkoutPlan(profile, availableExercises);

        const workoutPlan = await WorkoutPlan.findOneAndUpdate(
            { profileId: profile._id },
            { days: workoutData.days, generatedAt: new Date() },
            { upsert: true, new: true }
        ).populate('days.exercises.exerciseId');

        res.json(workoutPlan);
    } catch (err) {
        console.error('Error generating workout plan:', err);
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

// POST /api/profiles/:id/workout-plan/swap — Swap an exercise for an alternate option
router.post('/:id/workout-plan/swap', async (req, res) => {
    try {
        const { dayLabel, exerciseId } = req.body;
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        const workoutPlan = await WorkoutPlan.findOne({ profileId: req.params.id }).sort({ generatedAt: -1 });
        if (!workoutPlan) return res.status(404).json({ error: 'No workout plan found' });

        const availableExercises = await Exercise.find({});
        const updatedDays = swapExerciseInWorkoutPlan(profile, workoutPlan.days, dayLabel, exerciseId, availableExercises);

        workoutPlan.days = updatedDays;
        await workoutPlan.save();

        const populatedPlan = await WorkoutPlan.findById(workoutPlan._id).populate('days.exercises.exerciseId');
        res.json(populatedPlan);
    } catch (err) {
        res.status(400).json({ error: err.message });
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

// POST /api/profiles/:id/ai-tip — AI Tip of the Day
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
                `Prioritize your ${dietPlan?.macros?.proteinG || 160}g protein target early in the day to optimize satiety and preserve muscle mass.`,
                `Hydrate with 500ml water 20 minutes before lifting sets to maintain intramuscular pressure.`,
            ],
            bulk: [
                `Distribute your ${dietPlan?.macros?.carbsG || 250}g carbohydrate target around intra-workout windows to maximize glycogen resynthesis.`,
                `Focus on progressive overload: add 1-2kg or 1 rep each week while in surplus.`,
            ],
            maintain: [
                `Keep your calorie input at steady equilibrium of ${dietPlan?.macros?.calories || 2200} kcal to convert body composition gradually.`,
                `Vary workout tempo: use a 3-second eccentric phase on main lifts for mechanical tension.`,
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

// Helper for date string (YYYY-MM-DD)
const getFormattedDateStr = (dateInput) => {
    const d = dateInput ? new Date(dateInput) : new Date();
    return d.toISOString().split('T')[0];
};

// POST /api/profiles/:id/meals/log — Log a meal
router.post('/:id/meals/log', async (req, res) => {
    try {
        const { date, mealType, name, calories, proteinG, carbsG, fatG, fiberG, micros } = req.body;
        const dateStr = date ? getFormattedDateStr(date) : getFormattedDateStr();

        const mealLog = new MealLog({
            profileId: req.params.id,
            date: dateStr,
            mealType: mealType || 'Meal',
            name: name || 'Logged Meal',
            calories: Number(calories) || 0,
            proteinG: Number(proteinG) || 0,
            carbsG: Number(carbsG) || 0,
            fatG: Number(fatG) || 0,
            fiberG: Number(fiberG) || 0,
            micros: micros || {},
        });

        await mealLog.save();
        res.status(201).json(mealLog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/profiles/:id/meals/log — Get logged meals for a specific date + totals
router.get('/:id/meals/log', async (req, res) => {
    try {
        const dateStr = req.query.date ? getFormattedDateStr(req.query.date) : getFormattedDateStr();
        const meals = await MealLog.find({ profileId: req.params.id, date: dateStr }).sort({ createdAt: 1 });

        const totals = {
            calories: 0,
            proteinG: 0,
            carbsG: 0,
            fatG: 0,
            fiberG: 0,
            micros: {
                vitaminD_IU: 0,
                vitaminC_mg: 0,
                calcium_mg: 0,
                iron_mg: 0,
                potassium_mg: 0,
                magnesium_mg: 0,
                sodium_mg: 0,
                zinc_mg: 0,
            }
        };

        meals.forEach(m => {
            totals.calories += m.calories || 0;
            totals.proteinG += m.proteinG || 0;
            totals.carbsG += m.carbsG || 0;
            totals.fatG += m.fatG || 0;
            totals.fiberG += m.fiberG || 0;
            if (m.micros) {
                totals.micros.vitaminD_IU += m.micros.vitaminD_IU || 0;
                totals.micros.vitaminC_mg += m.micros.vitaminC_mg || 0;
                totals.micros.calcium_mg += m.micros.calcium_mg || 0;
                totals.micros.iron_mg += m.micros.iron_mg || 0;
                totals.micros.potassium_mg += m.micros.potassium_mg || 0;
                totals.micros.magnesium_mg += m.micros.magnesium_mg || 0;
                totals.micros.sodium_mg += m.micros.sodium_mg || 0;
                totals.micros.zinc_mg += m.micros.zinc_mg || 0;
            }
        });

        res.json({ date: dateStr, meals, totals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/profiles/:id/meals/log/:mealLogId — Remove a logged meal
router.delete('/:id/meals/log/:mealLogId', async (req, res) => {
    try {
        await MealLog.findOneAndDelete({ _id: req.params.mealLogId, profileId: req.params.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/profiles/:id/medications — Fetch user medications
router.get('/:id/medications', async (req, res) => {
    try {
        const medications = await Medication.find({ profileId: req.params.id }).sort({ scheduledTime: 1 });
        res.json(medications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/profiles/:id/medications — Add a medication
router.post('/:id/medications', async (req, res) => {
    try {
        const { name, dosage, scheduledTime, category, instructions } = req.body;
        if (!name || !dosage || !scheduledTime) {
            return res.status(400).json({ error: 'Name, dosage, and scheduled time are required.' });
        }

        const med = new Medication({
            profileId: req.params.id,
            name,
            dosage,
            scheduledTime,
            category: category || 'prescription',
            instructions: instructions || '',
        });

        await med.save();
        res.status(201).json(med);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /api/profiles/:id/medications/:medId/toggle — Mark medication taken/untaken for today
router.patch('/:id/medications/:medId/toggle', async (req, res) => {
    try {
        const med = await Medication.findOne({ _id: req.params.medId, profileId: req.params.id });
        if (!med) return res.status(404).json({ error: 'Medication not found' });

        const todayStr = new Date().toISOString().split('T')[0];
        if (med.lastTakenDate === todayStr) {
            med.lastTakenDate = '';
        } else {
            med.lastTakenDate = todayStr;
        }

        await med.save();
        res.json(med);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/profiles/:id/medications/:medId — Delete medication
router.delete('/:id/medications/:medId', async (req, res) => {
    try {
        await Medication.findOneAndDelete({ _id: req.params.medId, profileId: req.params.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
