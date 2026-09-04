import React from 'react';
import { X, AlertTriangle, ShieldCheck, Dumbbell, Youtube } from 'lucide-react';
import ExerciseAnimation from './ExerciseAnimations';

export default function ExerciseDetailModal({ exercise, onClose }) {
    if (!exercise) return null;

    const { name, category, muscleGroup, equipment, benefit, warning, youtubeId, animationType } = exercise;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-surface border border-surface-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-hover">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-display uppercase tracking-wider px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                            {category} • {muscleGroup}
                        </span>
                        <span className="text-xs text-text-muted capitalize">({equipment})</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-text-muted hover:text-text-main rounded-lg hover:bg-surface-border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 overflow-y-auto space-y-5">
                    {/* 1. CSS Keyframe Motion Loop */}
                    <div>
                        <div className="text-[11px] text-text-muted font-display uppercase mb-1 flex items-center gap-1">
                            <Dumbbell className="w-3.5 h-3.5 text-accent" /> Technique Movement Demo
                        </div>
                        <ExerciseAnimation type={animationType || 'generic'} />
                    </div>

                    {/* 2. Exercise Title */}
                    <div>
                        <h2 className="text-2xl font-display font-bold text-text-main">{name}</h2>
                    </div>

                    {/* 3. Benefit (1-2 lines) */}
                    <div className="bg-bg border border-surface-border rounded-lg p-3.5">
                        <div className="text-xs font-bold text-accent font-display uppercase mb-1 flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4" /> Primary Benefit
                        </div>
                        <p className="text-sm text-text-main leading-relaxed">{benefit}</p>
                    </div>

                    {/* 4. Warning (Visually distinct with --warning token) */}
                    <div className="bg-warning-bg border border-warning-border rounded-lg p-3.5">
                        <div className="text-xs font-bold text-warning font-display uppercase mb-1 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-warning" /> Safety Caution & Form Warning
                        </div>
                        <p className="text-sm text-warning leading-relaxed">{warning}</p>
                    </div>

                    {/* 5. Embedded YouTube Video */}
                    {youtubeId && (
                        <div>
                            <div className="text-xs font-semibold text-text-muted uppercase mb-2 flex items-center gap-1">
                                <Youtube className="w-4 h-4 text-red-500" /> Video Execution Demo
                            </div>
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-surface-border bg-bg">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                                    title={`${name} Exercise Video`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-surface-border bg-surface-hover flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-accent text-bg font-display font-bold text-sm hover:bg-accent-hover min-h-[44px] transition-colors"
                    >
                        Close Detail
                    </button>
                </div>
            </div>
        </div>
    );
}
