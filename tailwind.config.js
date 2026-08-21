/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nexus-bg': '#040B0E',
        'nexus-card': 'rgba(10, 20, 25, 0.5)',
        'nexus-emerald': '#00F0FF',
        'nexus-mint': '#00FF9D',
      },
      fontFamily: {
        heading: ['"Instrument Serif"', 'serif'],
        body: ['"Barlow"', 'sans-serif'],
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #00FF9D 0%, #00F0FF 100%)',
      }
    },
  },
  plugins: [],
}
