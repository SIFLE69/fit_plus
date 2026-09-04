import React, { useState, useEffect } from 'react';
import DietPlanCard from '../components/DietPlanCard';
import PremiumLock from '../components/PremiumLock';
import { getAiTip, generateDietPlan, generateWorkoutPlan } from '../services/api';
import { Sparkles, Dumbbell, ArrowRight, Activity, Flame, ShieldAlert } from 'lucide-react';

export default function Dashboard({ profile, dietPlan, workoutPlan, logs = [], onNavigate, onRefreshData }) {
    const [aiTip, setAiTip] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        if (profile?.isPremium) {
            setAiLoading(true);
            getAiTip(profile._id)
                .then((res) => setAiTip(res.tip))
                .catch(() => setAiTip(null))
                .finally(() => setAiLoading(false));
        }
    }, [profile?._id, profile?.isPremium]);

    const handleRecalculateDiet = async () => {
        if (!profile?._id) return;
        await generateDietPlan(profile._id);
        onRefreshData();
    };

    const handleRegenerateWorkout = async () => {
        if (!profile?._id) return;
        await generateWorkoutPlan(profile._id);
        onRefreshData();
    };

    const todayWorkoutDay = workoutPlan?.days ? workoutPlan.days[0] : null;

    return (
        <div className="space-y-6 pb-12">
            {/* Athlete Header */}
            <div className="bg-surface border border-surface-border rounded-xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-display font-bold text-accent uppercase tracking-wider px-2 py-0.5 bg-accent/10 border border-accent/20 rounded">
                            ATHLETE DASHBOARD
                        </span>
                        {profile?.conditions?.length > 0 && (
                            <span className="text-xs text-warning bg-warning-bg px-2 py-0.5 rounded border border-warning-border flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" /> {profile.conditions.length} Active Condition Filters
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-main mt-1">
                        Welcome back, {profile?.name || 'Athlete'}
                    </h1>
                    <p className="text-xs text-text-muted mt-0.5">
                        Phase: <strong className="text-text-main uppercase font-display">{profile?.goal || 'Cut'}</strong> • Style: <strong className="text-text-main uppercase font-display">{profile?.trainingStyle || 'Strength'}</strong>
                    </p>
                </div>

                <button
                    onClick={() => onNavigate('workout')}
                    className="px-5 py-2.5 bg-accent text-bg hover:bg-accent-hover font-display font-bold text-xs rounded-lg min-h-[44px] flex items-center gap-2 transition-colors self-start sm:self-auto"
                >
                    <Dumbbell className="w-4 h-4" /> Go to Today's Workout <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* AI Tip of the Day (Honest AI Feature Gated by Premium) */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-text-muted font-display uppercase font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-accent" /> AI Coach Tip of the Day
                    </span>
                </div>
                <PremiumLock
                    isPremium={profile?.isPremium}
                    title="AI Coach Guidance Engine"
                    onUpgradeClick={() => onNavigate('pricing')}
                >
                    <div className="bg-gradient-to-r from-surface to-surface-hover border border-accent/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                                <Sparkles className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-xs text-accent uppercase tracking-wider mb-1">
                                    Daily Execution Insight
                                </h4>
                                <p className="text-sm text-text-main leading-relaxed">
                                    {aiLoading ? 'Generating personalized biomechanics tip...' : (aiTip || 'Prioritize your protein target early in the day to optimize muscle retention.')}
                                </p>
                            </div>
                        </div>
                    </div>
                </PremiumLock>
            </div>

            {/* Diet Plan Section */}
            <DietPlanCard
                dietPlan={dietPlan}
                profile={profile}
                onRecalculate={handleRecalculateDiet}
            />

            {/* Today's Workout Quick Preview */}
            <div className="bg-surface border border-surface-border rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-accent" />
                        <h3 className="font-display font-bold text-lg text-text-main">Today's Workout Preview</h3>
                    </div>
                    <button
                        onClick={handleRegenerateWorkout}
                        className="text-xs text-text-muted hover:text-accent font-display"
                    >
                        Regenerate Split
                    </button>
                </div>

                {todayWorkoutDay ? (
                    <div className="bg-bg border border-surface-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs text-accent font-display font-bold uppercase block">
                                {todayWorkoutDay.dayLabel}
                            </span>
                            <span className="text-xs text-text-muted mt-1 block">
                                {todayWorkoutDay.exercises.length} Exercises Scheduled • {profile?.trainingStyle?.toUpperCase()} Protocol
                            </span>
                        </div>
                        <button
                            onClick={() => onNavigate('workout')}
                            className="px-4 py-2 bg-surface hover:bg-surface-hover text-text-main border border-surface-border rounded-lg text-xs font-display font-bold flex items-center justify-center gap-1.5 min-h-[40px] transition-colors"
                        >
                            Start Session <ArrowRight className="w-3.5 h-3.5 text-accent" />
                        </button>
                    </div>
                ) : (
                    <div className="text-xs text-text-muted text-center py-4">No workout generated.</div>
                )}
            </div>
        </div>
    );
}
