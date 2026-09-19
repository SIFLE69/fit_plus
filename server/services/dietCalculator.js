/**
 * Enhanced Diet Engine
 * Calculates BMR, TDEE, Calorie Target, Macro Breakdown, 4-Meal Structure,
 * Food Allergy Safeguards, Medical Disease Protocols, and Auto Grocery List.
 */
export function calculateDietPlan(profile) {
    const { weightKg, heightCm, age, gender, goal, activityLevel, diseases = [], allergies = [] } = profile;

    // 1. Calculate BMR (Mifflin-St Jeor)
    let bmr = 0;
    if (gender === 'male') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else if (gender === 'female') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
    }

    // 2. Activity Multiplier for TDEE
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };
    const multiplier = activityMultipliers[activityLevel] || 1.2;
    const tdee = Math.round(bmr * multiplier);

    // 3. Calorie Target by Goal
    let calories = tdee;
    if (goal === 'cut') {
        calories = Math.max(1200, tdee - 500);
    } else if (goal === 'bulk') {
        calories = tdee + 300;
    }
    calories = Math.round(calories);

    // 4. Macro Splits (Grams)
    let proteinPerKg = 1.8;
    let fatPerKg = 1.0;

    if (goal === 'cut') {
        proteinPerKg = 2.2;
        fatPerKg = 0.8;
    } else if (goal === 'bulk') {
        proteinPerKg = 2.0;
        fatPerKg = 1.0;
    }

    const proteinG = Math.round(weightKg * proteinPerKg);
    const fatG = Math.round(weightKg * fatPerKg);

    const caloriesFromProteinFat = (proteinG * 4) + (fatG * 9);
    const remainingCalories = calories - caloriesFromProteinFat;
    const carbsG = Math.max(50, Math.round(remainingCalories / 4));

    // 5. Medical Disease Protocol Rules
    const diseaseGuidance = [];
    const normalizedDiseases = (diseases || []).map(d => d.toLowerCase());

    if (normalizedDiseases.includes('diabetes') || normalizedDiseases.includes('type 2 diabetes')) {
        diseaseGuidance.push({
            condition: 'Diabetes Glycemic Control',
            advice: 'Distribute carbohydrate intake evenly across 4 meals. Focus strictly on low-GI complex carbs (quinoa, steel-cut oats, lentils) and aim for 35g+ fiber daily to stabilize blood glucose.',
        });
    }
    if (normalizedDiseases.includes('hypertension') || normalizedDiseases.includes('high blood pressure')) {
        diseaseGuidance.push({
            condition: 'Hypertension Sodium Limit',
            advice: 'Limit sodium to < 1,800mg/day. Increase potassium and magnesium intake with dark greens, avocados, bananas, and pumpkin seeds.',
        });
    }
    if (normalizedDiseases.includes('high_cholesterol') || normalizedDiseases.includes('cholesterol')) {
        diseaseGuidance.push({
            condition: 'Cholesterol & Lipid Shield',
            advice: 'Cap saturated fat to < 7% of daily calories. Prioritize extra virgin olive oil, walnuts, chia seeds, and soluble oat fiber.',
        });
    }
    if (normalizedDiseases.includes('ibs') || normalizedDiseases.includes('digestive')) {
        diseaseGuidance.push({
            condition: 'Gastrointestinal Low-FODMAP',
            advice: 'Choose low-FODMAP carbohydrates (jasmine rice, sweet potatoes). Avoid raw cruciferous vegetables 2 hours prior to workouts.',
        });
    }

    // 6. Food Allergy Precautions & Safe Alternatives
    const allergyPrecautions = [];
    const normalizedAllergies = (allergies || []).map(a => a.toLowerCase());

    const isDairyFree = normalizedAllergies.includes('dairy') || normalizedAllergies.includes('lactose');
    const isGlutenFree = normalizedAllergies.includes('gluten') || normalizedAllergies.includes('wheat');
    const isNutFree = normalizedAllergies.includes('peanuts') || normalizedAllergies.includes('nuts');
    const isEggFree = normalizedAllergies.includes('eggs');
    const isSoyFree = normalizedAllergies.includes('soy');

    if (isNutFree) allergyPrecautions.push('NUT SAFEGUARD: Substitute all nuts/peanut butter with sunflower seed butter, pumpkin seeds, or olive oil.');
    if (isDairyFree) allergyPrecautions.push('DAIRY-FREE SAFEGUARD: Replace whey protein with pea/rice isolate. Use unsweetened almond/oat milk.');
    if (isGlutenFree) allergyPrecautions.push('GLUTEN-FREE SAFEGUARD: Source carbs from jasmine rice, sweet potato, certified GF oats, and quinoa.');
    if (isEggFree) allergyPrecautions.push('EGG-FREE SAFEGUARD: Replace egg whites with chicken breast, turkey, salmon, or tofu scramble.');
    if (isSoyFree) allergyPrecautions.push('SOY-FREE SAFEGUARD: Avoid soy protein isolates, edamame, and soy sauce. Opt for coconut aminos.');

    // 7. Structured 4-Meal Breakdown with Macros
    const mealProtein = Math.round(proteinG / 4);
    const mealCarbs = Math.round(carbsG / 4);
    const mealFat = Math.round(fatG / 4);

    const meals = [
        {
            id: 'meal_1',
            name: 'Meal 1 — Morning Power Breakfast',
            time: '08:00 AM',
            calories: Math.round(calories * 0.25),
            proteinG: mealProtein,
            carbsG: mealCarbs,
            fatG: mealFat,
            title: isGlutenFree ? 'GF Oat & Berry Bowl' : 'Power Oatmeal Bowl',
            ingredients: [
                isGlutenFree ? '70g Certified Gluten-Free Rolled Oats' : '70g Whole Rolled Oats',
                isDairyFree ? '1 Scoop Plant Pea Protein Isolate' : '1 Scoop Whey Protein Isolate',
                isNutFree ? '1 tbsp Pumpkin Seeds & Blueberries' : '1 tbsp Almond Butter & Blueberries',
                '250ml Unsweetened Almond Milk',
            ],
        },
        {
            id: 'meal_2',
            name: 'Meal 2 — Midday Fuel & Hypertrophy Lunch',
            time: '12:30 PM',
            calories: Math.round(calories * 0.30),
            proteinG: Math.round(proteinG * 0.30),
            carbsG: Math.round(carbsG * 0.30),
            fatG: Math.round(fatG * 0.25),
            title: 'Lean Poultry & Complex Carbs',
            ingredients: [
                '180g Grilled Chicken Breast or Lean Turkey',
                '200g Baked Sweet Potato or Jasmine Rice',
                '1 Cup Steamed Broccoli & Green Beans',
                '1 tbsp Extra Virgin Olive Oil Drizzle',
            ],
        },
        {
            id: 'meal_3',
            name: 'Meal 3 — Anabolic Post-Workout Refuel',
            time: '04:30 PM',
            calories: Math.round(calories * 0.20),
            proteinG: Math.round(proteinG * 0.25),
            carbsG: Math.round(carbsG * 0.25),
            fatG: Math.round(fatG * 0.15),
            title: 'Fast-Absorbing Recovery Shake',
            ingredients: [
                isDairyFree ? '1.5 Scoops Plant Protein Isolate' : '1.5 Scoops Whey Protein Isolate',
                '1 Large Ripe Banana',
                '4 Plain Rice Cakes',
                '300ml Cold Water or Coconut Water',
            ],
        },
        {
            id: 'meal_4',
            name: 'Meal 4 — Evening Recovery Dinner',
            time: '08:00 PM',
            calories: Math.round(calories * 0.25),
            proteinG: Math.round(proteinG * 0.25),
            carbsG: Math.round(carbsG * 0.20),
            fatG: Math.round(fatG * 0.35),
            title: 'Omega-3 Salmon & Quinoa Medley',
            ingredients: [
                '170g Wild Salmon Fillet or Sirloin Steak',
                '150g Cooked Quinoa or Wild Rice',
                'Roasted Asparagus & Zucchini',
                '1/4 Avocado',
            ],
        },
    ];

    // 8. Auto-Generated Grocery Shopping List
    const groceryList = [
        {
            category: 'Proteins',
            items: [
                'Boneless Skinless Chicken Breast (1kg)',
                'Lean Ground Turkey / Beef (800g)',
                'Wild Salmon / White Fish (600g)',
                isDairyFree ? 'Plant Pea/Rice Protein Powder' : 'Whey Protein Isolate',
                isEggFree ? 'Tofu / Tempeh Scramble Base' : 'Eggs & Egg Whites (2 Dozen)',
            ],
        },
        {
            category: 'Carbohydrates & Grains',
            items: [
                isGlutenFree ? 'Certified Gluten-Free Rolled Oats' : 'Whole Grain Rolled Oats',
                'Jasmine Rice & Brown Basmati Rice',
                'Sweet Potatoes & Red Potatoes',
                'Quinoa & Rice Cakes',
            ],
        },
        {
            category: 'Healthy Fats',
            items: [
                'Extra Virgin Olive Oil',
                'Fresh Avocados (4 pack)',
                isNutFree ? 'Sunflower Seed Butter & Pumpkin Seeds' : 'Almond Butter & Raw Almonds',
                'Chia Seeds & Flaxseeds',
            ],
        },
        {
            category: 'Produce & Greens',
            items: [
                'Fresh Broccoli & Asparagus',
                'Spinach & Kale (Large Tub)',
                'Blueberries & Bananas',
                'Zucchini & Bell Peppers',
            ],
        },
    ];

    const fiberG = Math.max(28, Math.round(calories / 70));

    // Micronutrient targets tailored to body weight & gender
    const micros = {
        waterL: Number((weightKg * 0.04).toFixed(1)),
        vitaminD_IU: 2000,
        vitaminC_mg: 90,
        calcium_mg: 1000,
        iron_mg: gender === 'female' ? 18 : 10,
        potassium_mg: 3500,
        magnesium_mg: 400,
        sodiumMax_mg: 2000,
        zinc_mg: 11,
    };

    return {
        bmr: Math.round(bmr),
        tdee,
        macros: {
            calories,
            proteinG,
            carbsG,
            fatG,
            fiberG,
        },
        micros,
        diseaseGuidance,
        allergyPrecautions,
        meals,
        groceryList,
    };
}

