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
        // Legal Professional Fonts (IBM Plex — used by Harvey AI, Ironclad, Westlaw)
        sans: ['"IBM Plex Sans"', '"Cairo"', '"Almarai"', 'sans-serif'],
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // Legacy aliases kept for other pages
        heading: ['"IBM Plex Sans"', '"Cairo"', 'sans-serif'],
        body: ['"IBM Plex Sans"', '"Cairo"', 'sans-serif'],
        cairo: ['"Cairo"', '"Almarai"', 'sans-serif'],
        almarai: ['"Almarai"', '"Cairo"', 'sans-serif'],
        legal: ['"IBM Plex Serif"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #00FF9D 0%, #00F0FF 100%)',
      }
    },
  },
  plugins: [],
}
