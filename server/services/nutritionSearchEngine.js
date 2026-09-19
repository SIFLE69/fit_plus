import fs from 'fs';
import path from 'path';

let cachedFoods = null;

export function loadNutritionFoods() {
    if (cachedFoods) return cachedFoods;

    try {
        const jsonPath = path.join(process.cwd(), 'server', 'data', 'nutritionFoods.json');
        if (fs.existsSync(jsonPath)) {
            const rawData = fs.readFileSync(jsonPath, 'utf-8');
            cachedFoods = JSON.parse(rawData);
            console.log(`Loaded ${cachedFoods.length} USDA foods from nutrition.xlsx dataset.`);
        } else {
            console.warn('nutritionFoods.json not found, initializing empty food array.');
            cachedFoods = [];
        }
    } catch (err) {
        console.error('Failed to load nutritionFoods.json:', err);
        cachedFoods = [];
    }

    return cachedFoods;
}

export function searchFoods(query = '', limit = 25) {
    const foods = loadNutritionFoods();
    if (!query || query.trim() === '') {
        return foods.slice(0, limit);
    }

    const keywords = query.toLowerCase().trim().split(/\s+/);

    // Filter foods matching all keywords
    const matches = foods.filter(food => {
        const foodName = food.name.toLowerCase();
        return keywords.every(kw => foodName.includes(kw));
    });

    // Sort by shortest name (exact matches first)
    matches.sort((a, b) => a.name.length - b.name.length);

    return matches.slice(0, limit);
}
