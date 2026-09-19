import React, { useState } from 'react';
import { Dumbbell, Activity, CheckCircle2, Circle, ChevronRight, AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';

export default function WorkoutDayCard({
    workoutPlan,
    profile,
    onSelectExercise,
    onCompleteWorkoutDay,
    onSwapExercise,
    onGeneratePlan,
    completedDays = [],
}) {
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);
    const [swappingId, setSwappingId] = useState(null);
    const [genLoading, setGenLoading] = useState(false);

    const handleGenerate = async () => {
        if (!onGeneratePlan) return;
        setGenLoading(true);
        try {
            await onGeneratePlan();
        } finally {
            setGenLoading(false);
        }
    };

    if (!workoutPlan || !workoutPlan.days || workoutPlan.days.length === 0) {
        return (
            <div className="bg-surface border border-border rounded-lg p-8 text-center">
                <Dumbbell className="w-8 h-8 text-text-disabled mx-auto mb-3" strokeWidth={1} />
                <h3 className="font-semibold text-base text-text-main">No Workout Plan Generated</h3>
                <p className="text-xs text-text-muted mt-1 mb-4">Click below to auto-generate your personalized routine.</p>
                <button
                    onClick={handleGenerate}
                    disabled={genLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-semibold rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${genLoading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                    {genLoading ? 'Generating Plan...' : 'Generate Plan'}
                </button>
            </div>
        );
    }

    const currentDay = workoutPlan.days[selectedDayIdx] || workoutPlan.days[0];
    const isDayCompleted = completedDays.includes(currentDay.dayLabel);
    const isSenior = Number(profile?.age) >= 50;

    const handleSwap = async (e, exerciseId) => {
        e.stopPropagation();
        setSwappingId(exerciseId);
        await onSwapExercise(currentDay.dayLabel, exerciseId);
        setSwappingId(null);
    };

    return (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-6">
            {/* Header & Day Completion Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-text-main" strokeWidth={1.5} />
                        <h3 className="font-bold text-base text-text-main">Workout Split</h3>
                    </div>
                </div>

                {/* Complete Day Button */}
                <button
                    onClick={() => onCompleteWorkoutDay(currentDay.dayLabel)}
                    className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${isDayCompleted
                        ? 'bg-success-bg text-success border border-success-border'
                        : 'bg-accent text-white hover:bg-accent-hover'
                        }`}
                >
                    {isDayCompleted ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" strokeWidth={2} /> Completed Today
                        </>
                    ) : (
                        <>
                            <Circle className="w-4 h-4" strokeWidth={1.5} /> Mark Day Complete
                        </>
                    )}
                </button>
            </div>

            {/* Senior Age Protocol Notice (if Age >= 50) */}
            {isSenior && (
                <div className="bg-surface-2 border border-border rounded p-3 flex items-center gap-2 text-xs text-text-secondary">
                    <ShieldCheck className="w-4 h-4 text-text-main shrink-0" strokeWidth={1.5} />
                    <span>
                        <strong>Senior Protocol (Age 50+):</strong> Exercises scaled to low-impact, joint-friendly variations with controlled 12-15 rep tempos.
                    </span>
                </div>
            )}

            {/* Day Selector Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {workoutPlan.days.map((day, idx) => {
                    const isSelected = selectedDayIdx === idx;
                    const isDone = completedDays.includes(day.dayLabel);
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedDayIdx(idx)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 border ${isSelected
                                ? 'border-accent bg-accent-light text-accent'
                                : 'border-border bg-surface text-text-muted hover:text-text-main hover:bg-surface-hover'
                                }`}
                        >
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-success" strokeWidth={2} />}
                            <span>{day.dayLabel.split('—')[0]}</span>
                        </button>
                    );
                })}
            </div>

            {/* Selected Day Title */}
            <div className="bg-surface-2 border border-border rounded p-3 flex items-center justify-between">
                <span className="font-semibold text-sm text-text-main">{currentDay.dayLabel}</span>
                <span className="text-xs text-text-muted num-tabular">{currentDay.exercises.length} Exercises</span>
            </div>

            {/* List of Exercise Cards — NO square icon backgrounds */}
            <div className="space-y-2">
                {currentDay.exercises.map((item, exIdx) => {
                    const ex = item.exerciseId;
                    if (!ex || typeof ex === 'string') return null;

                    const isCardio = ex.category === 'cardio';
                    const exIdStr = ex._id ? ex._id.toString() : ex.id;
                    const isSwappingThis = swappingId === exIdStr;

                    return (
                        <div
                            key={exIdx}
                            onClick={() => onSelectExercise(ex)}
                            className="group bg-surface hover:bg-surface-hover border border-border rounded p-4 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                            {/* Exercise title & icon — bare icon without square background */}
                            <div className="flex items-center gap-3">
                                {isCardio ? (
                                    <Activity className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.5} />
                                ) : (
                                    <Dumbbell className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.5} />
                                )}

                                <div>
                                    <h4 className="font-semibold text-sm text-text-main group-hover:text-accent transition-colors flex items-center gap-2">
                                        {ex.name}
                                        {ex.warning && (
                                            <span title="Safety Caution Available">
                                                <AlertTriangle className="w-3.5 h-3.5 text-warning inline" strokeWidth={1.5} />
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

                            <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                                {/* Sets & Reps */}
                                <div className="text-left sm:text-right">
                                    <div className="font-semibold text-sm text-text-main num-tabular">
                                        {item.sets} × {item.reps}
                                    </div>
                                    <div className="text-[10px] text-text-muted uppercase">Target</div>
                                </div>

                                {/* "Can't do this? Swap" Action Button */}
                                <button
                                    type="button"
                                    disabled={isSwappingThis}
                                    onClick={(e) => handleSwap(e, exIdStr)}
                                    title="Find alternative exercise for this muscle group"
                                    className="px-2.5 py-1.5 bg-surface-2 hover:bg-border text-text-secondary hover:text-text-main border border-border rounded text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isSwappingThis ? 'animate-spin text-accent' : ''}`} strokeWidth={1.5} />
                                    <span>{isSwappingThis ? 'Finding...' : "Can't do this?"}</span>
                                </button>

                                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-main transition-colors hidden sm:block" strokeWidth={1.5} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
