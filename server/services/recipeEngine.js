import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_FILE_PATH = path.join(__dirname, '../data/recipes.json');

// Memory store for custom added recipes
let customDatasetRecipes = [];

// Load default recipes from JSON
export function getDefaultRecipes() {
    try {
        const rawData = fs.readFileSync(RECIPES_FILE_PATH, 'utf-8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error('Error reading recipes.json file:', err);
        return [];
    }
}

// Set custom recipes uploaded by user
export function setCustomRecipes(recipesArray) {
    if (Array.isArray(recipesArray)) {
        customDatasetRecipes = recipesArray;
        return customDatasetRecipes.length;
    }
    return 0;
}

// Get combined recipes (default + custom)
export function getAllRecipes() {
    const defaults = getDefaultRecipes();
    return [...defaults, ...customDatasetRecipes];
}

/**
 * Filter and Recommend Recipes based on Profile Rules & Constraints:
 * 1. Hard Filter: Food Allergies (excludes recipes containing user's allergens).
 * 2. Hard Filter: Medical Diseases (if diabetes, excludes high-GI; if hypertension, excludes high-sodium > 450mg).
 * 3. Ranking: Nearest match to target macro/calorie range for the meal type!
 */
export function getRecommendedRecipes(profile, mealType = null, limit = 10) {
    const recipes = getAllRecipes();
    const { allergies = [], diseases = [], goal = 'cut' } = profile || {};

    const normalizedAllergies = (allergies || []).map(a => a.toLowerCase());
    const normalizedDiseases = (diseases || []).map(d => d.toLowerCase());

    const hasDiabetes = normalizedDiseases.includes('diabetes');
    const hasHypertension = normalizedDiseases.includes('hypertension');
    const hasCholesterol = normalizedDiseases.includes('high_cholesterol');

    // Filter recipes
    const filtered = recipes.filter((rec) => {
        // 1. Check Allergies
        const recipeAllergens = (rec.allergens || []).map(a => a.toLowerCase());
        for (const userAllergy of normalizedAllergies) {
            if (userAllergy.includes('dairy') && recipeAllergens.includes('dairy')) return false;
            if (userAllergy.includes('peanut') && (recipeAllergens.includes('peanuts') || recipeAllergens.includes('nuts'))) return false;
            if (userAllergy.includes('gluten') && (recipeAllergens.includes('gluten') || recipeAllergens.includes('wheat'))) return false;
            if (userAllergy.includes('egg') && recipeAllergens.includes('eggs')) return false;
            if (userAllergy.includes('soy') && recipeAllergens.includes('soy')) return false;
            if (userAllergy.includes('shellfish') && recipeAllergens.includes('shellfish')) return false;
        }

        // 2. Check Medical Diseases
        if (hasDiabetes && rec.glycemicIndex === 'high') return false;
        if (hasHypertension && rec.sodiumMg > 450) return false;

        // 3. Check Meal Type (if requested)
        if (mealType && rec.mealType && rec.mealType.toLowerCase() !== mealType.toLowerCase()) {
            return false;
        }

        return true;
    });

    // Score/Rank recipes (higher protein & lower saturated fat prioritized for cut, higher calories for bulk)
    const scored = filtered.map((rec) => {
        let score = 100;
        if (goal === 'cut') score += rec.proteinG * 2;
        if (goal === 'bulk') score += rec.calories / 10;
        if (rec.suitableForDiseases && rec.suitableForDiseases.some(d => normalizedDiseases.includes(d))) {
            score += 30; // Boost clinical match
        }
        return { ...rec, matchScore: score };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, limit);
}
