/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102d36',
        teal: { 50: '#eef9f6', 100: '#d8efe8', 600: '#087f75', 700: '#07665e', 900: '#123e3d' },
        paper: '#f8faf9',
      },
      fontFamily: { sans: ['Inter', 'Segoe UI', 'sans-serif'], display: ['Georgia', 'serif'] },
      boxShadow: { soft: '0 12px 50px -20px rgb(16 45 54 / 0.22)' },
    },
  },
  plugins: [],
};
