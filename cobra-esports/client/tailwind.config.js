/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cobra: {
          black: '#08090b',
          charcoal: '#121317',
          yellow: '#f5d300',
          yellowSoft: '#ffe75c',
          red: '#a1112f',
          redDeep: '#7a0c23',
          white: '#fafafa',
          bone: '#f2f0ea',
        },
      },
      fontFamily: {
        display: ['"Rajdhani"', '"Oswald"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 8px rgba(245, 211, 0, 0.6), 0 0 24px rgba(245, 211, 0, 0.35), 0 0 48px rgba(245, 211, 0, 0.15)',
        'neon-sm': '0 0 6px rgba(245, 211, 0, 0.5)',
        crimson: '0 8px 30px rgba(161, 17, 47, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};
