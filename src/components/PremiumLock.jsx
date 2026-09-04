import React from 'react';
import { Lock, Crown } from 'lucide-react';

export default function PremiumLock({ isPremium, children, title = 'Pro Feature', onUpgradeClick }) {
    if (isPremium) {
        return <>{children}</>;
    }

    return (
        <div className="relative rounded-xl overflow-hidden border border-surface-border bg-surface/50 group">
            {/* Blurred background preview */}
            <div className="blur-sm opacity-30 pointer-events-none select-none p-4">
                {children}
            </div>

            {/* Premium Lock Banner Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-bg/75 backdrop-blur-[2px] text-center z-10">
                <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mb-2">
                    <Lock className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-display font-bold text-sm text-text-main flex items-center gap-1.5">
                    {title} <span className="bg-accent text-bg text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">PRO</span>
                </h4>
                <p className="text-xs text-text-muted mt-1 mb-3 max-w-xs">
                    Unlock AI daily coaching tips and advanced training metrics.
                </p>
                <button
                    onClick={onUpgradeClick}
                    className="px-4 py-2 bg-accent text-bg hover:bg-accent-hover font-display font-bold text-xs rounded-lg min-h-[40px] flex items-center gap-1.5 transition-colors"
                >
                    <Crown className="w-3.5 h-3.5" /> Unlock Pro Access
                </button>
            </div>
        </div>
    );
}
