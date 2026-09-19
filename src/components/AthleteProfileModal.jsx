import React, { useState } from 'react';
import { X, UserCheck, Save, Check, ShieldAlert, Trophy, Flame, Target, Medal, Star, Zap } from 'lucide-react';
import { updateProfile } from '../services/api';
import Button from './ui/Button';
import Badge from './ui/Badge';

export default function AthleteProfileModal({ profile, isOpen, onClose, onRefreshData, badges = [], logs = [] }) {
    if (!isOpen || !profile) return null;

    const [name, setName] = useState(profile.name || '');
    const [age, setAge] = useState(profile.age || 26);
    const [weightKg, setWeightKg] = useState(profile.weightKg || 75);
    const [heightCm, setHeightCm] = useState(profile.heightCm || 175);
    const [goal, setGoal] = useState(profile.goal || 'cut');
    const [trainingStyle, setTrainingStyle] = useState(profile.trainingStyle || 'strength');
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg('');
        try {
            await updateProfile(profile._id, {
                name,
                age: Number(age),
                weightKg: Number(weightKg),
                heightCm: Number(heightCm),
                goal,
                trainingStyle,
            });
            setSuccessMsg('Athlete profile updated successfully.');
            await onRefreshData();
            setTimeout(() => {
                setSuccessMsg('');
                onClose();
            }, 1000);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-bg/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-surface border border-surface-border rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-card space-y-5 relative my-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold">
                            <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-text-main">Athlete Profile & Settings</h2>
                            <p className="text-[11px] text-text-muted">Personalization & Training Preferences</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 text-text-muted hover:text-text-main hover:bg-surface-hover rounded-md transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {successMsg && (
                    <div className="p-2.5 bg-success/15 border border-success/30 rounded-lg text-success text-xs font-semibold flex items-center gap-2">
                        <Check className="w-3.5 h-3.5" /> {successMsg}
                    </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                    {/* Basic Info */}
                    <div className="space-y-2.5">
                        <h4 className="font-semibold text-xs text-accent uppercase tracking-wider">
                            1. Personal Metrics
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Athlete Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-bg border border-surface-border rounded-lg px-3 py-1.5 text-text-main text-xs focus:outline-none focus:border-accent"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Age (Years)</label>
                                <input
                                    type="number"
                                    required
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full bg-bg border border-surface-border rounded-lg px-3 py-1.5 text-text-main text-xs focus:outline-none focus:border-accent font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    required
                                    step="0.5"
                                    value={weightKg}
                                    onChange={(e) => setWeightKg(e.target.value)}
                                    className="w-full bg-bg border border-surface-border rounded-lg px-3 py-1.5 text-text-main text-xs focus:outline-none focus:border-accent font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    required
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                    className="w-full bg-bg border border-surface-border rounded-lg px-3 py-1.5 text-text-main text-xs focus:outline-none focus:border-accent font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Goal & Discipline */}
                    <div className="space-y-2.5 pt-3 border-t border-surface-border">
                        <h4 className="font-semibold text-xs text-accent uppercase tracking-wider">
                            2. Goal & Discipline
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Primary Goal</label>
                                <select
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    className="w-full bg-bg border border-surface-border rounded-lg px-3 py-1.5 text-text-main text-xs focus:outline-none focus:border-accent capitalize"
                                >
                                    <option value="cut">Fat Loss & Cut</option>
                                    <option value="bulk">Hypertrophy & Bulk</option>
                                    <option value="maintain">Body Recomposition</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1">Training Discipline</label>
                                <select
                                    value={trainingStyle}
                                    onChange={(e) => setTrainingStyle(e.target.value)}
                                    className="w-full bg-bg border border-surface-border rounded-lg px-3 py-1.5 text-text-main text-xs focus:outline-none focus:border-accent capitalize"
                                >
                                    <option value="strength">Gym & Weightlifting</option>
                                    <option value="calisthenics">Calisthenics & Bodyweight</option>
                                    <option value="cardio">Cardio & HIIT Endurance</option>
                                    <option value="hybrid">Hybrid Conditioning</option>
                                    <option value="functional">Functional & Core</option>
                                    <option value="powerlifting">Power Strength (5x5)</option>
                                    <option value="mixed">Mixed All-Rounder</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Active Safeguards Overview */}
                    <div className="space-y-1.5 pt-3 border-t border-surface-border">
                        <h4 className="font-semibold text-xs text-text-muted uppercase tracking-wider">
                            Active Medical Restrictions
                        </h4>

                        <div className="flex flex-wrap items-center gap-1.5">
                            {profile.conditions?.length > 0 ? (
                                profile.conditions.map((c, i) => (
                                    <Badge key={i} variant="warning" icon={ShieldAlert}>
                                        {c}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-xs text-text-muted">No medical condition restrictions logged.</span>
                            )}
                        </div>
                    </div>

                    {/* Badges & Achievements */}
                    <div className="space-y-2.5 pt-3 border-t border-surface-border">
                        <h4 className="font-semibold text-xs text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-accent" /> Achievements & Badges
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'First Workout', icon: Zap, earned: logs.some(l => l.workoutDayCompleted) },
                                { label: '5-Day Streak', icon: Flame, earned: logs.filter(l => l.workoutDayCompleted).length >= 5 },
                                { label: 'Goal Setter', icon: Target, earned: !!profile?.goal },
                                { label: 'Consistent', icon: Star, earned: logs.filter(l => l.workoutDayCompleted).length >= 10 },
                                { label: 'First Month', icon: Medal, earned: logs.length >= 20 },
                                ...badges.map(b => ({ label: b.name || b.label, icon: Trophy, earned: true })),
                            ].slice(0, 6).map((b, i) => (
                                <div key={i} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-center transition-all ${b.earned ? 'border-accent/30 bg-accent/10' : 'border-surface-border bg-bg opacity-40'
                                    }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${b.earned ? 'bg-accent/20 border border-accent/30' : 'bg-surface-border/30'
                                        }`}>
                                        <b.icon className={`w-4 h-4 ${b.earned ? 'text-accent' : 'text-text-muted'}`} />
                                    </div>
                                    <span className="text-[10px] font-semibold text-text-muted leading-tight">{b.label}</span>
                                    {b.earned && <span className="text-[9px] text-success font-mono">EARNED</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-3 border-t border-surface-border flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" isLoading={saving}>
                            <Save className="w-3.5 h-3.5" /> Save Preferences
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
