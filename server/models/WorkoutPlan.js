import mongoose from 'mongoose';

const WorkoutExerciseSchema = new mongoose.Schema({
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true }
});

const WorkoutDaySchema = new mongoose.Schema({
    dayLabel: { type: String, required: true },
    exercises: [WorkoutExerciseSchema]
});

const WorkoutPlanSchema = new mongoose.Schema({
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    days: [WorkoutDaySchema],
    generatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.WorkoutPlan || mongoose.model('WorkoutPlan', WorkoutPlanSchema);
