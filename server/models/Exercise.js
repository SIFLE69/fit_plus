import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['strength', 'cardio'], required: true },
    muscleGroup: { type: String, enum: ['chest', 'back', 'legs', 'shoulders', 'core', 'full_body', 'cardio'], required: true },
    equipment: { type: String, enum: ['bodyweight', 'dumbbell', 'barbell', 'machine', 'none'], required: true },
    benefit: { type: String, required: true },
    warning: { type: String, required: true },
    youtubeId: { type: String, required: true },
    animationType: { type: String, default: 'generic' }
});

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
