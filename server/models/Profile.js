import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    weightKg: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    goal: { type: String, enum: ['cut', 'maintain', 'bulk'], required: true },
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'], required: true },
    trainingStyle: { type: String, enum: ['strength', 'cardio', 'mix'], required: true },
    conditions: [{ type: String }],
    isPremium: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
