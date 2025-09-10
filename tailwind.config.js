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
                // Primary - Sacred gold/saffron for divine elements
                primary: {
                    50: '#FEF7E6',
                    100: '#FDEECC',
                    200: '#FBDD99',
                    300: '#F9CC66',
                    400: '#F7BB33',
                    500: '#F5AA00',  // sacred saffron
                    600: '#C48800',
                    700: '#936600',
                    800: '#624400',
                    900: '#312200',
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
                // Spiritual color palette
                spiritual: {
                    light: '#FEF9E7',  // warm ivory
                    mist: '#F5F0E8',   // soft beige
                    glow: '#EDE4D1',   // gentle gold
                    deep: '#C49B61',   // spiritual gold
                },
                sacred: {
                    50: '#FEF7E6',
                    100: '#FDEECC',
                    200: '#F5E4C8',
                    300: '#E8D5B7',
                    400: '#DCC5A4',
                    500: '#C49B61',   // sacred gold
                    600: '#B8883A',
                    700: '#9A7033',
                    800: '#7D5A2A',
                    900: '#654823',
                },
                devotional: {
                    dawn: '#FFF9E6',   // early morning light
                    light: '#FFF3D4',  // gentle sunrise
                    warm: '#FFE5B4',   // warm glow
                    deep: '#E6CC94',   // deeper devotion
                },
                // Error colors
                error: {
                    50: '#FEF2F2',
                    600: '#DC2626',
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
                    200: '#FEF3C7',
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
                'divine': '0 8px 25px rgba(196, 155, 97, 0.15), 0 3px 10px rgba(196, 155, 97, 0.1)',
                'enlightened': '0 20px 40px rgba(196, 155, 97, 0.2), 0 8px 16px rgba(196, 155, 97, 0.15)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'spiritual-gradient': 'linear-gradient(135deg, #FEF7E6 0%, #F5F0E8 50%, #FFF9E6 100%)',
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
                '.devotional-glow': {
                    'box-shadow': '0 0 20px rgba(196, 155, 97, 0.15), 0 0 40px rgba(196, 155, 97, 0.08)',
                },
                '.devotional-border': {
                    'border': '1px solid rgba(196, 155, 97, 0.2)',
                    'background': 'linear-gradient(145deg, rgba(255, 247, 230, 0.8), rgba(245, 240, 232, 0.9))',
                },
                '.sacred-shimmer': {
                    'background': 'linear-gradient(90deg, transparent, rgba(196, 155, 97, 0.4), transparent)',
                    'animation': 'shimmer 2s infinite',
                },
                '@keyframes shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            })
        }
    ],
};
