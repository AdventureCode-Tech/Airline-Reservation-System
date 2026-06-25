/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D48E15',
          'gold-dark': '#B8770F',
          orange: '#F97316',
          navy: '#1B1B2F',
          purple: '#5D5FEF',
          'purple-dark': '#4A4CD6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
