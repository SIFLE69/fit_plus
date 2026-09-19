/**
 * Rule-based Workout Plan Generator
 * Filters exercises by user style, health conditions, medical diseases, and AGE.
 * Includes age-scaling for users age >= 50 and dynamic exercise swapping.
 */
export function generateWorkoutPlan(profile, availableExercises) {
    const { trainingStyle, conditions = [], age = 25 } = profile;

    const isSenior = Number(age) >= 50;
    const normalizedConditions = (conditions || []).map(c => c.toLowerCase());

    // Helper to check if exercise should be excluded due to conditions or age
    const isExcludedByConditionOrAge = (ex) => {
        // Age-based exclusions (Senior safety protocol for age >= 50)
        if (isSenior) {
            // Exclude high-impact sprints and high-risk heavy axial loading for seniors
            if (ex.name.toLowerCase().includes('sprint') || ex.name.toLowerCase().includes('battle rope')) return true;
            if (ex.equipment === 'barbell' && (ex.muscleGroup === 'legs' || ex.muscleGroup === 'back')) {
                // Exclude heavy barbell back squats and heavy conventional barbell deadlifts for seniors -> favor machine/dumbbell
                if (ex.animationType === 'squat' || ex.animationType === 'deadlift') return true;
            }
        }

        // Physical condition exclusions
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
            if (cond.includes('wrist') || cond.includes('elbow')) {
                if (ex.equipment === 'barbell') return true;
            }
        }
        return false;
    };

    // Filter exercises by condition, age & training style preferences
    let eligibleExercises = availableExercises.filter(ex => !isExcludedByConditionOrAge(ex));

    if (trainingStyle === 'calisthenics') {
        const bodyweight = eligibleExercises.filter(ex => ex.equipment === 'bodyweight' || ex.equipment === 'pull-up bar');
        if (bodyweight.length >= 4) eligibleExercises = bodyweight;
    } else if (trainingStyle === 'gym') {
        const gymEx = eligibleExercises.filter(ex => ex.equipment === 'barbell' || ex.equipment === 'dumbbell' || ex.equipment === 'machine');
        if (gymEx.length >= 4) eligibleExercises = gymEx;
    } else if (trainingStyle === 'strength') {
        const heavyRes = eligibleExercises.filter(ex => ex.category === 'strength' && (ex.equipment === 'barbell' || ex.equipment === 'dumbbell'));
        if (heavyRes.length >= 4) eligibleExercises = heavyRes;
    } else if (trainingStyle === 'cardio') {
        const cardioEx = eligibleExercises.filter(ex => ex.category === 'cardio' || ex.muscleGroup === 'cardio');
        if (cardioEx.length >= 2) eligibleExercises = cardioEx;
    } else if (trainingStyle === 'functional') {
        const functionalEx = eligibleExercises.filter(ex => ex.muscleGroup === 'core' || ex.muscleGroup === 'full_body' || ex.equipment === 'bodyweight' || ex.equipment === 'dumbbell');
        if (functionalEx.length >= 4) eligibleExercises = functionalEx;
    }

    // Define split templates based on training style
    let dayTemplates = [];

    if (trainingStyle === 'calisthenics') {
        dayTemplates = [
            { label: 'Day 1 — Calisthenics Push & Core (Push-ups, Dips & Planks)', muscleGroups: ['chest', 'shoulders', 'core'] },
            { label: 'Day 2 — Calisthenics Pull & Back (Pull-ups, Inverted Rows)', muscleGroups: ['back', 'full_body'] },
            { label: 'Day 3 — Calisthenics Lower Body (Pistols, Jump Squats, Lunges)', muscleGroups: ['legs', 'core'] },
            { label: 'Day 4 — Calisthenics Skill & Dynamic Body Control', muscleGroups: ['full_body', 'core', 'chest'] },
        ];
    } else if (trainingStyle === 'gym') {
        dayTemplates = [
            { label: 'Day 1 — Chest & Triceps Hypertrophy', muscleGroups: ['chest', 'shoulders'] },
            { label: 'Day 2 — Back & Biceps Width & Density', muscleGroups: ['back'] },
            { label: 'Day 3 — Quads, Hamstrings & Calves', muscleGroups: ['legs'] },
            { label: 'Day 4 — Shoulder Sculpting & Abs', muscleGroups: ['shoulders', 'core'] },
        ];
    } else if (trainingStyle === 'functional') {
        dayTemplates = [
            { label: 'Day 1 — Functional Athletic Movement & Core', muscleGroups: ['full_body', 'core'] },
            { label: 'Day 2 — Multi-Planar Agility & Balance', muscleGroups: ['legs', 'full_body'] },
            { label: 'Day 3 — Kettlebell & Bodyweight Power Circuit', muscleGroups: ['full_body', 'chest', 'back'] },
            { label: 'Day 4 — Explosive Stamina & Kinetic Chain', muscleGroups: ['cardio', 'core'] },
        ];
    } else if (trainingStyle === 'hybrid') {
        dayTemplates = [
            { label: 'Day 1 — Heavy Resistance Strength Split', muscleGroups: ['chest', 'back', 'legs'] },
            { label: 'Day 2 — High-Intensity Zone 4 Cardio & Stamina', muscleGroups: ['cardio', 'full_body'] },
            { label: 'Day 3 — Functional Core & Bodyweight Athleticism', muscleGroups: ['core', 'full_body'] },
            { label: 'Day 4 — Hybrid Metcon & Aerobic Capacity', muscleGroups: ['cardio', 'legs', 'shoulders'] },
        ];
    } else if (trainingStyle === 'strength') {
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
        // Mix / Default
        dayTemplates = [
            { label: 'Day 1 — Upper Body Hypertrophy', muscleGroups: ['chest', 'back', 'shoulders'] },
            { label: 'Day 2 — HIIT & Sprint Conditioning', muscleGroups: ['cardio', 'full_body'] },
            { label: 'Day 3 — Lower Body Power & Core', muscleGroups: ['legs', 'core'] },
            { label: 'Day 4 — Low-Impact Aerobic Zone 2', muscleGroups: ['cardio'] },
            { label: 'Day 5 — Full Body Functional Circuit', muscleGroups: ['full_body', 'chest', 'back', 'legs'] },
        ];
    }

    const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

    const days = dayTemplates.map(template => {
        let candidates = eligibleExercises.filter(ex => template.muscleGroups.includes(ex.muscleGroup));

        if (candidates.length < 4) {
            candidates = eligibleExercises;
        }

        const selected = shuffle(candidates).slice(0, 5);

        const exerciseEntries = selected.map(ex => {
            const isCardio = ex.category === 'cardio';
            return {
                exerciseId: ex._id,
                sets: isCardio ? 1 : 3,
                reps: isSenior
                    ? (isCardio ? '15-20 min (Zone 2)' : '12-15 reps (Controlled Tempo)')
                    : (isCardio ? '20 min' : '10-12 reps'),
                isAgeAdapted: isSenior,
            };
        });

        return {
            dayLabel: template.label,
            exercises: exerciseEntries,
        };
    });

    return { days, isSeniorProtocol: isSenior };
}

