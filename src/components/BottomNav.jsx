import React from 'react';
import { LayoutDashboard, Dumbbell, TrendingUp, Crown, UserCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, isPremium }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'workout', label: 'Workout', icon: Dumbbell },
        { id: 'progress', label: 'Progress', icon: TrendingUp },
        { id: 'pricing', label: isPremium ? 'Pro Active' : 'Upgrade', icon: Crown, isCrown: true },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-surface-border md:hidden">
            <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] transition-colors ${isActive ? 'text-accent font-semibold' : 'text-text-muted hover:text-text-main'
                                }`}
                        >
                            <div className="relative">
                                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                                {item.isCrown && isPremium && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
                                )}
                            </div>
                            <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
