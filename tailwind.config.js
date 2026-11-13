/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#F8F7FF',
          dark: '#0F0B2E',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          glass: 'var(--surface-glass)',
        },
        border: 'var(--border)',
        primary: {
          DEFAULT: '#6366F1', // Indigo
          dim: 'var(--primary-dim)',
          dark: '#4F46E5',
          light: '#818CF8',
          violet: '#8B5CF6',
        },
        accent: {
          pink: '#EC4899',
          teal: '#14B8A6',
          amber: '#F59E0B',
        },
        teal: {
          DEFAULT: '#14B8A6',
          dim: '#CCFBF1',
          light: '#2DD4BF',
        },
        pink: {
          DEFAULT: '#EC4899',
          dim: '#FCE7F3',
          light: '#F472B6',
        },
        amber: {
          DEFAULT: '#F59E0B',
          dim: '#FEF3C7',
          light: '#FBBF24',
        },
        risk: {
          low: '#10B981',
          mid: '#F59E0B',
          high: '#EF4444',
        },
        text: {
          DEFAULT: 'var(--text-heading)',
          heading: 'var(--text-heading)',
          body: 'var(--text-body)',
          muted: 'var(--text-muted)',
          2: 'var(--text-body)',
        },
        muted: {
          DEFAULT: 'var(--text-muted)',
          foreground: 'var(--text-muted)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card-24': '24px',
        card: '20px',
        btn: '14px',
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(99, 102, 241, 0.04)',
        card: '0 8px 30px rgba(99, 102, 241, 0.06)',
        cardHover: '0 14px 40px rgba(139, 92, 246, 0.12)',
        glass: '0 8px 32px 0 rgba(99, 102, 241, 0.08)',
        modal: '0 25px 60px -10px rgba(15, 11, 46, 0.25)',
        glowPrimary: '0 6px 24px -2px rgba(99, 102, 241, 0.4)',
        glowPrimaryHover: '0 10px 32px 0px rgba(139, 92, 246, 0.6)',
        glowPink: '0 6px 24px -2px rgba(236, 72, 153, 0.4)',
        glowTeal: '0 6px 24px -2px rgba(20, 184, 166, 0.4)',
      },
      maxWidth: {
        content: '1120px',
        scan: '800px',
      },
      animation: {
        'sonar-1': 'sonar 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'sonar-2': 'sonar 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite 600ms',
        'sonar-3': 'sonar 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite 1200ms',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out infinite 2s',
        'drift-1': 'drift 18s ease-in-out infinite alternate',
        'drift-2': 'drift 24s ease-in-out infinite alternate-reverse',
        'drift-3': 'drift 20s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
      },
      keyframes: {
        sonar: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drift: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.08)' },
          '100%': { transform: 'translate(-25px, 20px) scale(0.95)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
