import React, { useState } from 'react';
import { Dumbbell, Activity, CheckCircle2, Circle, ChevronRight, Sparkles, AlertTriangle } from 'lucide-react';

export default function WorkoutDayCard({ workoutPlan, onSelectExercise, onCompleteWorkoutDay, completedDays = [] }) {
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);

    if (!workoutPlan || !workoutPlan.days || workoutPlan.days.length === 0) {
        return (
            <div className="bg-surface border border-surface-border rounded-xl p-8 text-center">
                <Dumbbell className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-50" />
                <h3 className="font-display font-bold text-lg text-text-main">No Workout Plan Generated</h3>
                <p className="text-xs text-text-muted mt-1 mb-4">Complete your onboarding profile to auto-generate a targeted routine.</p>
            </div>
        );
    }

    const currentDay = workoutPlan.days[selectedDayIdx] || workoutPlan.days[0];
    const isDayCompleted = completedDays.includes(currentDay.dayLabel);

    return (
        <div className="bg-surface border border-surface-border rounded-xl p-5 sm:p-6 shadow-xl">
            {/* Header & Day Selector Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-accent" />
                        <h3 className="font-display font-bold text-lg text-text-main">Target Workout Split</h3>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">Tap any exercise card for motion preview & safety warnings.</p>
                </div>

                {/* Complete Day Button */}
                <button
                    onClick={() => onCompleteWorkoutDay(currentDay.dayLabel)}
                    className={`px-4 py-2 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all min-h-[44px] ${isDayCompleted
                            ? 'bg-success/20 text-success border border-success/30'
                            : 'bg-accent text-bg hover:bg-accent-hover'
                        }`}
                >
                    {isDayCompleted ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 animate-checkmark" /> Completed Today
                        </>
                    ) : (
                        <>
                            <Circle className="w-4 h-4" /> Mark Day Complete
                        </>
                    )}
                </button>
            </div>

            {/* Day Selector Navigation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
                {workoutPlan.days.map((day, idx) => {
                    const isSelected = selectedDayIdx === idx;
                    const isDone = completedDays.includes(day.dayLabel);
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedDayIdx(idx)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-display font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border min-h-[40px] ${isSelected
                                    ? 'border-accent bg-accent/15 text-text-main font-bold'
                                    : 'border-surface-border bg-bg text-text-muted hover:text-text-main'
                                }`}
                        >
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                            <span>{day.dayLabel.split('—')[0]}</span>
                        </button>
                    );
                })}
            </div>

            {/* Selected Day Title */}
            <div className="mb-4 bg-bg border border-surface-border rounded-lg p-3 flex items-center justify-between">
                <span className="font-display font-bold text-sm text-text-main">{currentDay.dayLabel}</span>
                <span className="text-xs text-text-muted">{currentDay.exercises.length} Exercises</span>
            </div>

            {/* List of Exercise Cards */}
            <div className="space-y-3">
                {currentDay.exercises.map((item, exIdx) => {
                    const ex = item.exerciseId;
                    if (!ex) return null;

                    const isCardio = ex.category === 'cardio';

                    return (
                        <div
                            key={exIdx}
                            onClick={() => onSelectExercise(ex)}
                            className="group bg-bg hover:bg-surface-hover border border-surface-border hover:border-accent/40 rounded-lg p-4 transition-all cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isCardio ? 'bg-orange-500/15 text-orange-400' : 'bg-accent/15 text-accent'
                                    }`}>
                                    {isCardio ? <Activity className="w-4 h-4" /> : <Dumbbell className="w-4 h-4" />}
                                </div>

                                <div>
                                    <h4 className="font-display font-bold text-sm text-text-main group-hover:text-accent transition-colors flex items-center gap-2">
                                        {ex.name}
                                        {ex.warning && (
                                            <span title="Safety Warning Available">
                                                <AlertTriangle className="w-3.5 h-3.5 text-warning inline" />
                                            </span>
                                        )}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                                        <span className="capitalize">{ex.muscleGroup}</span>
                                        <span>•</span>
                                        <span className="capitalize">{ex.equipment}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="font-display font-bold text-sm text-accent num-tabular">
                                        {item.sets} × {item.reps}
                                    </div>
                                    <div className="text-[10px] text-text-muted uppercase">SETS & REPS</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
