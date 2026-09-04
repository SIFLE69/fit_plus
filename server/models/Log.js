import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    date: { type: Date, default: Date.now },
    weightKg: { type: Number },
    workoutDayCompleted: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);
