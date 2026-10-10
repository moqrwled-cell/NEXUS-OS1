/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nexus-bg': '#020608',
        'nexus-card': 'rgba(6, 14, 18, 0.7)',
        'nexus-emerald': '#00FF9D',
        'nexus-cyan': '#00F0FF',
        'nexus-mint': '#00FF9D',
        'nexus-surface': '#071015',
        'nexus-border': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', '"Cairo"', '"Almarai"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '"Cairo"', '"Almarai"', 'sans-serif'],
        cairo: ['"Cairo"', '"Almarai"', 'sans-serif'],
        almarai: ['"Almarai"', '"Cairo"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #00FF9D 0%, #00F0FF 100%)',
      }
    },
  },
  plugins: [],
}
