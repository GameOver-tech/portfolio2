/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#080A10',
        'bg-surface': '#11141C',
        'bg-card': 'rgba(17,20,28,0.7)',
        'bg-elevated': 'rgba(22,27,38,0.8)',
        'bg-glass': 'rgba(17,20,28,0.5)',
        accent: '#00F0FF',
        'accent-pulse': '#FF3B6F',
        'accent-neural': '#7C3AED',
        'accent-green': '#00E676',
        'text-primary': '#FFFFFF',
        'text-secondary': '#8892A0',
        'text-muted': '#555D6B',
        'border-subtle': 'rgba(255,255,255,0.06)',
        'border-visible': 'rgba(255,255,255,0.12)',
        'border-hover': 'rgba(255,255,255,0.2)',
        primary: '#00F0FF',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00F0FF 0%, #7C3AED 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00F0FF 0%, #7C3AED 100%)',
        'gradient-pulse': 'linear-gradient(135deg, #FF3B6F 0%, #7C3AED 50%, #00F0FF 100%)',
        'gradient-soft': 'radial-gradient(ellipse at 30% 20%, rgba(0,240,255,0.06), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.04), transparent 50%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(0,240,255,0.1), transparent 70%)',
        'gradient-card': 'linear-gradient(180deg, rgba(0,240,255,0.03) 0%, transparent 100%)',
        mesh: 'linear-gradient(135deg, rgba(0,240,255,0.03) 0%, rgba(8,10,16,0.98) 50%, rgba(17,20,28,0.98) 100%)',
      },
      boxShadow: {
        glow: '0 0 30px rgba(0,240,255,0.1), 0 0 60px rgba(0,240,255,0.04)',
        'glow-strong': '0 0 30px rgba(0,240,255,0.25), 0 0 60px rgba(0,240,255,0.1)',
        'glow-pulse': '0 0 30px rgba(255,59,111,0.15), 0 0 60px rgba(255,59,111,0.05)',
        'glow-neural': '0 0 30px rgba(124,58,237,0.15), 0 0 60px rgba(124,58,237,0.05)',
        card: '0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        elevated: '0 20px 60px rgba(0,0,0,0.6)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'pulse-fast': 'pulse 0.8s ease-in-out infinite',
        'scan-line': 'scanLine 4s linear infinite',
        'grid-flow': 'gridFlow 20s linear infinite',
        'data-stream': 'dataStream 3s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'drift': 'drift 10s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(0.95)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        gridFlow: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(56px, 56px)' },
        },
        dataStream: {
          '0%': { strokeDashoffset: 100 },
          '100%': { strokeDashoffset: 0 },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.6, filter: 'brightness(1)' },
          '50%': { opacity: 1, filter: 'brightness(1.3)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(8px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(8px) rotate(-360deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -10px)' },
          '50%': { transform: 'translate(-5px, 15px)' },
          '75%': { transform: 'translate(-10px, -5px)' },
        },
      },
    },
  },
  plugins: [],
}
