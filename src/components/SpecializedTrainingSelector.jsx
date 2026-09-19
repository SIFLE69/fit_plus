import React, { useState } from 'react';
import { Dumbbell, Activity, Flame, Zap, Shield, Crown, RefreshCw, Check, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { updateProfile } from '../services/api';

export const TRAINING_STYLES = [
    {
        id: 'calisthenics',
        title: 'Calisthenics & Bodyweight',
        icon: Zap,
        badge: 'Zero Equipment / Bodyweight Mastery',
        color: 'from-sky-400/20 to-blue-400/20 text-sky-600 border-sky-400/30',
        activeBorder: 'border-sky-400',
        tagBg: 'bg-sky-400/15 text-sky-600',
        equipmentNeeded: 'Bodyweight, Pull-Up Bar, Dip Station',
        description: 'Progressive bodyweight leverage, pull-up/dip density, core levers & kinetic balance. Build upper body width and core power anywhere.',
        benefits: ['High core stabilization & scapular control', 'Joint-friendly functional mobility', 'Can be performed anywhere without gym weights'],
        repProtocol: '8–15 Reps (Controlled Eccentric Tempo)',
        splitOverview: 'Push & Core • Pull & Back • Lower Body Pistols • Dynamic Body Control',
    },
    {
        id: 'gym',
        title: 'Gym & Weightlifting',
        icon: Dumbbell,
        badge: 'Hypertrophy & Muscle Building',
        color: 'from-green-400/20 to-sky-400/20 text-green-600 border-green-400/30',
        activeBorder: 'border-green-400',
        tagBg: 'bg-green-400/15 text-green-600',
        equipmentNeeded: 'Barbell, Dumbbell, Cables, Gym Machines',
        description: 'High-mechanical tension compound and machine movements engineered for progressive overload and maximal muscle hypertrophy.',
        benefits: ['Targeted muscle isolation & sarcoplasmic hypertrophy', 'High stability from dedicated machines', 'Precise progressive weight tracking'],
        repProtocol: '8–12 Reps (3-4 Sets Hypertrophy Window)',
        splitOverview: 'Chest & Tri • Back & Bi • Quads & Hamstrings • Shoulders & Abs',
    },
    {
        id: 'cardio',
        title: 'Cardio & HIIT Endurance',
        icon: Activity,
        badge: 'Aerobic Base & Fat Oxidation',
        color: 'from-green-300/20 to-sky-300/20 text-green-600 border-green-300/30',
        activeBorder: 'border-green-300',
        tagBg: 'bg-green-300/15 text-green-600',
        equipmentNeeded: 'Bodyweight, Track, Treadmill, Jump Rope',
        description: 'Zone 2 aerobic base conditioning combined with Zone 5 High-Intensity Interval Sprints for elevated VO2 Max and mitochondrial efficiency.',
        benefits: ['Enhanced cardiovascular stroke volume', 'Rapid calorie & fat burn', 'Active recovery & stamina booster'],
        repProtocol: '15–25 min Interval Windows / Zone 2 & 5',
        splitOverview: 'HIIT Interval Sprint • Steady Aerobic Endurance • Active Core Recovery',
    },
    {
        id: 'hybrid',
        title: 'Hybrid Athletic Conditioning',
        icon: Flame,
        badge: 'Strength + Metcon Capacity',
        color: 'from-sky-500/20 to-green-500/20 text-sky-600 border-sky-500/30',
        activeBorder: 'border-sky-500',
        tagBg: 'bg-sky-500/15 text-sky-600',
        equipmentNeeded: 'Barbell, Kettlebell, Bodyweight, Turf',
        description: 'Combines heavy resistance compound strength splits with high-output metabolic conditioning circuits (Metcon) for elite physical capacity.',
        benefits: ['Dual strength and aerobic power development', 'High athletic work capacity', 'Diverse non-monotonous workout rotation'],
        repProtocol: 'Strength 6-8 Reps + Metcon Timed Rounds',
        splitOverview: 'Resistance Split • Zone 4 High-Output • Core Athleticism • Metcon Capacity',
    },
    {
        id: 'functional',
        title: 'Functional Fitness & Core',
        icon: Shield,
        badge: 'Agility, Balance & Posture',
        color: 'from-sky-300/20 to-green-400/20 text-sky-600 border-sky-300/30',
        activeBorder: 'border-sky-300',
        tagBg: 'bg-sky-300/15 text-sky-600',
        equipmentNeeded: 'Kettlebells, Resistance Bands, Dumbbells, Mat',
        description: 'Focuses on real-world multi-planar movement patterns, kinetic chain connectivity, rotational stability, and joint resilience.',
        benefits: ['Postural correction & anti-rotational core control', 'Injury prevention & hip/shoulder mobility', 'Athletic agility across 3 movement planes'],
        repProtocol: '12–15 Reps (Time Under Tension Focus)',
        splitOverview: 'Athletic Movement • Multi-Planar Agility • Kettlebell Power • Kinetic Stamina',
    },
    {
        id: 'strength',
        title: 'Power Strength (5x5)',
        icon: Crown,
        badge: 'Maximal Force & Neural Drive',
        color: 'from-blue-400/20 to-sky-400/20 text-blue-600 border-blue-400/30',
        activeBorder: 'border-blue-400',
        tagBg: 'bg-blue-400/15 text-blue-600',
        equipmentNeeded: 'Heavy Barbell, Squat Rack, Bench Press',
        description: 'Low-rep, heavy load compound powerlifting focus on the big 4: Squat, Deadlift, Bench Press, and Overhead Press for pure strength.',
        benefits: ['Maximal motor unit recruitment & bone density', 'Rapid raw compound strength gains', 'Pure strength foundation'],
        repProtocol: '5 Sets × 5 Reps (80-85% 1RM)',
        splitOverview: 'Push Power • Pull Density • Leg Strength • Full Body Heavy Compound',
    },
    {
        id: 'mix',
        title: 'Mixed All-Rounder',
        icon: RefreshCw,
        badge: 'Balanced All-around Protocol',
        color: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30',
        activeBorder: 'border-sky-400',
        tagBg: 'bg-sky-500/15 text-sky-400',
        equipmentNeeded: 'Gym & Bodyweight Equipment',
        description: 'Comprehensive 5-day athletic rotation mixing strength hypertrophy, HIIT cardio, and mobility circuits for complete physical fitness.',
        benefits: ['Zero plateauing through varied stimulus', 'Balanced upper, lower & cardio development', 'Great for all fitness levels'],
        repProtocol: 'Varied 8–15 Reps',
        splitOverview: 'Upper Body Hypertrophy • HIIT Sprint • Lower Power • Zone 2 Cardio • Functional Circuit',
    },
];

export default function SpecializedTrainingSelector({ profile, onRefreshData }) {
    const currentStyleId = profile?.trainingStyle || 'gym';
    const [updatingStyle, setUpdatingStyle] = useState(null);
    const [msg, setMsg] = useState('');

    const currentStyleObj = TRAINING_STYLES.find((s) => s.id === currentStyleId) || TRAINING_STYLES[1];

    const handleSelectStyle = async (styleId) => {
        if (styleId === currentStyleId) return;
        setUpdatingStyle(styleId);
        setMsg('');

        try {
            await updateProfile(profile._id, { trainingStyle: styleId });
            await onRefreshData();
            setMsg(`Switched to ${TRAINING_STYLES.find((s) => s.id === styleId)?.title}! Workout split regenerated.`);
        } catch (err) {
            console.error('Failed to update training style:', err);
            setMsg('Failed to update training style. Please try again.');
        } finally {
            setUpdatingStyle(null);
        }
    };

    return (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <h3 className="font-semibold text-xs text-text-main uppercase tracking-wider">Training Disciplines</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-text-muted">Active Protocol:</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${currentStyleObj.tagBg}`}>
                        {currentStyleObj.title}
                    </span>
                </div>
            </div>

            {msg && (
                <div className="p-3 bg-accent/15 border border-accent/40 rounded-lg text-accent text-xs font-semibold flex items-center justify-between animate-fadeIn">
                    <span>{msg}</span>
                    <button onClick={() => setMsg('')} className="text-xs font-bold hover:underline ml-2">Dismiss</button>
                </div>
            )}

            {/* Specialized Training Styles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {TRAINING_STYLES.map((style) => {
                    const Icon = style.icon;
                    const isActive = style.id === currentStyleId;
                    const isLoadingThis = updatingStyle === style.id;

                    return (
                        <div
                            key={style.id}
                            onClick={() => handleSelectStyle(style.id)}
                            className={`group relative rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${isActive
                                ? `bg-surface-hover ${style.activeBorder} shadow-lg ring-1 ring-accent/30`
                                : 'bg-bg/60 border-surface-border hover:border-surface-hover hover:bg-surface/50'
                                }`}
                        >
                            {/* Top Badge */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center bg-gradient-to-br ${style.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    {isActive ? (
                                        <span className="text-[10px] font-display font-bold bg-accent text-bg px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                                            <Check className="w-3 h-3" /> ACTIVE
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-text-muted font-display uppercase tracking-wider group-hover:text-text-main transition-colors">
                                            Tap to Select
                                        </span>
                                    )}
                                </div>

                                <h4 className="font-display font-bold text-sm text-text-main group-hover:text-accent transition-colors">
                                    {style.title}
                                </h4>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded inline-block mt-1 font-display ${style.tagBg}`}>
                                    {style.badge}
                                </span>

                                <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
                                    {style.description}
                                </p>
                            </div>

                            {/* Card Footer info */}
                            <div className="mt-4 pt-3 border-t border-surface-border/50 text-[11px] text-text-muted flex items-center justify-between">
                                <span className="truncate">{style.equipmentNeeded.split(',')[0]}</span>
                                <span className="font-display font-bold text-accent group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                    {isLoadingThis ? 'Building...' : isActive ? 'Selected' : 'Switch Split'} <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Protocol Deep Dive Box */}
            <div className={`bg-gradient-to-r ${currentStyleObj.color} border rounded-xl p-5 space-y-3`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/30 pb-2">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-accent" />
                        <h4 className="font-display font-bold text-sm text-text-main">
                            Active Discipline Overview: <span className="text-accent">{currentStyleObj.title}</span>
                        </h4>
                    </div>
                    <span className="text-xs text-text-muted">Target Reps: <strong className="text-text-main font-display">{currentStyleObj.repProtocol}</strong></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                        <span className="font-display font-bold text-text-muted uppercase text-[10px] block mb-1">Key Discipline Benefits</span>
                        <ul className="space-y-1 text-text-main">
                            {currentStyleObj.benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <span className="font-display font-bold text-text-muted uppercase text-[10px] block mb-1">Generated Split Structure</span>
                        <p className="text-text-main font-display bg-bg/50 p-2.5 rounded border border-surface-border/40 text-xs">
                            {currentStyleObj.splitOverview}
                        </p>
                        <span className="text-[10px] text-text-muted mt-1 block">
                            Equipment required: <strong className="text-text-main">{currentStyleObj.equipmentNeeded}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
