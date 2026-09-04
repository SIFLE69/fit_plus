import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import profilesRouter from './routes/profiles.js';
import exercisesRouter from './routes/exercises.js';
import { runSeed } from './seed/seedAll.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profiles', profilesRouter);
app.use('/api/exercises', exercisesRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Database connection & Server Startup
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitplan';

async function startServer() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 3000,
        });
        console.log('Connected to local/remote MongoDB database.');

        // Seed reference library & default demo profile if empty
        await runSeed();
    } catch (err) {
        console.warn('Local MongoDB connection failed/timed out. Attempting memory server fallback...');
        try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('Connected to In-Memory MongoDB instance successfully!');

            // Seed reference library & default demo profile
            await runSeed();
        } catch (memErr) {
            console.error('Failed to start in-memory database:', memErr.message);
        }
    }

    app.listen(PORT, () => {
        console.log(`FitPlan Express API Server running on port ${PORT}`);
    });
}

startServer();
