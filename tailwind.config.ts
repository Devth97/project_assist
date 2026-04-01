import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── New palette ────────────────────────────────────────────────
        cream:   '#EAD8C0',
        ink:     '#0D0D0D',
        purple:  '#6C4CF1',
        yellow:  '#FFD84D',
        offwhite:'#FAFAF8',
        muted:   '#7C6E60',
        // ── Legacy aliases (API/payment code) ─────────────────────────
        bg:      '#FAFAF8',
        bg2:     '#F3EDE5',
        bg3:     '#EAD8C0',
        surface: '#FFFFFF',
        surface2:'#F8F4F0',
        amber:   '#F07D0C',
        cyan:    '#22D3EE',
        emerald: '#10B981',
        rose:    '#F43F5E',
        violet:  '#8B5CF6',
        gold:    '#F59E0B',
        text:    '#0D0D0D',
        text2:   '#4A4A4A',
        text3:   '#7C6E60',
        card:    '#FFFFFF',
        card2:   '#F3EDE5',
        accent:  '#6C4CF1',
        accent2: '#F43F5E',
        accent3: '#10B981',
        accent4: '#FFD84D',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
        syne:    ['var(--font-body)', 'sans-serif'],
        inter:   ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'float-1':    'float1 4s ease-in-out infinite',
        'float-2':    'float2 5s ease-in-out infinite',
        'float-3':    'float3 3.5s ease-in-out infinite',
        'float-4':    'float4 6s ease-in-out infinite',
        'float-5':    'float5 4.5s ease-in-out infinite',
        'ticker':     'ticker 28s linear infinite',
        'fade-in':    'fadeIn 0.6s ease forwards',
        'slide-up':   'slideUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':   'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'spin':       'spin 1s linear infinite',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'ping':       'ping 1s cubic-bezier(0,0,0.2,1) infinite',
        'amber-pulse':'amberPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float1:     { '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },   '50%': { transform: 'translateY(-16px) rotate(5deg)' } },
        float2:     { '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },   '50%': { transform: 'translateY(-20px) rotate(-4deg)' } },
        float3:     { '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },   '50%': { transform: 'translateY(-12px) rotate(8deg)' } },
        float4:     { '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },   '50%': { transform: 'translateY(-24px) rotate(-6deg)' } },
        float5:     { '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },   '50%': { transform: 'translateY(-10px) rotate(3deg)' } },
        ticker:     { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:    { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'scale(1)' } },
        amberPulse: { '0%,100%': { boxShadow: '0 0 30px rgba(108,76,241,0.2)' }, '50%': { boxShadow: '0 0 60px rgba(108,76,241,0.5)' } },
      },
    },
  },
  plugins: [],
}

export default config
