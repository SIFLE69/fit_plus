import React from 'react';
import { Flame, Trophy, Dumbbell, TrendingUp, Award } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

export default function JefitStreakWidget({ logs = [], profile }) {
    const completedWorkoutsCount = logs.filter((l) => Boolean(l.workoutDayCompleted)).length;
    const streakDays = Math.max(1, completedWorkoutsCount);

    const personalRecords = [
        { exercise: 'Bench Press', pr: '85.0 kg', date: 'Yesterday' },
        { exercise: 'Barbell Squat', pr: '110.0 kg', date: '3 days ago' },
        { exercise: 'Deadlift', pr: '140.0 kg', date: '5 days ago' },
        { exercise: 'Weighted Pull-Up', pr: '+15.0 kg', date: '1 week ago' },
    ];

    return (
        <Card className="space-y-4 border-surface-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold">
                        <Flame className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-xs text-text-main flex items-center gap-2">
                            Strength & Consistency Telemetry
                        </h3>
                        <p className="text-[11px] text-text-muted">Personal records, workout streaks, and performance metrics</p>
                    </div>
                </div>

                <Badge variant="warning" size="sm" icon={Flame} className="self-start sm:self-auto">
                    {streakDays}-DAY ACTIVE STREAK
                </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-bg/80 border border-surface-border rounded-lg p-3">
                    <span className="text-[10px] font-semibold text-text-muted uppercase block">SESSIONS LOGGED</span>
                    <span className="font-mono font-bold text-xl text-accent num-tabular block my-0.5">{completedWorkoutsCount}</span>
                    <span className="text-[10px] text-text-muted">Total Workouts</span>
                </div>

                <div className="bg-bg/80 border border-surface-border rounded-lg p-3">
                    <span className="text-[10px] font-semibold text-text-muted uppercase block">CURRENT STREAK</span>
                    <span className="font-mono font-bold text-xl text-warning num-tabular block my-0.5">{streakDays} Days</span>
                    <span className="text-[10px] text-text-muted">Active Consistency</span>
                </div>

                <div className="bg-bg/80 border border-surface-border rounded-lg p-3">
                    <span className="text-[10px] font-semibold text-text-muted uppercase block">VOLUME LIFTED</span>
                    <span className="font-mono font-bold text-xl text-info num-tabular block my-0.5">18.4k kg</span>
                    <span className="text-[10px] text-text-muted">Cumulative Load</span>
                </div>

                <div className="bg-bg/80 border border-surface-border rounded-lg p-3">
                    <span className="text-[10px] font-semibold text-text-muted uppercase block">MAX BENCH PR</span>
                    <span className="font-mono font-bold text-xl text-success num-tabular block my-0.5">85 kg</span>
                    <span className="text-[10px] text-text-muted">1-Rep Max Est.</span>
                </div>
            </div>

            {/* Personal Record Badges Row */}
            <div className="bg-bg/60 border border-surface-border rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted uppercase mb-2">
                    <Trophy className="w-3.5 h-3.5 text-accent" />
                    <span>Active Personal Bests (PRs)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {personalRecords.map((pr, idx) => (
                        <div key={idx} className="bg-surface p-2.5 rounded-md border border-surface-border text-xs">
                            <span className="font-semibold text-text-main block truncate">{pr.exercise}</span>
                            <span className="font-mono font-bold text-accent num-tabular">{pr.pr}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
