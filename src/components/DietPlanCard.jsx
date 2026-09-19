import React from 'react';
import { Flame, RefreshCw, HeartPulse, AlertTriangle } from 'lucide-react';
import Card from './ui/Card';

export default function DietPlanCard({ dietPlan, profile, onRecalculate }) {
    if (!dietPlan) return null;

    const { bmr, tdee, macros, diseaseGuidance = [], allergyPrecautions = [] } = dietPlan;

    const totalCal = macros.calories;
    const pCal = macros.proteinG * 4;
    const cCal = macros.carbsG * 4;
    const fCal = macros.fatG * 9;

    const pPct = Math.round((pCal / totalCal) * 100);
    const cPct = Math.round((cCal / totalCal) * 100);
    const fPct = Math.round((fCal / totalCal) * 100);

    return (
        <Card className="space-y-4 border-surface-border">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-accent" />
                    <h3 className="font-semibold text-xs text-text-main">Nutrition Summary & Macros</h3>
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
            <div className="bg-bg/80 border border-surface-border rounded-lg p-4 text-center">
                <div className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1">
                    TARGET CALORIE INTAKE ({profile?.goal?.toUpperCase() || 'CUT'} PHASE)
                </div>
                <div className="flex items-baseline justify-center gap-1.5">
                    <span className="font-mono font-bold text-3xl text-accent num-tabular">
                        {macros.calories.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-text-muted uppercase">kcal / day</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-text-muted mt-2 pt-2 border-t border-surface-border">
                    <span>BMR: <strong className="text-text-main font-mono">{bmr}</strong> kcal</span>
                    <span className="text-surface-border">•</span>
                    <span>TDEE: <strong className="text-text-main font-mono">{tdee}</strong> kcal</span>
                </div>
            </div>

            {/* Stacked macro progress bar with 3 always-distinct colors */}
            <div className="h-3 w-full bg-bg rounded-full overflow-hidden flex border border-surface-border">
                <div style={{ width: `${pPct}%` }} className="bg-[#3B82F6] h-full transition-all" title={`Protein ${pPct}%`} />
                <div style={{ width: `${cPct}%` }} className="bg-[#10B981] h-full transition-all" title={`Carbs ${cPct}%`} />
                <div style={{ width: `${fPct}%` }} className="bg-[#F59E0B] h-full transition-all" title={`Fats ${fPct}%`} />
            </div>

            {/* Three Compact Macro Stat Blocks */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-bg/80 border border-surface-border rounded-lg p-3 text-center">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">PROTEIN</span>
                    <span className="block font-mono font-bold text-lg text-[#3B82F6] my-0.5 num-tabular">
                        {macros.proteinG}g
                    </span>
                    <span className="block text-[10px] text-text-muted font-mono">{pPct}%</span>
                </div>

                <div className="bg-bg/80 border border-surface-border rounded-lg p-3 text-center">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">CARBS</span>
                    <span className="block font-mono font-bold text-lg text-[#10B981] my-0.5 num-tabular">
                        {macros.carbsG}g
                    </span>
                    <span className="block text-[10px] text-text-muted font-mono">{cPct}%</span>
                </div>

                <div className="bg-bg/80 border border-surface-border rounded-lg p-3 text-center">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">FATS</span>
                    <span className="block font-mono font-bold text-lg text-[#F59E0B] my-0.5 num-tabular">
                        {macros.fatG}g
                    </span>
                    <span className="block text-[10px] text-text-muted font-mono">{fPct}%</span>
                </div>
            </div>

            {/* Medical Disease Specific Protocols */}
            {diseaseGuidance.length > 0 && (
                <div className="bg-bg/80 border border-surface-border rounded-lg p-3.5 space-y-1.5">
                    <div className="text-xs font-semibold text-accent uppercase flex items-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-accent" /> Clinical Protocol Guidance
                    </div>
                    {diseaseGuidance.map((g, idx) => (
                        <div key={idx} className="text-xs text-text-muted">
                            <strong className="text-text-main font-semibold uppercase">{g.condition}:</strong> {g.advice}
                        </div>
                    ))}
                </div>
            )}

            {/* Food Allergy Warnings */}
            {allergyPrecautions.length > 0 && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-3.5 space-y-1 text-xs text-warning">
                    <div className="font-semibold uppercase flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-warning" /> Allergy Precautions
                    </div>
                    {allergyPrecautions.map((p, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                            <span>•</span>
                            <span>{p}</span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
