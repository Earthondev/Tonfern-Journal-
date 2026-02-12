import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'Cormorant Garamond', 'serif'],
        'serif': ['Crimson Pro', 'serif'],
        'handwriting': ['Kalam', 'cursive'],
        'thai-hand': ['Sriracha', 'Itim', 'cursive'],
        'sans': ['Kanit', 'sans-serif'],
        'body': ['Kanit', 'Noto Sans Thai', 'sans-serif'],
      },
      colors: {
        'journal': {
          paper: '#f5f0e8',
          'paper-warm': '#efe8d8',
          'paper-edge': '#e6dcc8',
          ink: '#2c3e2d',
          'ink-light': '#4a6b4c',
          'ink-faded': '#8a9b7e',
          gold: '#c9a55c',
          'gold-light': '#dfc88a',
          'gold-dark': '#a07e3a',
          leather: '#3e5c3a',
          'leather-deep': '#2a3f28',
          'leather-worn': '#4e6d4a',
          rose: '#c4a08a',
        },
        'fern': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 0.3s ease-out',
        'flip-right': 'flipRight 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'flip-left': 'flipLeft 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'cover-open': 'coverOpen 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'shimmer': 'shimmerGold 3s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flipRight: {
          '0%': { transform: 'perspective(1200px) rotateY(0deg)', opacity: '1' },
          '40%': { transform: 'perspective(1200px) rotateY(-85deg)', opacity: '0.3' },
          '100%': { transform: 'perspective(1200px) rotateY(0deg)', opacity: '1' },
        },
        flipLeft: {
          '0%': { transform: 'perspective(1200px) rotateY(0deg)', opacity: '1' },
          '40%': { transform: 'perspective(1200px) rotateY(85deg)', opacity: '0.3' },
          '100%': { transform: 'perspective(1200px) rotateY(0deg)', opacity: '1' },
        },
        coverOpen: {
          '0%': { transform: 'perspective(1200px) scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'perspective(1200px) scale(1)', opacity: '1' },
        },
        shimmerGold: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
      },
      boxShadow: {
        'page': '3px 6px 30px rgba(60, 40, 20, 0.15), inset 0 0 60px rgba(60, 40, 20, 0.03)',
        'book': '6px 8px 40px rgba(30, 20, 10, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
