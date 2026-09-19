import React, { useMemo, useState } from 'react';
import { Calendar, Flame, Trophy } from 'lucide-react';

export default function GithubCommitGraph({ logs = [] }) {
    const [hoveredDay, setHoveredDay] = useState(null);

    // Build 52 weeks (364 days) leading up to today
    const { daysMatrix, totalCompletedDays, currentStreak, longestStreak, monthLabels } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Map logs by YYYY-MM-DD
        const completedMap = new Map();
        logs.forEach((log) => {
            if (log.date) {
                const dateKey = new Date(log.date).toISOString().split('T')[0];
                const prev = completedMap.get(dateKey) || 0;
                completedMap.set(dateKey, prev + (log.workoutDayCompleted ? 2 : 1));
            }
        });

        // Generate past 52 weeks (364 days), ending on upcoming Sunday to align grid
        const endDate = new Date(today);
        const dayOfWeek = endDate.getDay(); // 0 is Sun
        const daysToSunday = 7 - (dayOfWeek === 0 ? 7 : dayOfWeek);
        endDate.setDate(endDate.getDate() + daysToSunday);

        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 363);

        const weeks = [];
        const monthHeaderList = [];
        let currentWeek = [];
        let lastMonth = -1;

        let cur = new Date(startDate);
        let completedCount = 0;

        for (let i = 0; i < 364; i++) {
            const dateStr = cur.toISOString().split('T')[0];
            const val = completedMap.get(dateStr) || 0;
            if (val > 0) completedCount++;

            const month = cur.getMonth();
            if (month !== lastMonth && cur.getDate() <= 7) {
                const monthName = cur.toLocaleDateString('en-US', { month: 'short' });
                monthHeaderList.push({ weekIndex: weeks.length, label: monthName });
                lastMonth = month;
            }

            const dayObj = {
                dateStr,
                dateObj: new Date(cur),
                count: val,
                isToday: cur.toDateString() === today.toDateString(),
                isFuture: cur > today,
            };

            currentWeek.push(dayObj);

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            cur.setDate(cur.getDate() + 1);
        }

        // Calculate streaks
        let streak = 0;
        let maxStreak = 0;
        let checkDate = new Date(today);

        while (true) {
            const key = checkDate.toISOString().split('T')[0];
            if (completedMap.get(key)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                if (checkDate.toDateString() === today.toDateString()) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
                break;
            }
        }

        let tempStreak = 0;
        let testCur = new Date(startDate);
        for (let i = 0; i < 364; i++) {
            const key = testCur.toISOString().split('T')[0];
            if (completedMap.get(key)) {
                tempStreak++;
                if (tempStreak > maxStreak) maxStreak = tempStreak;
            } else {
                tempStreak = 0;
            }
            testCur.setDate(testCur.getDate() + 1);
        }

        return {
            daysMatrix: weeks,
            totalCompletedDays: completedCount,
            currentStreak: streak,
            longestStreak: maxStreak,
            monthLabels: monthHeaderList,
        };
    }, [logs]);

    // Theme-compatible color levels
    const getColorClass = (day) => {
        if (day.isFuture) return 'bg-surface-hover/30 border-transparent';
        if (day.count === 0) return 'bg-surface-hover/80 border-surface-border/60';
        if (day.count === 1) return 'bg-success/35 border-success/50';
        if (day.count === 2) return 'bg-success/65 border-success/80';
        if (day.count === 3) return 'bg-success border-success';
        return 'bg-success border-success shadow-sm';
    };

    const rowLabels = ['Mon', '', 'Wed', '', 'Fri', ''];

    return (
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
            {/* Header Telemetry */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success/15 border border-success/30 flex items-center justify-center text-success">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-xs text-text-main">Workout Consistency Activity</h3>
                        <p className="text-[11px] text-text-muted mt-0.5">
                            {totalCompletedDays} workout days finished in past 52 weeks
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="flex items-center gap-1.5 bg-bg px-2.5 py-1 rounded-md border border-surface-border">
                        <Flame className="w-3.5 h-3.5 text-warning" />
                        <span className="text-text-muted">Streak:</span>
                        <span className="font-bold text-warning">{currentStreak} days</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-bg px-2.5 py-1 rounded-md border border-surface-border">
                        <Trophy className="w-3.5 h-3.5 text-accent" />
                        <span className="text-text-muted">Max:</span>
                        <span className="font-bold text-accent">{longestStreak} days</span>
                    </div>
                </div>
            </div>

            {/* Heatmap Matrix */}
            <div className="overflow-x-auto scrollbar-none pt-1">
                <div className="min-w-[680px]">
                    {/* Month labels row */}
                    <div className="flex text-[10px] font-mono text-text-muted mb-1.5 ml-7 relative h-4">
                        {monthLabels.map((m, idx) => (
                            <span
                                key={idx}
                                style={{ left: `${m.weekIndex * 13}px` }}
                                className="absolute"
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-1 pt-2">
                        {/* Day labels column */}
                        <div className="flex flex-col gap-1 text-[9px] font-mono text-text-muted pr-1.5 select-none pt-0.5">
                            {rowLabels.map((label, idx) => (
                                <div key={idx} className="h-2.5 leading-2.5 flex items-center justify-end">
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* 52 Weeks Columns */}
                        <div className="flex gap-[3px] flex-1">
                            {daysMatrix.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-[3px]">
                                    {week.map((day, dIdx) => (
                                        <div
                                            key={dIdx}
                                            onMouseEnter={() => setHoveredDay(day)}
                                            onMouseLeave={() => setHoveredDay(null)}
                                            className={`w-2.5 h-2.5 rounded-[2px] border transition-all cursor-pointer hover:scale-125 ${getColorClass(
                                                day
                                            )} ${day.isToday ? 'ring-1 ring-accent ring-offset-1 ring-offset-bg' : ''}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Legend & Hover Tooltip display */}
            <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-2 border-t border-surface-border">
                <div className="min-h-[18px]">
                    {hoveredDay ? (
                        <span className="text-text-main">
                            <span className="text-success font-semibold">{hoveredDay.count > 0 ? `${hoveredDay.count} workout log(s)` : 'No workout'}</span> on{' '}
                            {hoveredDay.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    ) : (
                        <span>Hover over squares to inspect workout history</span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-surface-hover/80 border border-surface-border" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-success/35" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-success/65" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-success" />
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
