import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#0A0E1A',
        bg2:     '#111827',
        bg3:     '#1A2236',
        accent:  '#6C63FF',
        accent2: '#FF6B6B',
        accent3: '#00D9A3',
        accent4: '#FFB347',
        text:    '#E8EAF0',
        text2:   '#9BA3C0',
        text3:   '#6B7495',
        card:    '#131929',
        card2:   '#1C2640',
      },
      fontFamily: {
        syne:  ['var(--font-syne)', 'sans-serif'],
        mono:  ['var(--font-mono)', 'monospace'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
        accent:  'rgba(108,99,255,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
