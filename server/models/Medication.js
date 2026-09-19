import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema({
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    scheduledTime: { type: String, required: true }, // Format HH:MM (24h)
    category: {
        type: String,
        enum: ['prescription', 'vitamin', 'supplement', 'other'],
        default: 'prescription',
    },
    instructions: { type: String, default: '' },
    lastTakenDate: { type: String, default: '' }, // YYYY-MM-DD of last dose taken
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Medication || mongoose.model('Medication', MedicationSchema);
