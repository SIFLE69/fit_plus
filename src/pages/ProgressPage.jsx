import React from 'react';
import ProgressChart from '../components/ProgressChart';
import PremiumLock from '../components/PremiumLock';
import { logDailyEntry } from '../services/api';
import { BarChart2, Sparkles } from 'lucide-react';

export default function ProgressPage({ profile, logs = [], badges = [], onRefreshData, onNavigate }) {
    const handleAddLog = async (logData) => {
        if (!profile?._id) return;
        await logDailyEntry(profile._id, logData);
        onRefreshData();
    };

    const weightKg = profile?.weightKg || 75;
    const estimatedBfp = profile?.gender === 'female' ? 22.5 : 14.2;
    const leanMassKg = (weightKg * (1 - estimatedBfp / 100)).toFixed(1);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-text-main">Progress & Analytics</h1>
                <p className="text-xs text-text-muted mt-0.5">Weight trajectory · Body composition · Volume analytics</p>
            </div>

            {/* Weight Chart */}
            <ProgressChart logs={logs} onAddLog={handleAddLog} />

            {/* Advanced Analytics */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-text-muted font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4 text-accent" /> Advanced Analytics
                    </span>
                </div>

                <PremiumLock
                    isPremium={profile?.isPremium}
                    title="Advanced Analytics"
                    onUpgradeClick={() => onNavigate && onNavigate('pricing')}
                >
                    <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="font-semibold text-xs text-text-main uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-accent" /> Body Composition & Volume Analytics
                            </h3>
                            <span className="px-2.5 py-0.5 bg-accent/10 border border-accent/20 rounded text-[10px] font-bold text-accent hidden sm:inline-block uppercase">
                                PRO
                            </span>
                        </div>

                        {/* Top Telemetry Stat Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-bg/80 border border-surface-border/60 rounded-xl p-4 text-center">
                                <span className="text-[10px] font-display font-bold text-text-muted uppercase block">ESTIMATED BODY FAT</span>
                                <span className="font-display font-extrabold text-2xl text-accent my-1 block num-tabular">{estimatedBfp}%</span>
                                <span className="text-[10px] text-text-muted">Athletic Range</span>
                            </div>

                            <div className="bg-bg/80 border border-surface-border/60 rounded-xl p-4 text-center">
                                <span className="text-[10px] font-display font-bold text-text-muted uppercase block">LEAN BODY MASS</span>
                                <span className="font-display font-extrabold text-2xl text-info my-1 block num-tabular">{leanMassKg} kg</span>
                                <span className="text-[10px] text-text-muted">Active Tissue</span>
                            </div>

                            <div className="bg-bg/80 border border-surface-border/60 rounded-xl p-4 text-center">
                                <span className="text-[10px] font-display font-bold text-text-muted uppercase block">WEEKLY VOLUME LOAD</span>
                                <span className="font-display font-extrabold text-2xl text-warning my-1 block num-tabular">18.4k kg</span>
                                <span className="text-[10px] text-text-muted">High Intensity</span>
                            </div>

                            <div className="bg-bg/80 border border-surface-border/60 rounded-xl p-4 text-center">
                                <span className="text-[10px] font-display font-bold text-text-muted uppercase block">RECOVERY READINESS</span>
                                <span className="font-display font-extrabold text-2xl text-success my-1 block num-tabular">94%</span>
                                <span className="text-[10px] text-text-muted">Optimal Recovery</span>
                            </div>
                        </div>

                        {/* Muscle Group Training Volume Distribution */}
                        <div className="bg-bg/60 border border-surface-border/60 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between text-xs font-display font-bold text-text-main uppercase">
                                <span>Weekly Training Volume Distribution by Muscle Group</span>
                                <span className="text-accent">{profile?.trainingStyle?.toUpperCase() || 'GYM'} PROTOCOL</span>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <div className="flex justify-between text-text-muted mb-1 font-display">
                                        <span>Push (Chest, Shoulders, Triceps)</span>
                                        <span className="text-text-main font-bold">16 Sets / Week (100%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                        <div className="h-full bg-accent rounded-full" style={{ width: '85%' }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-text-muted mb-1 font-display">
                                        <span>Pull (Back, Biceps, Rear Delts)</span>
                                        <span className="text-text-main font-bold">14 Sets / Week (90%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-400 rounded-full" style={{ width: '75%' }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-text-muted mb-1 font-display">
                                        <span>Legs (Quads, Hamstrings, Calves)</span>
                                        <span className="text-text-main font-bold">16 Sets / Week (100%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                        <div className="h-full bg-accent rounded-full" style={{ width: '85%' }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-text-muted mb-1 font-display">
                                        <span>Core & Functional Stability</span>
                                        <span className="text-text-main font-bold">10 Sets / Week (70%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                        <div className="h-full bg-success rounded-full" style={{ width: '60%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </PremiumLock>
            </div>
        </div>
    );
}

