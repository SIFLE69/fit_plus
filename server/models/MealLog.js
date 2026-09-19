import mongoose from 'mongoose';

const MealLogSchema = new mongoose.Schema({
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    mealType: { type: String, default: 'Meal' },
    name: { type: String, required: true },
    calories: { type: Number, default: 0 },
    proteinG: { type: Number, default: 0 },
    carbsG: { type: Number, default: 0 },
    fatG: { type: Number, default: 0 },
    fiberG: { type: Number, default: 0 },
    micros: {
        vitaminD_IU: { type: Number, default: 0 },
        vitaminC_mg: { type: Number, default: 0 },
        calcium_mg: { type: Number, default: 0 },
        iron_mg: { type: Number, default: 0 },
        potassium_mg: { type: Number, default: 0 },
        magnesium_mg: { type: Number, default: 0 },
        sodium_mg: { type: Number, default: 0 },
        zinc_mg: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MealLog || mongoose.model('MealLog', MealLogSchema);
