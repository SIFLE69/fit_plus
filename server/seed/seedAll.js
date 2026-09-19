import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from '../models/Exercise.js';
import Badge from '../models/Badge.js';
import Profile from '../models/Profile.js';
import DietPlan from '../models/DietPlan.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import Log from '../models/Log.js';
import { initialExercises } from './seedExercises.js';
import { initialBadges } from './seedBadges.js';
import { calculateDietPlan } from '../services/dietCalculator.js';
import { generateWorkoutPlan } from '../services/workoutGenerator.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitplan';

export async function runSeed() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
            console.log('Connected to MongoDB for Seeding...');
        }

        // 1. Seed Exercises (only if empty)
        const exerciseCount = await Exercise.countDocuments();
        let createdExercises;
        if (exerciseCount === 0) {
            createdExercises = await Exercise.insertMany(initialExercises);
            console.log(`Seeded ${createdExercises.length} exercises.`);
        } else {
            createdExercises = await Exercise.find({});
            console.log(`Exercises already seeded (${exerciseCount} found). Skipping.`);
        }

        // 2. Seed Badges (only if empty)
        const badgeCount = await Badge.countDocuments();
        if (badgeCount === 0) {
            const createdBadges = await Badge.insertMany(initialBadges);
            console.log(`Seeded ${createdBadges.length} badges.`);
        } else {
            console.log(`Badges already seeded (${badgeCount} found). Skipping.`);
        }

        // 3. Seed Demo Profile (only if not exists)
        let demoProfile = await Profile.findOne({ email: 'alex@fitplan.com' });
        if (!demoProfile) {
            demoProfile = new Profile({
                name: 'Alex Vance (Demo)',
                email: 'alex@fitplan.com',
                password: 'password123',
                username: 'alexvance',
                age: 26,
                gender: 'male',
                weightKg: 82,
                heightCm: 180,
                goal: 'cut',
                activityLevel: 'active',
                trainingStyle: 'mix',
                conditions: [],
                isPremium: true,
            });
            await demoProfile.save();

            // 4. Generate Diet & Workout for Demo Profile
            const dietData = calculateDietPlan(demoProfile);
            await DietPlan.create({
                profileId: demoProfile._id,
                ...dietData,
            });

            const workoutData = generateWorkoutPlan(demoProfile, createdExercises);
            await WorkoutPlan.create({
                profileId: demoProfile._id,
                days: workoutData.days,
            });

            // 5. Seed historical logs for streak & chart visualization
            const today = new Date();
            const logs = [];
            const baseWeight = 84.5;

            for (let i = 10; i >= 0; i--) {
                const logDate = new Date(today);
                logDate.setDate(today.getDate() - i);

                const simulatedWeight = Number((baseWeight - (10 - i) * 0.25 + (Math.random() * 0.2 - 0.1)).toFixed(1));

                logs.push({
                    profileId: demoProfile._id,
                    date: logDate,
                    weightKg: simulatedWeight,
                    workoutDayCompleted: `Day ${(10 - i) % 4 + 1}`,
                });
            }

            await Log.insertMany(logs);
            console.log(`Seeded demo profile (ID: ${demoProfile._id}) with credentials alex@fitplan.com / password123.`);
        } else {
            console.log(`Demo profile already exists (ID: ${demoProfile._id}). Skipping.`);
        }

        console.log('Seeding Complete Successfully!');
        return demoProfile._id;
    } catch (err) {
        console.error('Error during seeding:', err);
    }
}

// Allow direct CLI execution
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
    runSeed().then(() => mongoose.disconnect());
}
