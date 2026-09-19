import express from 'express';
import Profile from '../models/Profile.js';
import { getRecommendedRecipes, getAllRecipes, setCustomRecipes } from '../services/recipeEngine.js';
import { searchFoods } from '../services/nutritionSearchEngine.js';

const router = express.Router();

// GET /api/recipes/foods/search — Search nutrition.xlsx dataset
router.get('/foods/search', (req, res) => {
    try {
        const { q, limit } = req.query;
        const results = searchFoods(q, limit ? parseInt(limit, 10) : 25);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/recipes — Get all recipes in dataset
router.get('/', (req, res) => {
    const recipes = getAllRecipes();
    res.json(recipes);
});

// GET /api/recipes/recommendations — Get personalized recipe recommendations for profile
router.get('/recommendations', async (req, res) => {
    try {
        const { profileId, mealType } = req.query;
        let profile = null;

        if (profileId) {
            profile = await Profile.findById(profileId);
        }

        const recommendations = getRecommendedRecipes(profile, mealType, 15);
        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/recipes/custom-dataset — Accept custom recipe dataset uploaded by user
router.post('/custom-dataset', (req, res) => {
    try {
        const { recipes } = req.body;
        if (!Array.isArray(recipes)) {
            return res.status(400).json({ error: 'Expected recipes array in request body.' });
        }

        const count = setCustomRecipes(recipes);
        res.json({ message: `Successfully loaded ${count} custom recipes into dataset!`, count });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/recipes/external-resources — Public internet diet resources & API references
router.get('/external-resources', (req, res) => {
    res.json({
        dietaryGuidelines: [
            {
                title: 'USDA Dietary Guidelines for Americans',
                description: 'Evidence-based nutritional guidance emphasizing nutrient-dense foods, lean protein, and sodium management.',
                url: 'https://www.dietaryguidelines.gov/',
                category: 'General Clinical Standard',
            },
            {
                title: 'DASH Diet Protocol (NIH / NHLBI)',
                description: 'Dietary Approaches to Stop Hypertension (DASH) rich in potassium, magnesium, and calcium.',
                url: 'https://www.nhlbi.nih.gov/education/dash-eating-plan',
                category: 'Hypertension Protocol',
            },
            {
                title: 'American Diabetes Association (ADA) Nutrition Standards',
                description: 'Low-glycemic index carbohydrate management and carbohydrate counting guidelines for blood glucose control.',
                url: 'https://diabetes.org/food-nutrition',
                category: 'Diabetes Protocol',
            },
        ],
        supportedApiIntegrations: [
            {
                name: 'Spoonacular Nutrition & Recipe API',
                description: 'Full nutrition breakdown, macro calculation, and allergen filtering.',
                endpoint: 'https://api.spoonacular.com/recipes/complexSearch',
            },
            {
                name: 'Open Food Facts Database',
                description: 'Free open database of food products and ingredient nutriscores worldwide.',
                endpoint: 'https://world.openfoodfacts.org/api/v0/product/',
            },
        ],
    });
});

export default router;
