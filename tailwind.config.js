/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './lib/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        'smc-dark': '#050816',
        'smc-surface': '#0b1224',
        'smc-accent': '#22c55e'
      },
      boxShadow: {
        'smc-card': '0 25px 45px rgba(2, 6, 23, 0.65)'
      }
    }
  },
  plugins: []
};
