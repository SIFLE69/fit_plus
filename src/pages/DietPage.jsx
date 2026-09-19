import React, { useState } from 'react';
import { Flame, Apple, RefreshCw, HeartPulse, AlertTriangle, Utensils, ShoppingBag, Droplet, Check, BookOpen, ChevronDown, ChevronRight, PlusCircle } from 'lucide-react';
import { updateProfile, swapMealRecipeApi, logMealApi, generateDietPlan } from '../services/api';
import RecipeExplorer from '../components/RecipeExplorer';
import DailyMealTracker from '../components/DailyMealTracker';

export default function DietPage({ profile, dietPlan, onRefreshData }) {
    const [activeSubTab, setActiveSubTab] = useState('meals');
    const [swappingMealId, setSwappingMealId] = useState(null);
    const [checkedIngredients, setCheckedIngredients] = useState({});
    const [checkedGrocery, setCheckedGrocery] = useState({});
    const [waterCups, setWaterCups] = useState(4);
    const [recalculating, setRecalculating] = useState(false);
    const [trackerKey, setTrackerKey] = useState(0);
    const [loggedPlannedMeals, setLoggedPlannedMeals] = useState({});
    const [expandedMeals, setExpandedMeals] = useState({});

    const handleGenerateDiet = async () => {
        if (!profile?._id) return;
        setRecalculating(true);
        try {
            await generateDietPlan(profile._id);
            await onRefreshData();
        } catch (err) {
            console.error('Failed to generate diet plan:', err);
        } finally {
            setRecalculating(false);
        }
    };

    if (!dietPlan || !dietPlan.macros) {
        return (
            <div className="bg-surface border border-border rounded-lg p-10 text-center">
                <Apple className="w-8 h-8 text-text-disabled mx-auto mb-3" strokeWidth={1} />
                <h3 className="font-semibold text-base text-text-main">No Diet Plan Generated</h3>
                <p className="text-xs text-text-muted mt-1 mb-4">Click below to generate a custom nutrition & macro plan.</p>
                <button
                    onClick={handleGenerateDiet}
                    disabled={recalculating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-semibold rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                    {recalculating ? 'Generating Plan...' : 'Generate Diet Plan'}
                </button>
            </div>
        );
    }

    const { bmr, tdee, macros, diseaseGuidance = [], allergyPrecautions = [], meals = [], groceryList = [] } = dietPlan;
    const pPct = Math.round(((macros.proteinG * 4) / macros.calories) * 100);
    const cPct = Math.round(((macros.carbsG * 4) / macros.calories) * 100);
    const fPct = Math.round(((macros.fatG * 9) / macros.calories) * 100);

    const handleGoalChange = async (newGoal) => {
        if (!profile?._id || profile.goal === newGoal) return;
        setRecalculating(true);
        await updateProfile(profile._id, { goal: newGoal });
        await onRefreshData();
        setRecalculating(false);
    };

    const handleSwapMeal = async (mealId) => {
        if (!profile?._id) return;
        setSwappingMealId(mealId);
        await swapMealRecipeApi(profile._id, mealId);
        await onRefreshData();
        setSwappingMealId(null);
    };

    const toggleIngredient = (id) => setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
    const toggleGrocery = (key) => setCheckedGrocery((prev) => ({ ...prev, [key]: !prev[key] }));
    const toggleMealExpand = (id) => setExpandedMeals((prev) => ({ ...prev, [id]: !prev[id] }));

    const handleLogPlannedMeal = async (meal) => {
        if (!profile?._id) return;
        try {
            await logMealApi(profile._id, {
                mealType: meal.name, name: meal.title,
                calories: meal.calories, proteinG: meal.proteinG,
                carbsG: meal.carbsG, fatG: meal.fatG,
                fiberG: Math.max(5, Math.round(meal.calories / 70)),
            });
            setLoggedPlannedMeals((prev) => ({ ...prev, [meal.id]: true }));
            setTrackerKey((prev) => prev + 1);
        } catch (err) { console.error(err); }
    };

    const TABS = [
        { id: 'meals', label: 'Meal Plan', icon: Utensils },
        { id: 'tracker', label: 'Food Log', icon: PlusCircle },
        { id: 'micros', label: 'Micronutrients', icon: Flame },
        { id: 'recipes', label: 'Recipes', icon: BookOpen },
        { id: 'grocery', label: 'Grocery', icon: ShoppingBag },
        { id: 'medical', label: 'Medical', icon: HeartPulse },
    ];

    return (
        <div className="space-y-5">

            {/* ── Top Header Row ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-text-main">Diet Plan</h1>
                    <p className="text-xs text-text-muted mt-0.5">
                        {profile?.goal?.toUpperCase() || 'CUT'} phase · {macros.calories.toLocaleString()} kcal / day
                    </p>
                </div>
                {/* Phase switcher */}
                <div className="flex items-center gap-1 bg-surface p-1 rounded-lg self-start sm:self-auto">
                    {['cut', 'maintain', 'bulk'].map((g) => (
                        <button
                            key={g}
                            disabled={recalculating}
                            onClick={() => handleGoalChange(g)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition-all ${profile?.goal === g
                                ? 'bg-accent text-bg font-bold'
                                : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Macro Summary Bar (compact) ── */}
            <div className="bg-surface rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Calorie hero */}
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-mono font-bold text-3xl text-accent">{macros.calories.toLocaleString()}</span>
                        <span className="text-xs text-text-muted uppercase">kcal / day</span>
                    </div>
                    {/* BMR / TDEE row */}
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span>BMR: <strong className="text-text-main font-mono">{bmr}</strong></span>
                        <span>TDEE: <strong className="text-text-main font-mono">{tdee}</strong></span>
                    </div>
                </div>

                {/* Stacked macro bar with 3 always-distinct colors (Blue, Green, Amber) */}
                <div className="h-3 w-full bg-bg rounded-full overflow-hidden flex border border-border/50">
                    <div style={{ width: `${pPct}%` }} className="bg-[#3B82F6] h-full transition-all" title={`Protein ${pPct}% (${macros.proteinG}g)`} />
                    <div style={{ width: `${cPct}%` }} className="bg-[#10B981] h-full transition-all" title={`Carbs ${cPct}% (${macros.carbsG}g)`} />
                    <div style={{ width: `${fPct}%` }} className="bg-[#F59E0B] h-full transition-all" title={`Fats ${fPct}% (${macros.fatG}g)`} />
                </div>

                {/* 3 macro tiles */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'PROTEIN', val: `${macros.proteinG}g`, pct: pPct, color: 'text-[#3B82F6]' },
                        { label: 'CARBS', val: `${macros.carbsG}g`, pct: cPct, color: 'text-[#10B981]' },
                        { label: 'FATS', val: `${macros.fatG}g`, pct: fPct, color: 'text-[#F59E0B]' },
                    ].map((m) => (
                        <div key={m.label} className="bg-bg border border-border/40 rounded-lg p-2.5 text-center">
                            <span className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider">{m.label}</span>
                            <span className={`block font-mono font-bold text-lg ${m.color} my-0.5`}>{m.val}</span>
                            <span className="block text-[10px] text-text-muted font-mono">{m.pct}%</span>
                        </div>
                    ))}
                </div>

                {/* Water tracker */}
                <div className="flex items-center justify-between pt-2 border-t border-surface-hover">
                    <div className="flex items-center gap-2">
                        <Droplet className="w-3.5 h-3.5 text-info fill-info/20 shrink-0" />
                        <span className="text-xs font-semibold text-text-main">Hydration</span>
                        <span className="text-[11px] text-text-muted">{waterCups}/8 cups</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((cup) => (
                            <button
                                key={cup}
                                onClick={() => setWaterCups(cup === waterCups ? cup - 1 : cup)}
                                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${cup <= waterCups ? 'bg-info text-bg' : 'bg-surface text-text-muted hover:bg-surface-hover'
                                    }`}
                            >{cup}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Sub-Navigation ── */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-3">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSubTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${isActive
                                ? 'bg-accent/15 text-accent font-bold'
                                : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ── TAB: Daily Food Log ── */}
            {activeSubTab === 'tracker' && (
                <DailyMealTracker
                    key={trackerKey}
                    profile={profile}
                    dietPlan={dietPlan}
                    onMealLogged={() => setTrackerKey((k) => k + 1)}
                />
            )}

            {/* ── TAB: Meal Plan ── */}
            {activeSubTab === 'meals' && (
                <div className="space-y-5">
                    <DailyMealTracker
                        key={trackerKey}
                        profile={profile}
                        dietPlan={dietPlan}
                        onMealLogged={() => setTrackerKey((k) => k + 1)}
                    />

                    <div className="bg-surface rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-surface-hover">
                            <h3 className="font-semibold text-xs text-text-main uppercase tracking-wide">Daily Meal Structure</h3>
                        </div>
                        <div className="divide-y divide-surface-hover">
                            {meals.map((meal) => {
                                const isExpanded = Boolean(expandedMeals[meal.id]);
                                const isLogged = Boolean(loggedPlannedMeals[meal.id]);
                                const isSwappingThis = swappingMealId === meal.id;
                                return (
                                    <div key={meal.id}>
                                        {/* Compact row — always visible */}
                                        <div
                                            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-hover transition-colors"
                                            onClick={() => toggleMealExpand(meal.id)}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                                                    <Utensils className="w-3.5 h-3.5 text-accent" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-text-main truncate">{meal.title}</span>
                                                        {isLogged && <span className="text-[10px] text-success font-semibold bg-success/15 px-1.5 py-0.5 rounded">Logged</span>}
                                                    </div>
                                                    <span className="text-[11px] text-text-muted">{meal.name} · {meal.time}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 ml-2">
                                                <div className="text-right">
                                                    <span className="block text-xs font-mono font-bold text-text-main">{meal.calories} kcal</span>
                                                    <span className="block text-[10px] text-text-muted font-mono">P:{meal.proteinG}g C:{meal.carbsG}g F:{meal.fatG}g</span>
                                                </div>
                                                {isExpanded ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
                                            </div>
                                        </div>

                                        {/* Expanded detail — ingredients + actions */}
                                        {isExpanded && (
                                            <div className="px-4 pb-4 bg-bg/60 border-t border-surface-hover space-y-3">
                                                <ul className="space-y-1.5 pt-3 text-xs text-text-muted">
                                                    {meal.ingredients.map((ing, idx) => {
                                                        const ingKey = `${meal.id}_ing_${idx}`;
                                                        const isDone = Boolean(checkedIngredients[ingKey]);
                                                        return (
                                                            <li
                                                                key={idx}
                                                                onClick={() => toggleIngredient(ingKey)}
                                                                className={`flex items-start gap-2 cursor-pointer transition-colors ${isDone ? 'line-through opacity-40' : 'hover:text-text-main'}`}
                                                            >
                                                                <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center transition-all ${isDone ? 'bg-accent text-bg' : 'bg-surface'}`}>
                                                                    {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                                                                </div>
                                                                <span>{ing}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                                <div className="flex items-center gap-2 pt-1">
                                                    <button
                                                        onClick={() => handleLogPlannedMeal(meal)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${isLogged
                                                            ? 'bg-success text-bg'
                                                            : 'bg-accent text-bg hover:bg-accent-hover'
                                                            }`}
                                                    >
                                                        <PlusCircle className="w-3.5 h-3.5" />
                                                        {isLogged ? 'Logged' : 'Log Intake'}
                                                    </button>
                                                    <button
                                                        disabled={isSwappingThis}
                                                        onClick={() => handleSwapMeal(meal.id)}
                                                        className="px-3 py-1.5 bg-surface text-text-muted hover:text-accent rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <RefreshCw className={`w-3.5 h-3.5 ${isSwappingThis ? 'animate-spin text-accent' : ''}`} />
                                                        {isSwappingThis ? 'Swapping...' : 'Swap Recipe'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── TAB: Micronutrients ── */}
            {activeSubTab === 'micros' && (
                <div className="bg-surface rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-surface-hover">
                        <h3 className="font-semibold text-xs text-text-main uppercase tracking-wide">Micronutrient Targets</h3>
                    </div>
                    <div className="divide-y divide-surface-hover">
                        {[
                            { label: 'Hydration', val: `${dietPlan?.micros?.waterL || 3.0} L`, color: 'text-info' },
                            { label: 'Dietary Fiber', val: `${macros.fiberG || 32} g`, color: 'text-success' },
                            { label: 'Vitamin D3', val: `${dietPlan?.micros?.vitaminD_IU || 2000} IU`, color: 'text-accent' },
                            { label: 'Vitamin C', val: `${dietPlan?.micros?.vitaminC_mg || 90} mg`, color: 'text-accent' },
                            { label: 'Calcium', val: `${dietPlan?.micros?.calcium_mg || 1000} mg`, color: 'text-info' },
                            { label: 'Iron (Fe)', val: `${dietPlan?.micros?.iron_mg || 18} mg`, color: 'text-danger' },
                            { label: 'Potassium', val: `${dietPlan?.micros?.potassium_mg || 3500} mg`, color: 'text-success' },
                            { label: 'Magnesium', val: `${dietPlan?.micros?.magnesium_mg || 400} mg`, color: 'text-accent' },
                            { label: 'Zinc', val: `${dietPlan?.micros?.zinc_mg || 11} mg`, color: 'text-info' },
                        ].map((m) => (
                            <div key={m.label} className="flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors">
                                <span className="text-xs font-semibold text-text-main">{m.label}</span>
                                <span className={`font-mono font-bold text-xs ${m.color}`}>{m.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TAB: Recipes ── */}
            {activeSubTab === 'recipes' && <RecipeExplorer profile={profile} />}

            {/* ── TAB: Grocery List ── */}
            {activeSubTab === 'grocery' && (
                <div className="bg-surface rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-surface-hover">
                        <h3 className="font-semibold text-xs text-text-main uppercase tracking-wide">Grocery List</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-x divide-y divide-surface-hover">
                        {groceryList.map((cat, idx) => (
                            <div key={idx} className="p-4 space-y-2">
                                <span className="font-semibold text-xs text-accent uppercase block">{cat.category}</span>
                                <ul className="space-y-1.5">
                                    {cat.items.map((item, iIdx) => {
                                        const itemKey = `g_${idx}_${iIdx}`;
                                        const isChecked = Boolean(checkedGrocery[itemKey]);
                                        return (
                                            <li
                                                key={iIdx}
                                                onClick={() => toggleGrocery(itemKey)}
                                                className={`flex items-start gap-2 text-xs cursor-pointer transition-all ${isChecked ? 'line-through opacity-40 text-text-muted' : 'text-text-main hover:text-accent'}`}
                                            >
                                                <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center transition-all ${isChecked ? 'bg-accent text-bg' : 'bg-surface'}`}>
                                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                                </div>
                                                {item}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TAB: Medical ── */}
            {activeSubTab === 'medical' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-hover">
                            <HeartPulse className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs font-semibold text-text-main uppercase">Clinical Protocols</span>
                        </div>
                        <div className="divide-y divide-surface-hover">
                            {diseaseGuidance.length === 0 ? (
                                <p className="text-xs text-text-muted px-4 py-4">No medical conditions selected in profile.</p>
                            ) : (
                                diseaseGuidance.map((g, idx) => (
                                    <div key={idx} className="px-4 py-3">
                                        <span className="block text-xs font-semibold text-text-main uppercase">{g.condition}</span>
                                        <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{g.advice}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-hover">
                            <AlertTriangle className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs font-semibold text-accent uppercase">Allergy Safeguards</span>
                        </div>
                        <div className="divide-y divide-surface-hover">
                            {allergyPrecautions.length === 0 ? (
                                <p className="text-xs text-text-muted px-4 py-4">No food allergies recorded in profile.</p>
                            ) : (
                                allergyPrecautions.map((p, idx) => (
                                    <div key={idx} className="px-4 py-3 text-xs text-accent leading-relaxed">{p}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
