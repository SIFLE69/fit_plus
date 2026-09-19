import React from 'react';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    ariaLabel,
    onClick,
    type = 'button',
    ...props
}) {
    const base = 'inline-flex items-center justify-center font-semibold transition-colors duration-150 rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none border';

    const variants = {
        primary: 'bg-accent text-white border-accent hover:bg-accent-hover hover:border-accent-hover',
        secondary: 'bg-surface-2 text-text-main border-border hover:bg-surface-hover',
        outline: 'bg-transparent text-text-secondary border-border hover:text-text-main hover:bg-surface-hover',
        ghost: 'bg-transparent text-text-muted border-transparent hover:text-text-main hover:bg-surface-hover',
        danger: 'bg-danger-bg text-danger border-danger-border hover:bg-danger/20',
        success: 'bg-success-bg text-success border-success-border hover:bg-success/20',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[30px]',
        md: 'px-4 py-2 text-sm gap-2 min-h-[36px]',
        lg: 'px-5 py-2.5 text-sm gap-2 min-h-[42px]',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-label={ariaLabel}
            aria-busy={isLoading}
            className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {isLoading && (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            {children}
        </button>
    );
}
