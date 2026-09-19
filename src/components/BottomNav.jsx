import React from 'react';
import { LayoutDashboard, Apple, Dumbbell, Pill, TrendingUp, User, Crown } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, isPremium }) {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'diet', label: 'Diet', icon: Apple },
        { id: 'workout', label: 'Workout', icon: Dumbbell },
        { id: 'meds', label: 'Meds', icon: Pill },
        { id: 'progress', label: 'Analytics', icon: TrendingUp },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'pricing', label: isPremium ? 'Pro' : 'Pricing', icon: Crown },
    ];

    return (
        <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border md:hidden">
            <div className="flex items-center justify-around h-14 px-1 max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] transition-colors ${isActive ? 'text-accent' : 'text-text-muted hover:text-text-secondary'}`}
                        >
                            <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
