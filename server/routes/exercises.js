import express from 'express';
import Exercise from '../models/Exercise.js';

const router = express.Router();

// GET /api/exercises — Fetch all exercises
router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find({});
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/exercises/:id — Fetch single exercise detail
router.get('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
        res.json(exercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
