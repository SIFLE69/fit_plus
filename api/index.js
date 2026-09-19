import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import profilesRouter from '../server/routes/profiles.js';
import exercisesRouter from '../server/routes/exercises.js';
import recipesRouter from '../server/routes/recipes.js';
import { runSeed } from '../server/seed/seedAll.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profiles', profilesRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/recipes', recipesRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), environment: 'vercel' });
});

// MongoDB connection caching for serverless (avoids reconnecting on every invocation)
let isConnected = false;
let isSeeded = false;

async function connectDB() {
    if (isConnected) return;

    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not set. Please configure MongoDB Atlas connection string in Vercel environment variables.');
    }

    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false,
        });
        isConnected = true;
        console.log('Connected to MongoDB Atlas.');

        // Seed only once per cold start
        if (!isSeeded) {
            await runSeed();
            isSeeded = true;
        }
    } catch (err) {
        if (err.message.includes('ENOTFOUND')) {
            console.error('MongoDB URI Invalid Hostname Error:', err.message);
            console.error('HINT: Your MONGO_URI in Vercel Environment Variables has an invalid cluster domain (e.g. "bang1234"). Make sure to copy the full connection string from MongoDB Atlas, e.g.: mongodb+srv://user:pass@cluster0.abcde.mongodb.net/fitplan?retryWrites=true&w=majority');
        } else {
            console.error('MongoDB connection error:', err.message);
        }
        throw err;
    }
}

// Vercel Serverless Handler
export default async function handler(req, res) {
    try {
        await connectDB();
    } catch (err) {
        return res.status(500).json({
            error: 'Database connection failed',
            message: err.message,
        });
    }

    // Forward to Express
    return app(req, res);
}
