import React, { useState, useEffect } from 'react';
import { Apple, ArrowRight } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

export default function MyFitnessPalMacroWidget({ profile, dietPlan, onNavigate }) {
    const [todayTotals, setTodayTotals] = useState({
        calories: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
    });

    const targetCalories = dietPlan?.macros?.calories || 2200;
    const targetProtein = dietPlan?.macros?.proteinG || 160;
    const targetCarbs = dietPlan?.macros?.carbsG || 220;
    const targetFat = dietPlan?.macros?.fatG || 65;

    useEffect(() => {
        if (profile?._id) {
            import('../services/api')
                .then(({ getMealLogsApi }) => getMealLogsApi(profile._id))
                .then((data) => {
                    if (data?.totals) {
                        setTodayTotals(data.totals);
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [profile?._id]);

    const remainingCalories = Math.max(0, targetCalories - todayTotals.calories);

    const proteinPct = Math.min(100, Math.round((todayTotals.proteinG / targetProtein) * 100));
    const carbsPct = Math.min(100, Math.round((todayTotals.carbsG / targetCarbs) * 100));
    const fatPct = Math.min(100, Math.round((todayTotals.fatG / targetFat) * 100));

    return (
        <Card className="space-y-4 border-surface-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold">
                        <Apple className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-xs text-text-main">Nutrition & Macro Budget</h3>
                        <p className="text-[11px] text-text-muted">Real-time daily caloric budget & macro telemetry</p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('diet')}
                >
                    Log Food <ArrowRight className="w-3.5 h-3.5 text-accent" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Main Calorie Dial */}
                <div className="bg-bg/80 border border-surface-border rounded-lg p-4 text-center space-y-1">
                    <span className="text-[10px] font-semibold text-text-muted uppercase block">REMAINING CALORIES</span>
                    <span className="font-mono font-bold text-2xl text-accent num-tabular block">{remainingCalories.toLocaleString()}</span>
                    <div className="text-[11px] text-text-muted">
                        Target: <strong className="text-text-main font-mono">{targetCalories}</strong> kcal
                    </div>
                </div>

                {/* Macro Progress Bars */}
                <div className="md:col-span-3 space-y-3 bg-bg/80 border border-surface-border rounded-lg p-4">
                    {/* Protein */}
                    <div>
                        <div className="flex justify-between text-xs mb-1 font-sans">
                            <span className="font-semibold text-accent">PROTEIN ({todayTotals.proteinG}g / {targetProtein}g)</span>
                            <span className="text-text-muted font-mono">{proteinPct}%</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden border border-surface-border">
                            <div className="bg-accent h-full rounded-full transition-all duration-300" style={{ width: `${proteinPct}%` }} />
                        </div>
                    </div>

                    {/* Carbs */}
                    <div>
                        <div className="flex justify-between text-xs mb-1 font-sans">
                            <span className="font-semibold text-info">CARBOHYDRATES ({todayTotals.carbsG}g / {targetCarbs}g)</span>
                            <span className="text-text-muted font-mono">{carbsPct}%</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden border border-surface-border">
                            <div className="bg-info h-full rounded-full transition-all duration-300" style={{ width: `${carbsPct}%` }} />
                        </div>
                    </div>

                    {/* Fats */}
                    <div>
                        <div className="flex justify-between text-xs mb-1 font-sans">
                            <span className="font-semibold text-warning">FATS ({todayTotals.fatG}g / {targetFat}g)</span>
                            <span className="text-text-muted font-mono">{fatPct}%</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden border border-surface-border">
                            <div className="bg-warning h-full rounded-full transition-all duration-300" style={{ width: `${fatPct}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
