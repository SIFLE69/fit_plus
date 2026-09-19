import React, { useState, useEffect } from 'react';
import { Search, Clock, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Utensils, HeartPulse, Flame } from 'lucide-react';
import { getRecommendedRecipes } from '../services/api';

export default function RecipeExplorer({ profile }) {
    const [recipes, setRecipes] = useState([]);
    const [mealFilter, setMealFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedRecipeId, setExpandedRecipeId] = useState(null);

    const fetchRecipes = async (type = mealFilter) => {
        setLoading(true);
        try {
            const data = await getRecommendedRecipes(profile?._id, type);
            setRecipes(data);
        } catch (err) {
            console.error('Error fetching recipes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes(mealFilter);
    }, [profile?._id, mealFilter]);

    const filteredRecipes = recipes.filter((r) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            r.name.toLowerCase().includes(q) ||
            (r.tags && r.tags.some((t) => t.toLowerCase().includes(q))) ||
            (r.ingredients && r.ingredients.some((i) => i.toLowerCase().includes(q)))
        );
    });

    return (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-3">
                <div>
                    <h3 className="font-semibold text-xs text-text-main uppercase tracking-wider">
                        Personalized Recipe Library
                    </h3>
                </div>

                {/* Search Input */}
                <div className="relative min-w-[240px]">
                    <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search recipes..."
                        className="w-full bg-bg border border-border rounded-md pl-9 pr-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent transition-colors"
                    />
                </div>
            </div>

            {/* Category Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                    { id: '', label: 'All' },
                    { id: 'breakfast', label: 'Breakfast' },
                    { id: 'lunch', label: 'Lunch' },
                    { id: 'dinner', label: 'Dinner' },
                    { id: 'snack', label: 'Snacks' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setMealFilter(tab.id)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap border ${mealFilter === tab.id
                            ? 'border-accent bg-accent/10 text-accent font-bold'
                            : 'border-border bg-bg text-text-muted hover:text-text-main hover:bg-surface-hover'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Recipes Cards Grid */}
            {loading ? (
                <div className="text-center py-12 text-xs text-text-muted">Loading recommendations...</div>
            ) : filteredRecipes.length === 0 ? (
                <div className="text-center py-12 text-xs text-text-muted">No recipes found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRecipes.map((rec) => {
                        const isExpanded = expandedRecipeId === rec.id;
                        return (
                            <div
                                key={rec.id}
                                className="group bg-bg/70 hover:bg-surface-hover/80 border border-surface-border/60 hover:border-accent/40 rounded-xl p-5 transition-all space-y-4 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className="text-[10px] font-display font-bold text-accent uppercase tracking-wider px-2.5 py-0.5 bg-accent/10 rounded-full inline-block mb-1.5">
                                                {rec.mealType || 'RECIPE'}
                                            </span>
                                            <h4 className="font-display font-bold text-base text-text-main group-hover:text-accent transition-colors">
                                                {rec.name}
                                            </h4>
                                        </div>

                                        {rec.prepTime && (
                                            <span className="text-xs text-text-muted font-display flex items-center gap-1 shrink-0 bg-surface px-2.5 py-1 rounded-lg border border-surface-border/50">
                                                <Clock className="w-3.5 h-3.5 text-accent" /> {rec.prepTime}
                                            </span>
                                        )}
                                    </div>

                                    {/* Clean Macro Pill Strip */}
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-border/40 text-xs">
                                        <span className="font-display font-extrabold text-accent flex items-center gap-1">
                                            <Flame className="w-3.5 h-3.5" /> {rec.calories} kcal
                                        </span>
                                        <span className="text-text-muted">•</span>
                                        <span className="text-text-main font-semibold">P: {rec.proteinG}g</span>
                                        <span className="text-text-muted">•</span>
                                        <span className="text-text-muted">C: {rec.carbsG}g</span>
                                        <span className="text-text-muted">•</span>
                                        <span className="text-text-muted">F: {rec.fatG}g</span>
                                    </div>

                                    {/* Expanded Recipe Ingredients & Steps */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-surface-border/60 space-y-3 text-xs animate-fadeIn">
                                            <div>
                                                <span className="font-display font-bold text-accent block mb-1.5 uppercase tracking-wider text-[10px]">
                                                    Ingredients Required
                                                </span>
                                                <ul className="grid grid-cols-1 gap-1 text-text-muted">
                                                    {rec.ingredients?.map((ing, i) => (
                                                        <li key={i} className="flex items-center gap-2 bg-surface/50 px-2.5 py-1 rounded border border-surface-border/40">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                            <span>{ing}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {rec.instructions && (
                                                <div>
                                                    <span className="font-display font-bold text-accent block mb-1 uppercase tracking-wider text-[10px]">
                                                        Preparation Method
                                                    </span>
                                                    <p className="text-text-muted leading-relaxed bg-surface/40 p-3 rounded-lg border border-surface-border/40">
                                                        {rec.instructions}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Action */}
                                <div className="pt-3 border-t border-surface-border/40 flex items-center justify-between">
                                    <span className="text-[11px] text-success font-semibold flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-success" /> Allergy Safe
                                    </span>
                                    <button
                                        onClick={() => setExpandedRecipeId(isExpanded ? null : rec.id)}
                                        className="text-xs font-display font-bold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
                                    >
                                        <span>{isExpanded ? 'Close Details' : 'View Preparation'}</span>
                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
