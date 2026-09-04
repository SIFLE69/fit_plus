import React from 'react';
import { Dumbbell, Crown, RefreshCw, UserCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, profile, onResetSession }) {
    return (
        <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-surface-border">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-accent flex items-center justify-center text-bg font-display font-bold text-xl">
                        F
                    </div>
                    <div>
                        <span className="font-display font-bold text-lg text-text-main tracking-tight">FITPLAN</span>
                        <span className="hidden sm:inline-block ml-2 text-xs text-text-muted px-2 py-0.5 bg-surface rounded border border-surface-border">
                            ATHLETIC OS v1.0
                        </span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1 bg-surface p-1 rounded-lg border border-surface-border">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${activeTab === 'dashboard' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('workout')}
                        className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${activeTab === 'workout' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        Workout Plan
                    </button>
                    <button
                        onClick={() => setActiveTab('progress')}
                        className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${activeTab === 'progress' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        Progress & Badges
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`px-4 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${activeTab === 'pricing' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        <Crown className="w-3.5 h-3.5" />
                        {profile?.isPremium ? 'Pro Member' : 'Pricing'}
                    </button>
                </nav>

                {/* User Profile Quick Action & Reset */}
                <div className="flex items-center gap-3">
                    {profile && (
                        <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-surface-border text-xs">
                            <UserCheck className="w-4 h-4 text-accent" />
                            <span className="font-medium text-text-main">{profile.name}</span>
                            {profile.isPremium && (
                                <span className="bg-accent/15 text-accent text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                                    PRO
                                </span>
                            )}
                        </div>
                    )}
                    <button
                        onClick={onResetSession}
                        title="Reset Session / New Onboarding"
                        className="p-2 text-text-muted hover:text-warning hover:bg-warning/10 rounded-lg transition-colors border border-transparent hover:border-warning/30"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
