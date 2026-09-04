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

        // 1. Seed Exercises
        await Exercise.deleteMany({});
        const createdExercises = await Exercise.insertMany(initialExercises);
        console.log(`Seeded ${createdExercises.length} exercises.`);

        // 2. Seed Badges
        await Badge.deleteMany({});
        const createdBadges = await Badge.insertMany(initialBadges);
        console.log(`Seeded ${createdBadges.length} badges.`);

        // 3. Seed Demo Profile
        await Profile.deleteMany({ name: 'Alex Vance (Demo)' });
        const demoProfile = await Profile.create({
            name: 'Alex Vance (Demo)',
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
        await Log.deleteMany({ profileId: demoProfile._id });
        const today = new Date();
        const logs = [];
        const baseWeight = 84.5;

        for (let i = 10; i >= 0; i--) {
            const logDate = new Date(today);
            logDate.setDate(today.getDate() - i);

            // Simulate weight drop over 10 days
            const simulatedWeight = Number((baseWeight - (10 - i) * 0.25 + (Math.random() * 0.2 - 0.1)).toFixed(1));

            logs.push({
                profileId: demoProfile._id,
                date: logDate,
                weightKg: simulatedWeight,
                workoutDayCompleted: `Day ${(10 - i) % 4 + 1}`,
            });
        }

        await Log.insertMany(logs);
        console.log(`Seeded demo profile (ID: ${demoProfile._id}) with 11 daily logs.`);

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
