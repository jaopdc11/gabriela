/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        night: {
          DEFAULT: '#070810',
          deep: '#04050b',
          soft: '#0e1120',
        },
        star: '#f5f1e8',
        ember: {
          DEFAULT: '#e6c07a',
          deep: '#c99a4a',
        },
        mist: '#8b91a6',
      },
      letterSpacing: {
        title: '0.18em',
        label: '0.32em',
      },
      keyframes: {
        'title-in': {
          '0%': { opacity: '0', transform: 'translateY(14px)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        ignite: {
          '0%': { opacity: '0', transform: 'scale(0.2)' },
          '60%': { opacity: '1', transform: 'scale(1.35)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'hint-fade': {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.7' },
        },
        halo: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.85)' },
          '50%': { opacity: '0.55', transform: 'scale(1.15)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        twinkle: 'twinkle 3.5s ease-in-out infinite',
        'hint-fade': 'hint-fade 2.4s ease-in-out infinite',
        'title-in': 'title-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) both',
        ignite: 'ignite 1.2s cubic-bezier(0.22, 1, 0.36, 1) both',
        halo: 'halo 4.5s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
