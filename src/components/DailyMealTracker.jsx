import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Flame, Utensils, Sparkles, Check, ChevronDown, ChevronUp, PieChart } from 'lucide-react';
import { logMealApi, getMealLogsApi, deleteMealLogApi } from '../services/api';

export default function DailyMealTracker({ profile, dietPlan, onMealLogged }) {
    const [todayLogs, setTodayLogs] = useState([]);
    const [totals, setTotals] = useState({
        calories: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        fiberG: 0,
        micros: {
            vitaminD_IU: 0,
            vitaminC_mg: 0,
            calcium_mg: 0,
            iron_mg: 0,
            potassium_mg: 0,
            magnesium_mg: 0,
            sodium_mg: 0,
            zinc_mg: 0,
        }
    });
    const [loading, setLoading] = useState(true);
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [showMicrosBreakdown, setShowMicrosBreakdown] = useState(false);

    // Custom meal form state
    const [customMeal, setCustomMeal] = useState({
        name: '',
        mealType: 'Snack',
        calories: '',
        proteinG: '',
        carbsG: '',
        fatG: '',
        fiberG: '',
    });

    const targetMacros = dietPlan?.macros || { calories: 2200, proteinG: 160, carbsG: 220, fatG: 65, fiberG: 30 };
    const targetMicros = dietPlan?.micros || {
        vitaminD_IU: 2000,
        vitaminC_mg: 90,
        calcium_mg: 1000,
        iron_mg: 18,
        potassium_mg: 3500,
        magnesium_mg: 400,
        sodiumMax_mg: 2000,
        zinc_mg: 11,
    };

    const fetchTodayLogs = async () => {
        if (!profile?._id) return;
        try {
            setLoading(true);
            const data = await getMealLogsApi(profile._id);
            setTodayLogs(data.meals || []);
            if (data.totals) setTotals(data.totals);
        } catch (err) {
            console.error('Failed to fetch meal logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayLogs();
    }, [profile?._id]);

    const handleAddCustomMeal = async (e) => {
        e.preventDefault();
        if (!customMeal.name || !customMeal.calories) return;

        try {
            await logMealApi(profile._id, {
                mealType: customMeal.mealType,
                name: customMeal.name,
                calories: Number(customMeal.calories) || 0,
                proteinG: Number(customMeal.proteinG) || 0,
                carbsG: Number(customMeal.carbsG) || 0,
                fatG: Number(customMeal.fatG) || 0,
                fiberG: Number(customMeal.fiberG) || 0,
            });

            setCustomMeal({
                name: '',
                mealType: 'Snack',
                calories: '',
                proteinG: '',
                carbsG: '',
                fatG: '',
                fiberG: '',
            });
            setShowCustomForm(false);
            await fetchTodayLogs();
            if (onMealLogged) onMealLogged();
        } catch (err) {
            console.error('Error logging custom meal:', err);
        }
    };

    const handleQuickPreset = async (preset) => {
        try {
            await logMealApi(profile._id, preset);
            await fetchTodayLogs();
            if (onMealLogged) onMealLogged();
        } catch (err) {
            console.error('Error logging preset meal:', err);
        }
    };

    const handleDeleteLog = async (logId) => {
        try {
            await deleteMealLogApi(profile._id, logId);
            await fetchTodayLogs();
            if (onMealLogged) onMealLogged();
        } catch (err) {
            console.error('Error deleting meal log:', err);
        }
    };

    // Calculate percentage progress vs target
    const calPct = Math.min(100, Math.round((totals.calories / targetMacros.calories) * 100)) || 0;
    const pPct = Math.min(100, Math.round((totals.proteinG / targetMacros.proteinG) * 100)) || 0;
    const cPct = Math.min(100, Math.round((totals.carbsG / targetMacros.carbsG) * 100)) || 0;
    const fPct = Math.min(100, Math.round((totals.fatG / targetMacros.fatG) * 100)) || 0;
    const fibPct = Math.min(100, Math.round((totals.fiberG / (targetMacros.fiberG || 30)) * 100)) || 0;

    return (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-accent" />
                    <h3 className="font-semibold text-xs text-text-main uppercase tracking-wider">Daily Food Tracker</h3>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowCustomForm(!showCustomForm)}
                        className="px-3 py-1.5 bg-accent text-bg hover:bg-accent-hover rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Log Custom Food
                    </button>
                </div>
            </div>

            {/* Form for logging custom meal */}
            {showCustomForm && (
                <form onSubmit={handleAddCustomMeal} className="bg-bg border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-main uppercase tracking-wider">Log Custom Food Item</span>
                        <button
                            type="button"
                            onClick={() => setShowCustomForm(false)}
                            className="text-xs text-text-muted hover:text-text-main"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                            <label className="block text-[11px] text-text-muted mb-1">Food / Meal Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Grilled Chicken & Rice Bowl"
                                value={customMeal.name}
                                onChange={(e) => setCustomMeal({ ...customMeal, name: e.target.value })}
                                className="w-full bg-surface border border-surface-border rounded-lg p-2.5 text-text-main focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] text-text-muted mb-1">Meal Slot</label>
                            <select
                                value={customMeal.mealType}
                                onChange={(e) => setCustomMeal({ ...customMeal, mealType: e.target.value })}
                                className="w-full bg-surface border border-surface-border rounded-lg p-2.5 text-text-main focus:outline-none focus:border-accent"
                            >
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snack">Snack / Post-Workout</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <div>
                            <label className="block text-[10px] text-text-muted mb-1">Calories (kcal) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="450"
                                value={customMeal.calories}
                                onChange={(e) => setCustomMeal({ ...customMeal, calories: e.target.value })}
                                className="w-full bg-surface border border-surface-border rounded-lg p-2 text-text-main focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] text-text-muted mb-1">Protein (g)</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="35"
                                value={customMeal.proteinG}
                                onChange={(e) => setCustomMeal({ ...customMeal, proteinG: e.target.value })}
                                className="w-full bg-surface border border-surface-border rounded-lg p-2 text-text-main focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] text-text-muted mb-1">Carbs (g)</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="40"
                                value={customMeal.carbsG}
                                onChange={(e) => setCustomMeal({ ...customMeal, carbsG: e.target.value })}
                                className="w-full bg-surface border border-surface-border rounded-lg p-2 text-text-main focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] text-text-muted mb-1">Fats (g)</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="12"
                                value={customMeal.fatG}
                                onChange={(e) => setCustomMeal({ ...customMeal, fatG: e.target.value })}
                                className="w-full bg-surface border border-surface-border rounded-lg p-2 text-text-main focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] text-text-muted mb-1">Fiber (g)</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="6"
                                value={customMeal.fiberG}
                                onChange={(e) => setCustomMeal({ ...customMeal, fiberG: e.target.value })}
                                className="w-full bg-surface border border-surface-border rounded-lg p-2 text-text-main focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 bg-accent text-bg font-display font-bold text-xs rounded-lg hover:bg-accent-hover transition-colors"
                    >
                        Save & Log Intake Entry
                    </button>
                </form>
            )}

            {/* Quick Preset Buttons */}
            <div className="space-y-2">
                <span className="text-[10px] font-display font-bold text-text-muted uppercase tracking-wider block">
                    Quick Log Popular Snacks & Supplements
                </span>
                <div className="flex flex-wrap gap-2">
                    {[
                        { name: 'Scoop Whey Protein Powder', mealType: 'Snack', calories: 120, proteinG: 24, carbsG: 3, fatG: 1.5, fiberG: 0 },
                        { name: 'Greek Yogurt & Honey Bowl', mealType: 'Breakfast', calories: 210, proteinG: 18, carbsG: 22, fatG: 4, fiberG: 1 },
                        { name: 'Handful Almonds & Banana', mealType: 'Snack', calories: 230, proteinG: 6, carbsG: 29, fatG: 11, fiberG: 4 },
                        { name: 'Boiled Eggs (2 Eggs)', mealType: 'Snack', calories: 150, proteinG: 12, carbsG: 1, fatG: 10, fiberG: 0 },
                    ].map((preset, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleQuickPreset(preset)}
                            className="px-3 py-1.5 bg-bg/80 hover:bg-surface border border-surface-border/60 rounded-lg text-xs text-text-main hover:border-accent/50 flex items-center gap-1.5 transition-all"
                        >
                            <Plus className="w-3 h-3 text-accent" />
                            <span>{preset.name}</span>
                            <span className="text-[10px] text-text-muted">({preset.calories} kcal)</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Bars vs Daily Targets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Calories Progress Card */}
                <div className="bg-bg/80 border border-surface-border/60 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold text-text-main uppercase flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-accent" /> Total Daily Calorie Intake
                        </span>
                        <span className="text-xs font-display font-extrabold text-accent num-tabular">
                            {totals.calories.toLocaleString()} / {targetMacros.calories.toLocaleString()} kcal ({calPct}%)
                        </span>
                    </div>
                    <div className="h-3 w-full bg-surface rounded-full overflow-hidden border border-surface-border/40">
                        <div
                            className="h-full bg-accent transition-all duration-500"
                            style={{ width: `${calPct}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted">
                        <span>Remaining: <strong className="text-text-main font-display">{Math.max(0, targetMacros.calories - totals.calories)} kcal</strong></span>
                        <span>Phase: {profile?.goal?.toUpperCase() || 'CUT'}</span>
                    </div>
                </div>

                {/* Macro Progress Breakdown */}
                <div className="bg-bg/80 border border-surface-border/60 rounded-xl p-4 space-y-3">
                    <span className="text-xs font-display font-bold text-text-main uppercase block">
                        Macronutrient Target Progress
                    </span>

                    <div className="space-y-2 text-xs">
                        {/* Protein */}
                        <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                                <span>Protein: <strong className="text-[#3B82F6]">{totals.proteinG}g</strong> / {targetMacros.proteinG}g</span>
                                <span className="text-text-muted">{pPct}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                <div className="h-full bg-[#3B82F6]" style={{ width: `${pPct}%` }} />
                            </div>
                        </div>

                        {/* Carbs */}
                        <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                                <span>Carbs: <strong className="text-[#10B981]">{totals.carbsG}g</strong> / {targetMacros.carbsG}g</span>
                                <span className="text-text-muted">{cPct}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                <div className="h-full bg-[#10B981]" style={{ width: `${cPct}%` }} />
                            </div>
                        </div>

                        {/* Fat */}
                        <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                                <span>Fats: <strong className="text-[#F59E0B]">{totals.fatG}g</strong> / {targetMacros.fatG}g</span>
                                <span className="text-text-muted">{fPct}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                <div className="h-full bg-[#F59E0B]" style={{ width: `${fPct}%` }} />
                            </div>
                        </div>

                        {/* Fiber */}
                        <div>
                            <div className="flex justify-between text-[11px] mb-0.5">
                                <span>Fiber: <strong className="text-success">{totals.fiberG}g</strong> / {targetMacros.fiberG || 30}g</span>
                                <span className="text-text-muted">{fibPct}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                <div className="h-full bg-success" style={{ width: `${fibPct}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Micronutrient Breakdown Toggle */}
            <div className="bg-bg border border-border rounded-lg p-3.5 space-y-3">
                <div
                    onClick={() => setShowMicrosBreakdown(!showMicrosBreakdown)}
                    className="flex items-center justify-between cursor-pointer select-none"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-semibold text-text-main uppercase tracking-wider">
                            Micronutrient Breakdown
                        </span>
                    </div>
                    <button className="text-xs text-text-muted hover:text-text-main flex items-center gap-1">
                        {showMicrosBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                </div>

                {showMicrosBreakdown && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-surface-border/40 text-xs">
                        <div className="bg-surface/50 p-2.5 rounded-lg border border-surface-border/40">
                            <span className="text-[10px] text-text-muted block font-bold">VITAMIN C</span>
                            <span className="font-display font-bold text-text-main">{totals.micros?.vitaminC_mg || 0} / {targetMicros.vitaminC_mg} mg</span>
                        </div>

                        <div className="bg-surface/50 p-2.5 rounded-lg border border-surface-border/40">
                            <span className="text-[10px] text-text-muted block font-bold">CALCIUM</span>
                            <span className="font-display font-bold text-text-main">{totals.micros?.calcium_mg || 0} / {targetMicros.calcium_mg} mg</span>
                        </div>

                        <div className="bg-surface/50 p-2.5 rounded-lg border border-surface-border/40">
                            <span className="text-[10px] text-text-muted block font-bold">IRON</span>
                            <span className="font-display font-bold text-text-main">{totals.micros?.iron_mg || 0} / {targetMicros.iron_mg} mg</span>
                        </div>

                        <div className="bg-surface/50 p-2.5 rounded-lg border border-surface-border/40">
                            <span className="text-[10px] text-text-muted block font-bold">POTASSIUM</span>
                            <span className="font-display font-bold text-text-main">{totals.micros?.potassium_mg || 0} / {targetMicros.potassium_mg} mg</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Today's Logged Items List */}
            <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-bold text-text-main uppercase">
                        Today's Consumed Meals Log ({todayLogs.length})
                    </span>
                </div>

                {todayLogs.length === 0 ? (
                    <div className="bg-bg/40 border border-surface-border/40 rounded-xl p-6 text-center text-xs text-text-muted">
                        No meals logged yet today. Click <strong>"Log Custom Food"</strong> or use the <strong>"＋ Log Intake"</strong> button on your planned meals below.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {todayLogs.map((item) => (
                            <div
                                key={item._id}
                                className="bg-bg/70 border border-surface-border/60 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-display font-bold text-text-main">{item.name}</span>
                                        <span className="text-[10px] px-2 py-0.5 bg-accent/15 text-accent font-bold rounded-full uppercase">
                                            {item.mealType}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-text-muted mt-0.5">
                                        P: {item.proteinG}g • C: {item.carbsG}g • F: {item.fatG}g {item.fiberG > 0 ? `• Fiber: ${item.fiberG}g` : ''}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="font-display font-extrabold text-accent text-sm num-tabular">
                                        {item.calories} kcal
                                    </span>
                                    <button
                                        onClick={() => handleDeleteLog(item._id)}
                                        className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                        title="Remove Meal Entry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
