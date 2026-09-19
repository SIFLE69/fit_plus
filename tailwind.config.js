/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'monospace'],
            },
            colors: {
                bg: {
                    DEFAULT: 'var(--bg)',
                    secondary: 'var(--bg-secondary)',
                    tertiary: 'var(--bg-tertiary)',
                },
                surface: {
                    DEFAULT: 'var(--surface)',
                    '2': 'var(--surface-2)',
                    '3': 'var(--surface-3)',
                    hover: 'var(--surface-hover)',
                    elevated: 'var(--surface-elevated)',
                    border: 'var(--border)',
                },
                border: {
                    DEFAULT: 'var(--border)',
                    '2': 'var(--border-2)',
                },
                text: {
                    main: 'var(--text-main)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                    disabled: 'var(--text-disabled)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    hover: 'var(--accent-hover)',
                    light: 'var(--accent-light)',
                },
                success: {
                    DEFAULT: 'var(--success)',
                    bg: 'var(--success-bg)',
                    border: 'var(--success-border)',
                },
                warning: {
                    DEFAULT: 'var(--warning)',
                    bg: 'var(--warning-bg)',
                },
                danger: {
                    DEFAULT: 'var(--danger)',
                    bg: 'var(--danger-bg)',
                    border: 'var(--danger-border)',
                },
                info: {
                    DEFAULT: 'var(--info)',
                    bg: 'var(--info-bg)',
                    border: 'var(--info-border)',
                },
            },
            borderRadius: {
                sm: '4px',
                DEFAULT: '6px',
                md: '8px',
                lg: '10px',
                xl: '12px',
                '2xl': '16px',
            },
            boxShadow: {
                card: 'none',
                subtle: '0 1px 2px rgba(0,0,0,0.04)',
                modal: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
        },
    },
    plugins: [],
}
