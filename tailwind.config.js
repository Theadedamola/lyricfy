/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cehua: ['Cehua', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/noiseEffect-bg.png')",
      },
    },
  },
  plugins: [],
}
