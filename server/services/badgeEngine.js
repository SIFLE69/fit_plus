/**
 * Badge calculation engine
 * Computes earned badges dynamically based on user daily logs
 */
export function computeEarnedBadges(logs, allBadges) {
    const earnedCodes = new Set();

    const totalLogs = logs.length;
    const completedWorkouts = logs.filter(l => Boolean(l.workoutDayCompleted));
    const weightLogs = logs.filter(l => l.weightKg !== undefined && l.weightKg !== null);

    // 1. First step badge
    if (totalLogs > 0) {
        earnedCodes.add('first_step');
    }

    // 2. Workout milestone badges
    if (completedWorkouts.length >= 5) {
        earnedCodes.add('workout_5');
    }
    if (completedWorkouts.length >= 10) {
        earnedCodes.add('workout_10');
    }

    // 3. Weight tracker badge
    if (weightLogs.length >= 3) {
        earnedCodes.add('weight_tracker');
    }

    // 4. Streak calculation (consecutive dates with completed workouts or logs)
    const uniqueDates = Array.from(
        new Set(logs.map(l => new Date(l.date).toISOString().split('T')[0]))
    ).sort();

    let maxStreak = 0;
    let currentStreak = 0;
    let prevDate = null;

    for (const dateStr of uniqueDates) {
        const curDate = new Date(dateStr);
        if (!prevDate) {
            currentStreak = 1;
        } else {
            const diffTime = Math.abs(curDate - prevDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                currentStreak += 1;
            } else {
                currentStreak = 1;
            }
        }
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }
        prevDate = curDate;
    }

    if (maxStreak >= 3) earnedCodes.add('streak_3');
    if (maxStreak >= 7) earnedCodes.add('streak_7');
    if (maxStreak >= 14) earnedCodes.add('streak_14');

    return allBadges.map(badge => ({
        ...badge.toObject ? badge.toObject() : badge,
        isEarned: earnedCodes.has(badge.code),
        earnedAt: earnedCodes.has(badge.code) ? new Date().toISOString() : null,
    }));
}
