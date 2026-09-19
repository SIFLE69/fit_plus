import React from 'react';

export default function Badge({
    children,
    variant = 'accent',
    size = 'sm',
    icon: Icon,
    className = '',
}) {
    const variants = {
        accent: 'bg-accent/15 text-accent border-accent/30',
        easy: 'bg-success/15 text-success border-success/30',
        medium: 'bg-warning/15 text-warning border-warning/30',
        hard: 'bg-danger/15 text-danger border-danger/30',
        success: 'bg-success/15 text-success border-success/30',
        warning: 'bg-warning/15 text-warning border-warning/30',
        danger: 'bg-danger/15 text-danger border-danger/30',
        info: 'bg-info/15 text-info border-info/30',
        muted: 'bg-surface-hover text-text-muted border-surface-border',
    };

    const sizes = {
        sm: 'text-[11px] px-2 py-0.5 font-semibold tracking-wide',
        md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    };

    return (
        <span className={`inline-flex items-center gap-1 rounded border font-sans ${variants[variant] || variants.accent} ${sizes[size]} ${className}`}>
            {Icon && <Icon className="w-3 h-3 shrink-0" />}
            {children}
        </span>
    );
}