/**
 * Alternate Exercise Swap Service
 * Replaces a target exercise in a workout day with a safe alternative in the same category/muscle group.
 */
export function swapExerciseInWorkoutPlan(profile, days, dayLabel, targetExerciseId, availableExercises) {
    const { age = 25, conditions = [] } = profile;
    const isSenior = Number(age) >= 50;
    const normalizedConditions = (conditions || []).map(c => c.toLowerCase());

    const isExcluded = (ex) => {
        if (isSenior) {
            if (ex.name.toLowerCase().includes('sprint') || ex.name.toLowerCase().includes('battle rope')) return true;
            if (ex.equipment === 'barbell' && (ex.muscleGroup === 'legs' || ex.muscleGroup === 'back')) {
                if (ex.animationType === 'squat' || ex.animationType === 'deadlift') return true;
            }
        }
        for (const cond of normalizedConditions) {
            if (cond.includes('knee') && ex.muscleGroup === 'legs') return true;
            if (cond.includes('shoulder') && ex.muscleGroup === 'shoulders') return true;
            if (cond.includes('back') && ex.muscleGroup === 'back' && ex.equipment === 'barbell') return true;
        }
        return false;
    };

    const targetDayIdx = days.findIndex(d => d.dayLabel === dayLabel);
    if (targetDayIdx === -1) return days;

    const targetDay = days[targetDayIdx];
    const targetEntry = targetDay.exercises.find(e => {
        const id = e.exerciseId._id ? e.exerciseId._id.toString() : e.exerciseId.toString();
        return id === targetExerciseId.toString();
    });

    if (!targetEntry) return days;

    const currentExerciseObj = targetEntry.exerciseId;
    const currentCategory = currentExerciseObj.category || 'strength';
    const currentMuscleGroup = currentExerciseObj.muscleGroup || 'full_body';

    // Find existing IDs in the current day to avoid duplicates
    const existingIds = new Set(
        targetDay.exercises.map(e => (e.exerciseId._id ? e.exerciseId._id.toString() : e.exerciseId.toString()))
    );

    // Filter available candidate replacements
    let candidates = availableExercises.filter(ex => {
        const exId = ex._id.toString();
        if (existingIds.has(exId)) return false;
        if (isExcluded(ex)) return false;
        return ex.category === currentCategory && (ex.muscleGroup === currentMuscleGroup || ex.muscleGroup === 'full_body');
    });

    // Fallback to any valid non-excluded exercise in category
    if (candidates.length === 0) {
        candidates = availableExercises.filter(ex => {
            const exId = ex._id.toString();
            return !existingIds.has(exId) && !isExcluded(ex) && ex.category === currentCategory;
        });
    }

    if (candidates.length === 0) return days; // No replacement available

    // Pick random candidate replacement
    const replacement = candidates[Math.floor(Math.random() * candidates.length)];

    // Swap exercise entry
    const updatedExercises = targetDay.exercises.map(e => {
        const id = e.exerciseId._id ? e.exerciseId._id.toString() : e.exerciseId.toString();
        if (id === targetExerciseId.toString()) {
            return {
                ...e.toObject ? e.toObject() : e,
                exerciseId: replacement,
            };
        }
        return e;
    });

    const updatedDays = [...days];
    updatedDays[targetDayIdx] = {
        ...targetDay.toObject ? targetDay.toObject() : targetDay,
        exercises: updatedExercises,
    };

    return updatedDays;
}
