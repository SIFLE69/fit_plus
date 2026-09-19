import React from 'react';
import { Dumbbell } from 'lucide-react';

/**
 * Exercise Name Display Component.
 * Displays exercise name cleanly without any GIF animations.
 */
export default function ExerciseAnimation({ name }) {
    return (
        <div className="w-full bg-surface/80 rounded-xl p-4 border border-surface-border flex items-center gap-3">
            <Dumbbell className="w-5 h-5 text-accent shrink-0" />
            <span className="font-display font-bold text-lg text-text-main">{name || 'Exercise'}</span>
        </div>
    );
}

