import React from 'react';
import { Crown, Check, Zap, Sparkles, Lock, ShieldCheck } from 'lucide-react';

export default function PricingPage({ profile, onTogglePremium }) {
    const isPremium = profile?.isPremium || false;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-2">
            {/* Title */}
            <div className="text-center space-y-2">
                <span className="text-xs text-accent font-display font-bold uppercase tracking-wider px-3 py-1 bg-accent/10 border border-accent/20 rounded-full inline-block">
                    FLEXIBLE ATHLETE TIERS
                </span>
                <h2 className="text-3xl font-display font-extrabold text-text-main">Choose Your Training Protocol</h2>
                <p className="text-sm text-text-muted max-w-lg mx-auto">
                    Unlock high-output AI daily coach tips, deep progress metrics, and custom split adjustments.
                </p>
            </div>

            {/* Two Columns Side by Side on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Free Plan */}
                <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-display font-bold text-xl text-text-main">Basic Athlete</h3>
                                <p className="text-xs text-text-muted mt-0.5">Core macro calculation & workout split</p>
                            </div>
                            <span className="px-2.5 py-1 bg-bg border border-surface-border rounded text-xs font-display text-text-muted">
                                FREE
                            </span>
                        </div>

                        <div className="text-3xl font-display font-extrabold text-text-main my-4 num-tabular">
                            $0 <span className="text-xs font-normal text-text-muted">/ forever</span>
                        </div>

                        <ul className="space-y-3 text-xs text-text-muted pt-2 border-t border-surface-border">
                            <li className="flex items-center gap-2 text-text-main">
                                <Check className="w-4 h-4 text-accent" /> BMR & TDEE Macro Calculator
                            </li>
                            <li className="flex items-center gap-2 text-text-main">
                                <Check className="w-4 h-4 text-accent" /> Rule-based Workout Split Generator
                            </li>
                            <li className="flex items-center gap-2 text-text-main">
                                <Check className="w-4 h-4 text-accent" /> CSS Motion Technique Demos
                            </li>
                            <li className="flex items-center gap-2 opacity-50">
                                <Lock className="w-3.5 h-3.5" /> AI Tip of the Day (Locked)
                            </li>
                            <li className="flex items-center gap-2 opacity-50">
                                <Lock className="w-3.5 h-3.5" /> Priority Condition Filter Engine (Locked)
                            </li>
                        </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-surface-border">
                        <button
                            disabled={!isPremium}
                            onClick={() => isPremium && onTogglePremium(false)}
                            className={`w-full py-3 rounded-lg text-xs font-display font-bold min-h-[44px] transition-colors ${!isPremium
                                    ? 'bg-bg text-text-muted border border-surface-border cursor-default'
                                    : 'bg-surface-border text-text-main hover:bg-surface-hover'
                                }`}
                        >
                            {!isPremium ? 'Current Standard Plan' : 'Downgrade to Standard'}
                        </button>
                    </div>
                </div>

                {/* Premium Pro Plan (Highlighted with --accent border) */}
                <div className="bg-surface border-2 border-accent rounded-xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 bg-accent text-bg font-display font-extrabold text-[10px] px-3 py-1 uppercase rounded-bl">
                        MOST POPULAR
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-display font-bold text-xl text-text-main flex items-center gap-1.5">
                                    Pro Performance <Crown className="w-4 h-4 text-accent fill-accent" />
                                </h3>
                                <p className="text-xs text-text-muted mt-0.5">Unrestricted AI coaching & advanced telemetry</p>
                            </div>
                        </div>

                        <div className="text-3xl font-display font-extrabold text-accent my-4 num-tabular">
                            $9.99 <span className="text-xs font-normal text-text-muted">/ month (Dummy)</span>
                        </div>

                        <ul className="space-y-3 text-xs text-text-main pt-2 border-t border-surface-border">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" /> Everything in Basic Plan
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" /> <strong className="text-accent font-display">AI Coach Tip of the Day</strong>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" /> Advanced Muscle Condition Filters
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" /> Unlimited Routine Regeneration
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" /> Premium Pro Badge & Telemetry Dashboard
                            </li>
                        </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-surface-border">
                        <button
                            onClick={() => onTogglePremium(!isPremium)}
                            className={`w-full py-3 rounded-lg text-xs font-display font-bold min-h-[44px] transition-all flex items-center justify-center gap-2 ${isPremium
                                    ? 'bg-success/20 text-success border border-success/30 hover:bg-success/30'
                                    : 'bg-accent text-bg hover:bg-accent-hover shadow-lg'
                                }`}
                        >
                            {isPremium ? (
                                <>
                                    <ShieldCheck className="w-4 h-4" /> Active Pro Membership (Click to Toggle)
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" /> Activate Pro (Instant Toggle)
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
