import React, { useState } from 'react';
import WorkoutDayCard from '../components/WorkoutDayCard';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import { logDailyEntry } from '../services/api';

export default function WorkoutPlanPage({ workoutPlan, profile, onRefreshData, logs = [] }) {
    const [selectedExercise, setSelectedExercise] = useState(null);

    // Extract completed workout day labels from logs
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

    return (
        <div className="space-y-6 pb-12">
            <WorkoutDayCard
                workoutPlan={workoutPlan}
                onSelectExercise={(ex) => setSelectedExercise(ex)}
                onCompleteWorkoutDay={handleCompleteWorkoutDay}
                completedDays={completedDays}
            />

            {/* Exercise Detail Modal */}
            {selectedExercise && (
                <ExerciseDetailModal
                    exercise={selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                />
            )}
        </div>
    );
}
