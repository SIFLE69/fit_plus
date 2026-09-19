import React from 'react';
import { Dumbbell, Crown, RefreshCw, Apple, Pill, TrendingUp, LayoutDashboard, Terminal, Settings, User, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, profile, onResetSession, onOpenSettings }) {
    const navItems = [
        { id: 'dashboard', label: 'Home' },
        { id: 'diet', label: 'Nutrition' },
        { id: 'workout', label: 'Workouts' },
        { id: 'meds', label: 'Meds' },
        { id: 'progress', label: 'Analytics' },
        { id: 'profile', label: 'Profile' },
        { id: 'pricing', label: profile?.isPremium ? '✦ Pro' : 'Upgrade' },
    ];

    return (
        <header className="sticky top-0 z-40 bg-bg border-b border-border">
            <div className="max-w-5xl mx-auto px-5 h-12 flex items-center justify-between gap-4">

                {/* Brand */}
                <div
                    className="flex items-center gap-2 cursor-pointer shrink-0"
                    onClick={() => setActiveTab('dashboard')}
                >
                    <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                        <Terminal className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                    </div>
                    <span className="font-semibold text-sm text-text-main tracking-tight">
                        FitCode
                    </span>
                </div>

                {/* Desktop nav — Notion-style plain text links */}
                <nav className="hidden md:flex items-center gap-0.5 flex-1">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`px-3 py-1.5 text-sm rounded transition-colors duration-100 ${isActive
                                    ? 'bg-surface-hover text-text-main font-medium'
                                    : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                                    }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Right: User + actions */}
                <div className="flex items-center gap-1 shrink-0">
                    {profile && (
                        <button
                            onClick={() => setActiveTab('profile')}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-surface-hover transition-colors text-sm text-text-secondary"
                        >
                            <div className="w-5 h-5 rounded-full bg-accent text-white font-semibold text-[10px] flex items-center justify-center shrink-0">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <span className="font-medium text-text-main max-w-[100px] truncate text-xs">
                                {profile.name}
                            </span>
                            {profile.isPremium && (
                                <span className="text-[10px] font-bold text-accent bg-accent-light px-1.5 py-0.5 rounded">PRO</span>
                            )}
                        </button>
                    )}

                    <button
                        onClick={onOpenSettings}
                        aria-label="Settings"
                        className="p-1.5 text-text-muted hover:text-text-main hover:bg-surface-hover rounded transition-colors"
                    >
                        <Settings className="w-4 h-4" strokeWidth={1.5} />
                    </button>

                    <button
                        onClick={onResetSession}
                        aria-label="Sign out"
                        title="Sign out"
                        className="p-1.5 text-text-muted hover:text-danger hover:bg-danger-bg rounded transition-colors"
                    >
                        <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </header>
    );
}
