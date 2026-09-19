import mongoose from 'mongoose';

const DietPlanSchema = new mongoose.Schema({
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    bmr: { type: Number, required: true },
    tdee: { type: Number, required: true },
    macros: {
        calories: { type: Number, required: true },
        proteinG: { type: Number, required: true },
        carbsG: { type: Number, required: true },
        fatG: { type: Number, required: true }
    },
    diseaseGuidance: [{
        condition: String,
        advice: String,
    }],
    allergyPrecautions: [{ type: String }],
    meals: [{
        id: String,
        name: String,
        time: String,
        calories: Number,
        proteinG: Number,
        carbsG: Number,
        fatG: Number,
        title: String,
        ingredients: [{ type: String }],
    }],
    groceryList: [{
        category: String,
        items: [{ type: String }],
    }],
    generatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.DietPlan || mongoose.model('DietPlan', DietPlanSchema);
