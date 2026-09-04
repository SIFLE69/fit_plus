import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingDown, Scale, Plus, Check } from 'lucide-react';

export default function ProgressChart({ logs = [], onAddLog }) {
    const [weightInput, setWeightInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format data for Recharts
    const chartData = logs
        .filter((l) => l.weightKg !== undefined && l.weightKg !== null)
        .map((l) => ({
            date: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            weight: Number(l.weightKg),
        }));

    const latestWeight = chartData.length > 0 ? chartData[chartData.length - 1].weight : null;
    const initialWeight = chartData.length > 0 ? chartData[0].weight : null;
    const weightChange = latestWeight && initialWeight ? (latestWeight - initialWeight).toFixed(1) : 0;

    const handleSubmitLog = async (e) => {
        e.preventDefault();
        if (!weightInput || isNaN(weightInput)) return;

        setIsSubmitting(true);
        await onAddLog({
            weightKg: Number(weightInput),
            date: new Date(),
        });
        setWeightInput('');
        setIsSubmitting(false);
    };

    return (
        <div className="bg-surface border border-surface-border rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
            {/* Header & Quick Stat */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-accent" />
                        <h3 className="font-display font-bold text-lg text-text-main">Weight Trajectory & Progress</h3>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">Track body composition changes over time.</p>
                </div>

                {latestWeight && (
                    <div className="flex items-center gap-3 bg-bg px-4 py-2 rounded-lg border border-surface-border">
                        <div>
                            <span className="text-[10px] text-text-muted font-display uppercase block">CURRENT</span>
                            <span className="font-display font-bold text-lg text-text-main num-tabular">{latestWeight} kg</span>
                        </div>
                        <div className="border-l border-surface-border pl-3">
                            <span className="text-[10px] text-text-muted font-display uppercase block">CHANGE</span>
                            <span className={`font-display font-bold text-sm num-tabular flex items-center ${weightChange <= 0 ? 'text-success' : 'text-warning'
                                }`}>
                                {weightChange <= 0 ? '' : '+'}{weightChange} kg
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Recharts Weight Chart */}
            <div className="h-64 w-full bg-bg border border-surface-border rounded-lg p-3 pt-6">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2E3238" vertical={false} />
                            <XAxis dataKey="date" stroke="#8B8D92" fontSize={11} tickLine={false} />
                            <YAxis domain={['auto', 'auto']} stroke="#8B8D92" fontSize={11} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1A1C1F',
                                    borderColor: '#2E3238',
                                    borderRadius: '8px',
                                    color: '#F2F1ED',
                                    fontSize: '12px',
                                    fontFamily: 'Space Grotesk',
                                }}
                                formatter={(value) => [`${value} kg`, 'Weight']}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#D6FF3F"
                                strokeWidth={3}
                                dot={{ fill: '#0E0F11', stroke: '#D6FF3F', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: '#D6FF3F' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted text-xs">
                        <Scale className="w-8 h-8 mb-2 opacity-40" />
                        <span>No weight entries recorded yet. Add your first check-in below!</span>
                    </div>
                )}
            </div>

            {/* Quick Check-in Weight Logger Form */}
            <form onSubmit={handleSubmitLog} className="bg-surface-hover/70 border border-surface-border rounded-lg p-4 flex items-center gap-3">
                <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">
                        Log Today's Body Weight (kg)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 78.5"
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        className="w-full bg-bg border border-surface-border rounded-lg px-3 py-2 text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-accent num-tabular font-display"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!weightInput || isSubmitting}
                    className="self-end px-4 py-2 bg-accent text-bg hover:bg-accent-hover disabled:opacity-50 font-display font-bold text-xs rounded-lg min-h-[42px] transition-colors flex items-center gap-1"
                >
                    {isSubmitting ? 'Saving...' : 'Log Weight'} <Plus className="w-3.5 h-3.5" />
                </button>
            </form>
        </div>
    );
}
