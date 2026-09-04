/**
 * Rule-based Workout Plan Generator
 * Filters exercises by user style and health conditions, then builds structured training days.
 * Pure logic function with random sampling for variety.
 */
export function generateWorkoutPlan(profile, availableExercises) {
    const { trainingStyle, conditions = [] } = profile;

    const normalizedConditions = (conditions || []).map(c => c.toLowerCase());

    // Helper to check if exercise should be excluded due to conditions
    const isExcludedByCondition = (ex) => {
        for (const cond of normalizedConditions) {
            if (cond.includes('knee') || cond.includes('leg') || cond.includes('acl')) {
                if (ex.muscleGroup === 'legs') return true;
            }
            if (cond.includes('shoulder') || cond.includes('rotator')) {
                if (ex.muscleGroup === 'shoulders') return true;
            }
            if (cond.includes('back') || cond.includes('spine') || cond.includes('disc')) {
                if (ex.muscleGroup === 'back' && ex.equipment === 'barbell') return true;
            }
        }
        return false;
    };

    // Filter exercises
    let eligibleExercises = availableExercises.filter(ex => !isExcludedByCondition(ex));

    if (trainingStyle === 'strength') {
        eligibleExercises = eligibleExercises.filter(ex => ex.category === 'strength');
    } else if (trainingStyle === 'cardio') {
        eligibleExercises = eligibleExercises.filter(ex => ex.category === 'cardio');
    }

    // Define split templates based on training style
    let dayTemplates = [];

    if (trainingStyle === 'strength') {
        dayTemplates = [
            { label: 'Day 1 — Push (Chest, Shoulders, Triceps)', muscleGroups: ['chest', 'shoulders', 'full_body'] },
            { label: 'Day 2 — Pull (Back, Biceps, Rear Delts)', muscleGroups: ['back', 'full_body'] },
            { label: 'Day 3 — Legs & Abs (Quads, Hamstrings, Core)', muscleGroups: ['legs', 'core'] },
            { label: 'Day 4 — Full Body Strength & Power', muscleGroups: ['full_body', 'chest', 'back', 'legs'] },
        ];
    } else if (trainingStyle === 'cardio') {
        dayTemplates = [
            { label: 'Day 1 — High Intensity Interval Training (HIIT)', muscleGroups: ['cardio', 'full_body'] },
            { label: 'Day 2 — Steady State Aerobic Endurance', muscleGroups: ['cardio'] },
            { label: 'Day 3 — Active Recovery & Core Mobility', muscleGroups: ['core', 'cardio'] },
        ];
    } else {
        // Mix
        dayTemplates = [
            { label: 'Day 1 — Upper Body Hypertrophy', muscleGroups: ['chest', 'back', 'shoulders'] },
            { label: 'Day 2 — HIIT & Sprint Conditioning', muscleGroups: ['cardio', 'full_body'] },
            { label: 'Day 3 — Lower Body Power & Core', muscleGroups: ['legs', 'core'] },
            { label: 'Day 4 — Low-Impact Aerobic Zone 2', muscleGroups: ['cardio'] },
            { label: 'Day 5 — Full Body Functional Circuit', muscleGroups: ['full_body', 'chest', 'back', 'legs'] },
        ];
    }

    // Shuffle utility
    const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

    const days = dayTemplates.map(template => {
        // Find candidate exercises matching target muscle groups for this day
        let candidates = eligibleExercises.filter(ex => template.muscleGroups.includes(ex.muscleGroup));

        // Fallback if not enough matching exercises
        if (candidates.length < 4) {
            candidates = eligibleExercises;
        }

        const selected = shuffle(candidates).slice(0, 5);

        const exerciseEntries = selected.map(ex => {
            const isCardio = ex.category === 'cardio';
            return {
                exerciseId: ex._id,
                sets: isCardio ? 1 : 3,
                reps: isCardio ? '20 min' : '10-12 reps',
            };
        });

        return {
            dayLabel: template.label,
            exercises: exerciseEntries,
        };
    });

    return { days };
}
