import React, { useState } from 'react';
import { Dumbbell, Utensils, ClipboardList, TrendingUp, Flame, ChevronRight, Check, RefreshCw, Trophy, Zap, Timer, Activity, ArrowRight, CheckCircle2, Circle, Info } from 'lucide-react';
import { generateWorkoutPlan, logDailyEntry } from '../services/api';
import ExerciseDetailModal from '../components/ExerciseDetailModal';

export default function Dashboard({ profile, workoutPlan, dietPlan, logs = [], onNavigate, onRefreshData }) {
    const [regenLoading, setRegenLoading] = useState(false);
    const [completingLoading, setCompletingLoading] = useState(false);
    const [checkedExercises, setCheckedExercises] = useState({});
    const [selectedExercise, setSelectedExercise] = useState(null);

    const completedTotal = logs.filter((l) => l.workoutDayCompleted).length;
    const streak = calculateStreak(logs);
    const todayWorkoutDay = workoutPlan?.days?.[0] || null;
    const upcomingDays = workoutPlan?.days?.slice(1, 4) || [];
    const weekCounts = getWeeklyCounts(logs);
    const weekDone = weekCounts.filter((d) => d.count > 0).length;
    const weekMax = Math.max(...weekCounts.map((d) => d.count), 1);

    const isTodayCompleted = logs.some((l) => l.workoutDayCompleted === todayWorkoutDay?.dayLabel);

    const handleRegenerateWorkout = async () => {
        if (!profile?._id) return;
        setRegenLoading(true);
        try {
            await generateWorkoutPlan(profile._id);
            await onRefreshData();
        } catch (err) {
            console.error('Failed to generate workout plan:', err);
        } finally {
            setRegenLoading(false);
        }
    };

    const handleCompleteWorkout = async () => {
        if (!profile?._id || !todayWorkoutDay?.dayLabel || completingLoading) return;
        setCompletingLoading(true);
        try {
            await logDailyEntry(profile._id, {
                workoutDayCompleted: todayWorkoutDay.dayLabel,
                date: new Date(),
            });
            await onRefreshData();
        } catch (err) {
            console.error('Failed to mark workout complete:', err);
        } finally {
            setCompletingLoading(false);
        }
    };

    const toggleExerciseCheck = (idx) => {
        setCheckedExercises((prev) => ({
            ...prev,
            [idx]: !prev[idx],
        }));
    };

    const goals = [
        { label: 'Workouts', current: weekDone, total: 4 },
        { label: 'Protein', current: 140, total: 160 },
        { label: 'Streak', current: streak, total: 7 },
    ];

    const achievements = [
        { label: 'First Workout', icon: Trophy, earned: completedTotal >= 1 },
        { label: '5-Day Streak', icon: Flame, earned: streak >= 5 },
        { label: '10 Sessions', icon: Check, earned: completedTotal >= 10 },
        { label: 'Goal Set', icon: Zap, earned: !!profile?.goal },
    ];

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="max-w-5xl mx-auto px-5 py-8 space-y-8">

            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-text-main tracking-tight">
                    {greeting}, {profile?.name?.split(' ')[0] || 'Athlete'}
                </h1>
                <p className="text-sm text-text-muted mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── LEFT: Main Content ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* PRIMARY CARD: Today's Workout */}
                    <div className="border border-border rounded-lg overflow-hidden bg-surface">
                        <div className="px-5 py-3 border-b border-border bg-surface-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-accent" strokeWidth={1.5} />
                                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Today's Workout</span>
                                {isTodayCompleted && (
                                    <span className="text-[10px] font-bold text-success bg-success-bg border border-success-border px-2 py-0.5 rounded flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Completed Today
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleRegenerateWorkout}
                                disabled={regenLoading}
                                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${regenLoading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                                {regenLoading ? 'Generating...' : 'Regenerate'}
                            </button>
                        </div>

                        {todayWorkoutDay ? (
                            <div className="p-5 space-y-5">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <h2 className="text-lg font-bold text-text-main leading-tight">
                                            {todayWorkoutDay.dayLabel}
                                        </h2>
                                        <span className="text-xs font-medium text-text-muted capitalize">
                                            {profile?.trainingStyle || 'strength'} • {todayWorkoutDay?.exercises?.length || 0} exercises
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-text-muted">
                                        <span className="flex items-center gap-1.5">
                                            <Timer className="w-3.5 h-3.5" strokeWidth={1.5} />
                                            45–55 min estimated
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Activity className="w-3.5 h-3.5" strokeWidth={1.5} />
                                            Target: {profile?.goal?.toUpperCase() || 'CUT'}
                                        </span>
                                    </div>
                                </div>

                                {/* Exercises Interactive Checklist */}
                                {todayWorkoutDay.exercises && todayWorkoutDay.exercises.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs text-text-muted">
                                            <span className="font-semibold uppercase tracking-wider">Exercise Checklist</span>
                                            <span>
                                                {isTodayCompleted
                                                    ? `${todayWorkoutDay.exercises.length} of ${todayWorkoutDay.exercises.length} completed`
                                                    : `${Object.values(checkedExercises).filter(Boolean).length} of ${todayWorkoutDay.exercises.length} checked`
                                                }
                                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="w-full h-1.5 bg-surface-2 border border-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent transition-all duration-300 rounded-full"
                                                style={{
                                                    width: `${isTodayCompleted
                                                        ? 100
                                                        : Math.round((Object.values(checkedExercises).filter(Boolean).length / todayWorkoutDay.exercises.length) * 100)
                                                        }%`
                                                }}
                                            />
                                        </div>

                                        <div className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-surface-2 mt-3">
                                            {todayWorkoutDay.exercises.map((item, idx) => {
                                                const ex = item.exerciseId;
                                                const exName = typeof ex === 'object' && ex?.name ? ex.name : `Exercise ${idx + 1}`;
                                                const exMuscle = typeof ex === 'object' && ex?.muscleGroup ? ex.muscleGroup : '';
                                                const isChecked = isTodayCompleted || !!checkedExercises[idx];

                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => toggleExerciseCheck(idx)}
                                                        className={`flex items-center justify-between px-3.5 py-2.5 transition-colors cursor-pointer ${isChecked ? 'bg-surface/60' : 'hover:bg-surface'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExerciseCheck(idx);
                                                                }}
                                                                className="text-text-muted hover:text-accent transition-colors shrink-0"
                                                            >
                                                                {isChecked ? (
                                                                    <CheckCircle2 className="w-4.5 h-4.5 text-success fill-success/20" strokeWidth={2} />
                                                                ) : (
                                                                    <Circle className="w-4.5 h-4.5 text-text-muted" strokeWidth={1.5} />
                                                                )}
                                                            </button>
                                                            <div className="min-w-0">
                                                                <span className={`block text-xs font-semibold truncate ${isChecked ? 'line-through text-text-muted' : 'text-text-main'}`}>
                                                                    {exName}
                                                                </span>
                                                                {exMuscle && (
                                                                    <span className="text-[10px] text-text-muted capitalize">
                                                                        {exMuscle}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 shrink-0">
                                                            <span className="text-xs num-tabular font-semibold text-text-secondary">
                                                                {item.sets} × {item.reps}
                                                            </span>
                                                            {typeof ex === 'object' && ex?.name && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedExercise(ex);
                                                                    }}
                                                                    className="p-1 text-text-muted hover:text-text-main transition-colors"
                                                                    title="View exercise instructions & safety warning"
                                                                >
                                                                    <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 pt-3 border-t border-border">
                                    <button
                                        onClick={handleCompleteWorkout}
                                        disabled={completingLoading || isTodayCompleted}
                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded transition-colors ${isTodayCompleted
                                            ? 'bg-success-bg text-success border border-success-border cursor-default'
                                            : 'bg-accent text-white hover:bg-accent-hover disabled:opacity-50'
                                            }`}
                                    >
                                        {isTodayCompleted ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                                                Logged for Today
                                            </>
                                        ) : completingLoading ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Logging...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" strokeWidth={2} />
                                                Mark Workout Complete
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => onNavigate('workout')}
                                        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-main hover:bg-surface-hover rounded transition-colors flex items-center gap-1"
                                    >
                                        <span>Full Routine & Swap</span>
                                        <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center bg-surface">
                                <Dumbbell className="w-8 h-8 text-text-disabled mx-auto mb-3" strokeWidth={1} />
                                <p className="text-sm font-semibold text-text-main">No workout generated yet</p>
                                <p className="text-xs text-text-muted mt-1 mb-4">Generate a personalized plan based on your goals</p>
                                <button
                                    onClick={handleRegenerateWorkout}
                                    disabled={regenLoading}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-accent text-white rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${regenLoading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                                    {regenLoading ? 'Generating plan...' : 'Generate Plan'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* STAT ROW */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { value: completedTotal, label: 'Sessions logged' },
                            { value: `${streak}`, label: 'Day streak' },
                            { value: `${weekDone}/7`, label: 'This week' },
                            { value: dietPlan?.macros?.calories ? `${(dietPlan.macros.calories / 1000).toFixed(1)}k` : '—', label: 'Daily kcal' },
                        ].map((s, i) => (
                            <div key={i} className="border border-border rounded-lg p-4 bg-surface">
                                <span className="block num-tabular text-2xl font-bold tracking-tight text-text-main">
                                    {s.value}
                                </span>
                                <span className="block text-xs text-text-muted mt-1">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* QUICK ACTIONS — no icon square backgrounds */}
                    <div>
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Quick access</p>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { icon: Dumbbell, label: 'Workouts', tab: 'workout' },
                                { icon: Utensils, label: 'Nutrition', tab: 'diet' },
                                { icon: ClipboardList, label: 'Meds', tab: 'meds' },
                                { icon: TrendingUp, label: 'Analytics', tab: 'progress' },
                            ].map((a) => (
                                <button
                                    key={a.tab}
                                    onClick={() => onNavigate(a.tab)}
                                    className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg bg-surface hover:bg-surface-hover transition-colors group"
                                >
                                    <a.icon className="w-5 h-5 text-text-secondary group-hover:text-text-main transition-colors" strokeWidth={1.5} />
                                    <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RECENT ACTIVITY */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Recent activity</p>
                            <button onClick={() => onNavigate('progress')} className="text-xs text-accent hover:underline flex items-center gap-1">
                                See all <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="border border-border rounded-lg overflow-hidden bg-surface divide-y divide-border">
                            {logs.filter((l) => l.workoutDayCompleted).slice(0, 4).length > 0 ? (
                                logs.filter((l) => l.workoutDayCompleted).slice(0, 4).map((log, i) => (
                                    <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors">
                                        <Dumbbell className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.5} />
                                        <div className="flex-1 min-w-0">
                                            <span className="block text-sm font-medium text-text-main">Workout session</span>
                                            <span className="block text-xs text-text-muted">
                                                {log.exercisesCompleted?.length || 0} exercises completed
                                            </span>
                                        </div>
                                        <span className="text-xs text-text-muted num-tabular shrink-0">
                                            {log.date ? new Date(log.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '—'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-10 text-center">
                                    <Activity className="w-6 h-6 text-text-disabled mx-auto mb-2" strokeWidth={1} />
                                    <p className="text-sm font-medium text-text-main">No sessions yet</p>
                                    <p className="text-xs text-text-muted mt-0.5">Complete a workout to see your history here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT SIDEBAR ── */}
                <div className="space-y-4">

                    {/* Streak */}
                    <div className="border border-border rounded-lg p-4 bg-surface">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Weekly streak</p>
                        <div className="flex items-baseline gap-1.5 mb-4">
                            <span className="num-tabular font-bold text-3xl text-text-main">{streak}</span>
                            <span className="text-xs text-text-muted">days</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {weekCounts.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                    <div className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-semibold transition-all border ${d.count > 0
                                        ? 'bg-accent text-white border-accent'
                                        : 'bg-surface text-text-muted border-border'
                                        }`}>
                                        {d.count > 0 ? <Check className="w-3 h-3" strokeWidth={2.5} /> : i + 1}
                                    </div>
                                    <span className="text-[9px] text-text-muted">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming */}
                    {upcomingDays.length > 0 && (
                        <div className="border border-border rounded-lg p-4 bg-surface">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Upcoming</p>
                                <button onClick={() => onNavigate('workout')} className="text-[11px] text-accent hover:underline">View all</button>
                            </div>
                            <div className="space-y-1">
                                {upcomingDays.map((day, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-2 rounded hover:bg-surface-hover transition-colors cursor-pointer group"
                                        onClick={() => onNavigate('workout')}
                                    >
                                        <Dumbbell className="w-3.5 h-3.5 text-text-muted shrink-0" strokeWidth={1.5} />
                                        <div className="flex-1 min-w-0">
                                            <span className="block text-xs font-medium text-text-main truncate">{day.dayLabel}</span>
                                            <span className="block text-[10px] text-text-muted">{day.exercises?.length || 0} exercises</span>
                                        </div>
                                        <ChevronRight className="w-3 h-3 text-text-muted group-hover:text-text-main shrink-0" strokeWidth={1.5} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* This week bar chart */}
                    <div className="border border-border rounded-lg p-4 bg-surface">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">This week</p>
                            <span className="text-xs text-text-muted num-tabular">{weekDone}/7</span>
                        </div>
                        <div className="flex items-end gap-1 h-12">
                            {weekCounts.map((d, i) => {
                                const heightPct = d.count > 0 ? Math.max((d.count / weekMax) * 100, 25) : 8;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full flex flex-col justify-end" style={{ height: '40px' }}>
                                            <div
                                                className={`w-full rounded-sm transition-all ${d.count > 0 ? 'bg-accent' : 'bg-surface-2 border border-border'}`}
                                                style={{ height: `${heightPct}%` }}
                                            />
                                        </div>
                                        <span className="text-[9px] text-text-muted">{d.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Goals */}
                    <div className="border border-border rounded-lg p-4 bg-surface">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Goals</p>
                            <span className="text-[10px] font-bold text-text-secondary bg-surface-2 border border-border px-2 py-0.5 rounded">
                                {profile?.goal?.toUpperCase() || 'CUT'}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {goals.map((g, i) => {
                                const pct = Math.min(100, Math.round((g.current / g.total) * 100));
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-text-secondary font-medium">{g.label}</span>
                                            <span className="text-text-muted num-tabular">{pct}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-surface-2 border border-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all bg-accent"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="border border-border rounded-lg p-4 bg-surface">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Achievements</p>
                            <button onClick={() => onNavigate('progress')} className="text-[11px] text-accent hover:underline">All</button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {achievements.map((a, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col items-center gap-1.5 p-2 rounded border transition-all ${a.earned
                                        ? 'bg-accent-light border-info-border'
                                        : 'bg-surface-2 border-border opacity-50'
                                        }`}
                                >
                                    <a.icon className={`w-4 h-4 ${a.earned ? 'text-accent' : 'text-text-muted'}`} strokeWidth={1.5} />
                                    <span className="text-[9px] font-medium text-center text-text-muted leading-tight">{a.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upgrade */}
                    {!profile?.isPremium && (
                        <div className="border border-border rounded-lg p-4 bg-surface-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Trophy className="w-3.5 h-3.5 text-text-secondary" strokeWidth={1.5} />
                                <span className="text-xs font-semibold text-text-main">Go pro</span>
                            </div>
                            <p className="text-xs text-text-muted mb-3 leading-relaxed">
                                AI coaching, advanced analytics, and more.
                            </p>
                            <button
                                onClick={() => onNavigate('pricing')}
                                className="w-full py-1.5 text-xs font-semibold text-accent border border-accent/30 rounded hover:bg-accent-light transition-colors"
                            >
                                Upgrade to Pro
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {selectedExercise && (
                <ExerciseDetailModal
                    exercise={selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                />
            )}
        </div>
    );
}

// ─── Helpers ───
function calculateStreak(logs) {
    if (!logs || logs.length === 0) return 0;
    const completedDates = new Set(
        logs.filter((l) => l.workoutDayCompleted && l.date).map((l) => new Date(l.date).toDateString())
    );
    let streak = 0;
    let checkDate = new Date();
    while (completedDates.has(checkDate.toDateString())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
}

function getWeeklyCounts(logs) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const currentDayIdx = (now.getDay() + 6) % 7;
    return days.map((label, i) => {
        const count = logs.filter((l) => {
            if (!l.workoutDayCompleted || !l.date) return false;
            const d = new Date(l.date);
            return (d.getDay() + 6) % 7 === i;
        }).length;
        return { label, count, isFuture: i > currentDayIdx };
    });
}
