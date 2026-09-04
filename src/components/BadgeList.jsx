import React from 'react';
import { Flame, Lock, Trophy, Award, Footprints, Zap, ShieldCheck, Activity } from 'lucide-react';

const iconMap = {
    Footprints: Footprints,
    Flame: Flame,
    Zap: Zap,
    ShieldCheck: ShieldCheck,
    Trophy: Trophy,
    Award: Award,
    Activity: Activity,
};

export default function BadgeList({ badges = [], logs = [] }) {
    // Calculate current streak
    const uniqueDates = Array.from(
        new Set(logs.map((l) => new Date(l.date).toISOString().split('T')[0]))
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

    const earnedCount = badges.filter((b) => b.isEarned).length;

    return (
        <div className="bg-surface border border-surface-border rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
            {/* Streak Scoreboard Header */}
            <div className="bg-bg border border-surface-border rounded-lg p-5 flex items-center justify-between">
                <div>
                    <span className="text-xs text-text-muted font-display uppercase tracking-wider block">
                        ACTIVE WORKOUT STREAK
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-display font-extrabold text-4xl sm:text-5xl text-accent num-tabular">
                            {currentStreak}
                        </span>
                        <span className="text-sm font-semibold text-text-muted uppercase">DAYS IN A ROW</span>
                    </div>
                </div>

                <div className="w-14 h-14 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                    <Flame className="w-8 h-8 text-accent animate-pulse" />
                </div>
            </div>

            {/* Badges Grid Header */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-bold text-sm text-text-main">Earned Achievements</h4>
                    <span className="text-xs text-text-muted">
                        <strong className="text-accent font-display">{earnedCount}</strong> / {badges.length} Unlocked
                    </span>
                </div>

                {/* Small Icon Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {badges.map((b) => {
                        const IconComponent = iconMap[b.icon] || Trophy;
                        const isEarned = b.isEarned;

                        return (
                            <div
                                key={b.code}
                                className={`p-3.5 rounded-lg border text-center transition-all relative ${isEarned
                                        ? 'border-accent/40 bg-surface-hover/80 text-text-main shadow-md'
                                        : 'border-surface-border/50 bg-bg/50 opacity-40 text-text-muted'
                                    }`}
                            >
                                {!isEarned && (
                                    <div className="absolute top-2 right-2 text-text-muted">
                                        <Lock className="w-3.5 h-3.5" />
                                    </div>
                                )}
                                <div
                                    className={`w-9 h-9 mx-auto rounded-lg flex items-center justify-center mb-2 ${isEarned ? 'bg-accent/20 text-accent' : 'bg-surface-border/40 text-text-muted'
                                        }`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <div className="font-display font-bold text-xs truncate">{b.label}</div>
                                <div className="text-[10px] text-text-muted line-clamp-2 mt-0.5">{b.rule}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
