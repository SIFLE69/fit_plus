import React from 'react';

/**
 * Clean SVG-based CSS loop animations for exercise technique preview.
 * Lightweight, zero dependencies, responsive.
 */
export default function ExerciseAnimation({ type }) {
    switch (type) {
        case 'squat':
            return (
                <div className="w-full h-40 bg-surface rounded-lg flex items-center justify-center p-4 overflow-hidden border border-surface-border">
                    <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                        {/* Ground line */}
                        <line x1="10" y1="90" x2="90" y2="90" stroke="#8B8D92" strokeWidth="2" strokeDasharray="3 3" />

                        {/* Moving lifter group */}
                        <g className="anim-squat-body">
                            {/* Barbell */}
                            <line x1="20" y1="35" x2="80" y2="35" stroke="#D6FF3F" strokeWidth="4" strokeLinecap="round" />
                            <rect x="16" y="27" width="4" height="16" rx="1" fill="#D6FF3F" />
                            <rect x="80" y="27" width="4" height="16" rx="1" fill="#D6FF3F" />
                            {/* Head */}
                            <circle cx="50" cy="22" r="6" fill="#F2F1ED" />
                            {/* Torso */}
                            <line x1="50" y1="28" x2="50" y2="55" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                            {/* Legs */}
                            <polyline points="50,55 38,72 36,90" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="50,55 62,72 64,90" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    </svg>
                </div>
            );

        case 'pushup':
            return (
                <div className="w-full h-40 bg-surface rounded-lg flex items-center justify-center p-4 overflow-hidden border border-surface-border">
                    <svg width="140" height="100" viewBox="0 0 140 100" fill="none">
                        <line x1="10" y1="80" x2="130" y2="80" stroke="#8B8D92" strokeWidth="2" strokeDasharray="3 3" />
                        <g className="anim-pushup-body">
                            {/* Head */}
                            <circle cx="110" cy="40" r="6" fill="#F2F1ED" />
                            {/* Torso & Leg line */}
                            <line x1="30" y1="65" x2="110" y2="40" stroke="#F2F1ED" strokeWidth="5" strokeLinecap="round" />
                            {/* Arms */}
                            <polyline points="105,42 95,65 95,80" stroke="#D6FF3F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            {/* Feet */}
                            <circle cx="28" cy="78" r="3" fill="#8B8D92" />
                        </g>
                    </svg>
                </div>
            );

        case 'deadlift':
            return (
                <div className="w-full h-40 bg-surface rounded-lg flex items-center justify-center p-4 overflow-hidden border border-surface-border">
                    <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                        <line x1="10" y1="90" x2="90" y2="90" stroke="#8B8D92" strokeWidth="2" strokeDasharray="3 3" />
                        {/* Legs */}
                        <line x1="50" y1="65" x2="42" y2="90" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                        <line x1="50" y1="65" x2="58" y2="90" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                        {/* Hinging Torso */}
                        <g className="anim-deadlift-torso">
                            <line x1="50" y1="65" x2="50" y2="35" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                            <circle cx="50" cy="27" r="6" fill="#F2F1ED" />
                            {/* Barbell held in hands */}
                            <line x1="20" y1="65" x2="80" y2="65" stroke="#D6FF3F" strokeWidth="4" strokeLinecap="round" />
                            <circle cx="20" cy="65" r="7" fill="#D6FF3F" />
                            <circle cx="80" cy="65" r="7" fill="#D6FF3F" />
                        </g>
                    </svg>
                </div>
            );

        case 'bicep_curl':
            return (
                <div className="w-full h-40 bg-surface rounded-lg flex items-center justify-center p-4 overflow-hidden border border-surface-border">
                    <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
                        {/* Head */}
                        <circle cx="50" cy="20" r="7" fill="#F2F1ED" />
                        {/* Spine */}
                        <line x1="50" y1="27" x2="50" y2="65" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                        {/* Legs */}
                        <line x1="50" y1="65" x2="42" y2="105" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                        <line x1="50" y1="65" x2="58" y2="105" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                        {/* Upper Arm */}
                        <line x1="50" y1="35" x2="65" y2="50" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                        {/* Curving Forearm & Weight */}
                        <g className="anim-bicep-arm">
                            <line x1="65" y1="50" x2="65" y2="78" stroke="#D6FF3F" strokeWidth="4" strokeLinecap="round" />
                            <rect x="58" y="75" width="14" height="8" rx="2" fill="#D6FF3F" />
                        </g>
                    </svg>
                </div>
            );

        case 'jumping_jacks':
            return (
                <div className="w-full h-40 bg-surface rounded-lg flex items-center justify-center p-4 overflow-hidden border border-surface-border">
                    <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                        <g className="anim-jack">
                            <circle cx="50" cy="20" r="6" fill="#F2F1ED" />
                            <line x1="50" y1="26" x2="50" y2="55" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                            {/* Arms Out */}
                            <line x1="50" y1="32" x2="25" y2="18" stroke="#D6FF3F" strokeWidth="4" strokeLinecap="round" />
                            <line x1="50" y1="32" x2="75" y2="18" stroke="#D6FF3F" strokeWidth="4" strokeLinecap="round" />
                            {/* Legs Spread */}
                            <line x1="50" y1="55" x2="30" y2="85" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                            <line x1="50" y1="55" x2="70" y2="85" stroke="#F2F1ED" strokeWidth="4" strokeLinecap="round" />
                        </g>
                    </svg>
                </div>
            );

        default:
            return (
                <div className="w-full h-40 bg-surface rounded-lg flex items-center justify-center p-4 border border-surface-border">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                        <span className="text-xs text-text-muted font-display tracking-wide uppercase">Technique Motion Loop</span>
                    </div>
                </div>
            );
    }
}
