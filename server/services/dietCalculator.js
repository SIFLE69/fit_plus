/**
 * Calculates BMR, TDEE, Calorie Target, and Macro Breakdown based on Mifflin-St Jeor formula
 * Pure function, testable, no side effects.
 */
export function calculateDietPlan(profile) {
    const { weightKg, heightCm, age, gender, goal, activityLevel } = profile;

    // 1. Calculate BMR
    let bmr = 0;
    if (gender === 'male') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else if (gender === 'female') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    } else {
        // neutral / other
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

    // Carbs clamped to minimum 50g
    const carbsG = Math.max(50, Math.round(remainingCalories / 4));

    return {
        bmr: Math.round(bmr),
        tdee,
        macros: {
            calories,
            proteinG,
            carbsG,
            fatG,
        },
    };
}