/**
 * Alternate Meal Swap Service
 * Generates an alternative recipe choice for a specific meal slot.
 */
export function swapMealRecipe(profile, mealId, currentMeals) {
    const { allergies = [], goal } = profile;
    const isDairyFree = (allergies || []).some(a => a.toLowerCase().includes('dairy'));
    const isGlutenFree = (allergies || []).some(a => a.toLowerCase().includes('gluten'));

    const alternates = {
        meal_1: [
            {
                title: 'Avocado Egg / Tofu Toast Bowl',
                ingredients: [
                    isGlutenFree ? '2 Slices GF Artisan Bread' : '2 Slices Whole Grain Bread',
                    '1/2 Smashed Avocado with Lemon Juice',
                    '3 Poached Eggs or Tofu Scramble',
                    'Handful Baby Spinach & Cherry Tomatoes',
                ],
            },
            {
                title: 'High-Protein Smoothie Bowl',
                ingredients: [
                    isDairyFree ? 'Plant Protein Isolate' : 'Whey Protein Isolate',
                    '150g Frozen Berries & 1/2 Banana',
                    '200ml Almond Milk',
                    'Topped with Chia Seeds & Coconut Flakes',
                ],
            },
        ],
        meal_2: [
            {
                title: 'Seared Tuna Steak & Brown Rice',
                ingredients: [
                    '180g Seared Yellowfin Tuna or White Fish',
                    '180g Cooked Brown Basmati Rice',
                    'Steamed Bok Choy & Sesame Seed Drizzle',
                ],
            },
            {
                title: 'Lean Beef & Quinoa Fiesta Bowl',
                ingredients: [
                    '170g 93/7 Lean Ground Beef',
                    '150g Cooked Quinoa with Black Beans',
                    'Salsa, Cilantro, & 1/4 Avocado',
                ],
            },
        ],
        meal_3: [
            {
                title: 'Greek Yogurt / Coconut Parfait',
                ingredients: [
                    isDairyFree ? '200g Coconut Yogurt' : '200g Non-Fat Greek Yogurt',
                    '1 Scoop Protein Powder',
                    '1/2 Cup Fresh Raspberries',
                    '1 tbsp Pumpkin Seeds',
                ],
            },
            {
                title: 'Egg White & Spinach Omelet',
                ingredients: [
                    '200ml Egg Whites (or Tofu)',
                    '1 Cup Baby Spinach & Mushrooms',
                    '2 Whole Grain / GF Rice Cakes',
                ],
            },
        ],
        meal_4: [
            {
                title: 'Herb Roasted Turkey & Roasted Squash',
                ingredients: [
                    '180g Herb Roasted Turkey Breast',
                    '200g Roasted Butternut Squash',
                    'Sautéed Green Beans with Garlic Olive Oil',
                ],
            },
            {
                title: 'Grilled Sirloin Steak & Sweet Potato Wedges',
                ingredients: [
                    '170g Lean Sirloin Steak (Trimmed)',
                    '180g Air-Fried Sweet Potato Wedges',
                    'Grilled Asparagus Spears',
                ],
            },
        ],
    };

    const pool = alternates[mealId] || alternates.meal_1;
    const randomAlt = pool[Math.floor(Math.random() * pool.length)];

    return currentMeals.map((m) => {
        if (m.id === mealId) {
            return {
                ...m,
                title: randomAlt.title,
                ingredients: randomAlt.ingredients,
            };
        }
        return m;
    });
}
