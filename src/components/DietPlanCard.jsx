import React from 'react';
import { Flame, Activity, Zap, RefreshCw } from 'lucide-react';

export default function DietPlanCard({ dietPlan, profile, onRecalculate }) {
    if (!dietPlan) return null;

    const { bmr, tdee, macros } = dietPlan;

    // Calculate percentages
    const totalCal = macros.calories;
    const pCal = macros.proteinG * 4;
    const cCal = macros.carbsG * 4;
    const fCal = macros.fatG * 9;

    const pPct = Math.round((pCal / totalCal) * 100);
    const cPct = Math.round((cCal / totalCal) * 100);
    const fPct = Math.round((fCal / totalCal) * 100);

    return (
        <div className="bg-surface border border-surface-border rounded-xl p-6 shadow-xl relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-accent" />
                    <h3 className="font-display font-bold text-lg text-text-main">Daily Nutrition Protocol</h3>
                </div>
                <button
                    onClick={onRecalculate}
                    title="Recalculate Macros"
                    className="text-xs text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Recalculate
                </button>
            </div>

            {/* Hero Calorie Target */}
            <div className="bg-bg border border-surface-border rounded-lg p-5 mb-6 text-center">
                <div className="text-xs text-text-muted font-display uppercase tracking-wider mb-1">
                    Daily Caloric Target ({profile?.goal?.toUpperCase() || 'CUT'} PHASE)
                </div>
                <div className="flex items-baseline justify-center gap-2">
                    <span className="font-display font-extrabold text-4xl sm:text-5xl text-accent num-tabular">
                        {macros.calories.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-text-muted uppercase">kcal / day</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-text-muted mt-3 pt-3 border-t border-surface-border/50">
                    <span>BMR: <strong className="text-text-main font-display">{bmr}</strong> kcal</span>
                    <span className="text-surface-border">•</span>
                    <span>TDEE: <strong className="text-text-main font-display">{tdee}</strong> kcal</span>
                </div>
            </div>

            {/* Three Compact Macro Stat Blocks */}
            <div className="grid grid-cols-3 gap-3">
                {/* Protein */}
                <div className="bg-surface-hover/80 border border-surface-border rounded-lg p-3.5 text-center">
                    <span className="block text-[11px] text-text-muted font-display uppercase font-semibold">PROTEIN</span>
                    <span className="block font-display font-bold text-2xl text-text-main my-0.5 num-tabular">
                        {macros.proteinG}g
                    </span>
                    <span className="block text-[11px] text-accent font-semibold">{pPct}% of calories</span>
                </div>

                {/* Carbs */}
                <div className="bg-surface-hover/80 border border-surface-border rounded-lg p-3.5 text-center">
                    <span className="block text-[11px] text-text-muted font-display uppercase font-semibold">CARBS</span>
                    <span className="block font-display font-bold text-2xl text-text-main my-0.5 num-tabular">
                        {macros.carbsG}g
                    </span>
                    <span className="block text-[11px] text-text-muted font-semibold">{cPct}% of calories</span>
                </div>

                {/* Fat */}
                <div className="bg-surface-hover/80 border border-surface-border rounded-lg p-3.5 text-center">
                    <span className="block text-[11px] text-text-muted font-display uppercase font-semibold">FATS</span>
                    <span className="block font-display font-bold text-2xl text-text-main my-0.5 num-tabular">
                        {macros.fatG}g
                    </span>
                    <span className="block text-[11px] text-text-muted font-semibold">{fPct}% of calories</span>
                </div>
            </div>
        </div>
    );
}
