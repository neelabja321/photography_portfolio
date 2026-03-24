/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a0a',
          surface: '#111111',
          card: '#1a1a1a',
        },
        forest: {
          DEFAULT: '#1b2a22',
          light: '#2c4235',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#f5d76e',
          muted: '#8a7322',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to bottom, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 1) 100%)',
      }
    },
  },
  plugins: [],
}
