import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Manrope', ...defaultTheme.fontFamily.sans],
                serif: ['Playfair Display', 'Fraunces', ...defaultTheme.fontFamily.serif],
                devanagari: ['Noto Serif Devanagari', 'Noto Sans Devanagari'],
            },
            colors: {
                // Brand color palette - Gold theme
                brand: {
                    50: '#FBF8F1',   // warm parchment
                    100: '#F6F0E0',
                    200: '#EDE0C2',
                    300: '#E3CF9A',
                    400: '#DDB974',  // dark mode primary
                    500: '#C99B3F',  // primary gold
                    600: '#B8883A',
                    700: '#9A7033',
                    800: '#7D5A2A',
                    900: '#654823',
                },
                // Accent color palette - Royal Purple
                accent: {
                    50: '#F3F0FF',
                    100: '#E9E4FF',
                    200: '#D6CCFF',
                    300: '#BBA9FF',
                    400: '#B58CE7',  // dark mode accent
                    500: '#8B5CF6',  // primary purple
                    600: '#7C3AED',
                    700: '#6D28D9',
                    800: '#5B21B6',
                    900: '#4C1D95',
                },
                // Neutral palette
                neutral: {
                    50: '#FAF9F7',   // background
                    100: '#F3F1ED',
                    200: '#E8E3DA',  // borders
                    300: '#D1C7B8',
                    400: '#B8B09E',
                    500: '#9A9084',
                    600: '#7D7266',
                    700: '#5C5144',  // text secondary
                    800: '#3D362F',  // dark surface
                    900: '#1F1B18',  // text primary / dark bg
                },
                // Status colors
                success: {
                    50: '#ECFDF5',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                },
                danger: {
                    50: '#FEF2F2',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                },
                warning: {
                    50: '#FFFBEB',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                },
                // Semantic tokens
                semantic: {
                    bg: 'var(--bg)',
                    surface: 'var(--surface)',
                    elevate: 'var(--elevate)',
                    primary: 'var(--primary)',
                    accent: 'var(--accent)',
                    text: 'var(--text)',
                    textSub: 'var(--text-sub)',
                    textMuted: 'var(--text-muted)',
                    border: 'var(--border)',
                    ring: 'var(--ring)',
                    success: '#059669',
                    danger: '#DC2626',
                    warning: '#D97706',
                    info: '#6D3DE3',
                }
            },
            spacing: {
                '18': '4.5rem',   // 72px
                '22': '5.5rem',   // 88px
            },
            borderRadius: {
                'arch': 'clamp(12px, 1.5vw, 20px)',
            },
            fontSize: {
                'display': ['clamp(32px, 4vw, 44px)', '1.15'],
                'heading': ['clamp(24px, 3vw, 32px)', '1.2'],
                'subheading': ['22px', '1.25'],
                'body-l': ['18px', '1.55'],
                'body-m': ['16px', '1.6'],
                'caption': ['13px', '1.4'],
            },
            boxShadow: {
                'e1': '0 1px 1px rgba(0,0,0,0.04)',
                'e2': '0 4px 12px rgba(0,0,0,0.08)',
                'e3': '0 12px 32px rgba(0,0,0,0.18)',
            },
            animation: {
                'fade-in': 'fadeIn 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                'fade-out': 'fadeOut 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                'scale-in': 'scaleIn 120ms cubic-bezier(0.2, 0.7, 0.2, 1)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeOut: {
                    '0%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(4px)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            fontFeatureSettings: {
                'tnum': '"tnum" 1',
            },
            backdropBlur: {
                'sm': '4px',
            },
            maxWidth: {
                'container': '1200px',
            },
        },
    },

    plugins: [
        forms,
        function({ addUtilities }) {
            addUtilities({
                '.font-tnum': {
                    'font-feature-settings': '"tnum" 1',
                },
                '.text-balance': {
                    'text-wrap': 'balance',
                },
            })
        }
    ],
};
