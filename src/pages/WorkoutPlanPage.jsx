import React, { useState } from 'react';
import WorkoutDayCard from '../components/WorkoutDayCard';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import { logDailyEntry, swapWorkoutExercise, generateWorkoutPlan } from '../services/api';

export default function WorkoutPlanPage({ workoutPlan, profile, onRefreshData, logs = [] }) {
    const [selectedExercise, setSelectedExercise] = useState(null);

    const completedDays = logs
        .filter((l) => Boolean(l.workoutDayCompleted))
        .map((l) => l.workoutDayCompleted);

    const handleCompleteWorkoutDay = async (dayLabel) => {
        if (!profile?._id) return;
        await logDailyEntry(profile._id, {
            workoutDayCompleted: dayLabel,
            date: new Date(),
        });
        onRefreshData();
    };

    const handleSwapExercise = async (dayLabel, exerciseId) => {
        if (!profile?._id) return;
        await swapWorkoutExercise(profile._id, dayLabel, exerciseId);
        await onRefreshData();
    };

    const handleGeneratePlan = async () => {
        if (!profile?._id) return;
        await generateWorkoutPlan(profile._id);
        await onRefreshData();
    };

    return (
        <div className="space-y-5">
            {/* Page header */}
            <div>
                <h1 className="text-xl font-bold text-text-main">Workout Plan</h1>
                <p className="text-xs text-text-muted mt-0.5">
                    {workoutPlan?.days?.length || 0} days · {profile?.goal?.toUpperCase() || 'CUT'} phase
                </p>
            </div>

            <WorkoutDayCard
                workoutPlan={workoutPlan}
                profile={profile}
                onSelectExercise={(ex) => setSelectedExercise(ex)}
                onCompleteWorkoutDay={handleCompleteWorkoutDay}
                onSwapExercise={handleSwapExercise}
                onGeneratePlan={handleGeneratePlan}
                completedDays={completedDays}
            />

            {selectedExercise && (
                <ExerciseDetailModal
                    exercise={selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                />
            )}
        </div>
    );
}
