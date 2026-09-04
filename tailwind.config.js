/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#0E0F11',
                surface: {
                    DEFAULT: '#1A1C1F',
                    hover: '#25282D',
                    border: '#2E3238',
                    light: '#24272C'
                },
                text: {
                    main: '#F2F1ED',
                    muted: '#8B8D92',
                },
                accent: {
                    DEFAULT: '#D6FF3F',
                    hover: '#BCE82B',
                    dark: '#1D2405',
                },
                warning: {
                    DEFAULT: '#FF6B4A',
                    bg: '#2A1814',
                    border: '#4A2118',
                },
                success: {
                    DEFAULT: '#4ADE80',
                    bg: '#14291D',
                }
            },
            fontFamily: {
                display: ['Space Grotesk', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
