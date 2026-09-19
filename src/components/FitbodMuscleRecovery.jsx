import React from 'react';
import { Activity } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

export default function FitbodMuscleRecovery({ trainingStyle = 'strength', logs = [] }) {
    const muscleGroups = [
        { name: 'Chest & Push', recoveryPct: 95, status: 'Fresh', color: 'bg-success', target: 'Heavy Pressing' },
        { name: 'Back & Lats', recoveryPct: 88, status: 'Optimal', color: 'bg-success', target: 'Vertical Pulls' },
        { name: 'Quads & Glutes', recoveryPct: 62, status: 'Recovering', color: 'bg-warning', target: 'Sub-Maximal Load' },
        { name: 'Hamstrings & Posterior', recoveryPct: 75, status: 'Optimal', color: 'bg-success', target: 'Hinge Movement' },
        { name: 'Shoulders & Arms', recoveryPct: 90, status: 'Fresh', color: 'bg-success', target: 'Overhead Press' },
        { name: 'Core & Stabilizers', recoveryPct: 98, status: 'Primed', color: 'bg-accent', target: 'Anti-Rotational' },
    ];

    return (
        <Card className="space-y-4 border-surface-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold">
                        <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-xs text-text-main flex items-center gap-2">
                            Muscle Recovery Telemetry
                        </h3>
                        <p className="text-[11px] text-text-muted">
                            Algorithmic recovery readiness scaled to your <strong className="text-accent uppercase font-sans">{trainingStyle}</strong> split.
                        </p>
                    </div>
                </div>

                <Badge variant="accent" size="sm" className="self-start sm:self-auto">
                    HEATMAP ENGINE
                </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {muscleGroups.map((muscle, idx) => (
                    <div
                        key={idx}
                        className="bg-bg/80 border border-surface-border rounded-lg p-3 space-y-2 hover:border-accent/40 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-text-main">{muscle.name}</span>
                            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${muscle.recoveryPct >= 80
                                    ? 'bg-success/15 text-success border-success/30'
                                    : 'bg-warning/15 text-warning border-warning/30'
                                }`}>
                                {muscle.recoveryPct}% {muscle.status}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden border border-surface-border">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${muscle.color}`}
                                style={{ width: `${muscle.recoveryPct}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-text-muted pt-0.5">
                            <span>Target Focus:</span>
                            <span className="font-semibold text-text-main">{muscle.target}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
