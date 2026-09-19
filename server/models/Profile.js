import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String },
    googleId: { type: String, sparse: true },
    username: { type: String, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    weightKg: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    goal: { type: String, enum: ['cut', 'maintain', 'bulk'], required: true },
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'], required: true },
    trainingStyle: { type: String, enum: ['strength', 'gym', 'calisthenics', 'cardio', 'hybrid', 'functional', 'powerlifting', 'mix'], required: true, default: 'gym' },
    conditions: [{ type: String }],
    diseases: [{ type: String }],
    allergies: [{ type: String }],
    isPremium: { type: Boolean, default: false },
    themeMode: { type: String, default: 'light' },
    accentPreset: { type: String, default: 'sky' },
    density: { type: String, default: 'comfortable' },
    avatarPreset: { type: String, default: 'athlete' },
    avatarBg: { type: String, default: '#3B82F6' },
    avatarUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash password if modified
ProfileSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) {
        next(err);
    }
});

// Instance method to compare password
ProfileSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password || !candidatePassword) return false;
    if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
        return this.password === candidatePassword;
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
