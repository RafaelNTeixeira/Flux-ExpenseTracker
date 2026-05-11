/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#07090F',
          secondary: '#0D1017',
          card: '#111520',
          elevated: '#171C2B',
          hover: '#1C2235',
        },
        border: {
          DEFAULT: '#1E2438',
          subtle: '#141927',
          bright: '#2A3350',
        },
        accent: {
          blue: '#4F8EF7',
          'blue-dim': 'rgba(79,142,247,0.12)',
          gold: '#F5A623',
          'gold-dim': 'rgba(245,166,35,0.12)',
          emerald: '#34D399',
          'emerald-dim': 'rgba(52,211,153,0.12)',
          rose: '#F87171',
          'rose-dim': 'rgba(248,113,113,0.12)',
          violet: '#A78BFA',
          'violet-dim': 'rgba(167,139,250,0.12)',
          cyan: '#22D3EE',
        },
        text: {
          primary: '#E8ECF5',
          secondary: '#7B88A4',
          muted: '#3D4A63',
          gold: '#F5A623',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(79,142,247,0.15)',
        'glow-gold': '0 0 24px rgba(245,166,35,0.15)',
        'glow-emerald': '0 0 24px rgba(52,211,153,0.15)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s ease',
        pulse_slow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
