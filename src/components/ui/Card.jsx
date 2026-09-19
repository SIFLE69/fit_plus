import React from 'react';

export default function Card({
    children,
    className = '',
    hoverable = false,
    onClick,
    borderAccent = false,
    ...props
}) {
    return (
        <div
            onClick={onClick}
            className={`bg-surface border border-surface-border rounded-xl p-4 sm:p-5 transition-all duration-150 ${borderAccent ? 'border-accent/40 shadow-accent-glow' : ''
                } ${hoverable ? 'hover:bg-surface-hover hover:border-surface-border/90 cursor-pointer' : ''
                } ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
