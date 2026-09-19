import React from 'react';

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = '',
}) {
    return (
        <div className={`bg-surface/50 border border-surface-border rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 ${className}`}>
            {Icon && (
                <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-center text-text-muted mb-1">
                    <Icon className="w-6 h-6" />
                </div>
            )}
            <h3 className="font-display font-bold text-base sm:text-lg text-text-main">{title}</h3>
            {description && (
                <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-2 px-4 py-2 bg-accent text-bg hover:bg-accent-hover font-display font-bold text-xs rounded-xl transition-all shadow-accent-glow"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
