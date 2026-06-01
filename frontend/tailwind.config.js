/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        line: '#d9dee8',
        surface: '#f6f8fb',
        brand: '#116466',
        accent: '#c75b39',
      },
      boxShadow: {
        subtle: '0 1px 2px rgb(16 24 40 / 0.08)',
      },
    },
  },
  plugins: [],
};
