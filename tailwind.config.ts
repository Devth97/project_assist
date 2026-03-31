import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#07080E',
        bg2:      '#0C0F18',
        bg3:      '#111420',
        surface:  '#0D1018',
        surface2: '#131826',
        amber:    '#F07D0C',
        cyan:     '#22D3EE',
        emerald:  '#10B981',
        rose:     '#F43F5E',
        violet:   '#8B5CF6',
        gold:     '#F59E0B',
        text:     '#EEF0F6',
        text2:    '#7B82A0',
        text3:    '#4C5270',
        // keep legacy aliases so API/payment code doesn't break
        accent:   '#F07D0C',
        accent2:  '#F43F5E',
        accent3:  '#10B981',
        accent4:  '#F59E0B',
        card:     '#0D1018',
        card2:    '#131826',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
        body:    ['var(--font-body)', 'sans-serif'],
        // legacy aliases
        syne:    ['var(--font-display)', 'sans-serif'],
        inter:   ['var(--font-body)', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgba(240,125,12,0.10)',
        amber:   'rgba(240,125,12,0.30)',
        cyan:    'rgba(34,211,238,0.25)',
      },
      animation: {
        'pulse-slow':  'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':     'fadeIn 0.5s ease forwards',
        'slide-up':    'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'float':       'float 4s ease-in-out infinite',
        'blink':       'blink 1s step-end infinite',
        'amber-pulse': 'amberPulse 3s ease-in-out infinite',
        'spin':        'spin 1s linear infinite',
        'ping':        'ping 1s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:      { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        blink:      { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        amberPulse: { '0%,100%': { boxShadow: '0 0 30px rgba(240,125,12,0.15)' }, '50%': { boxShadow: '0 0 70px rgba(240,125,12,0.4)' } },
      },
    },
  },
  plugins: [],
}

export default config
