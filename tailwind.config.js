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
        // Unified Enterprise Legal Typography System
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        legal: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // Fallback font aliases
        cairo: ['"Cairo"', '"IBM Plex Sans"', 'sans-serif'],
        almarai: ['"Almarai"', '"IBM Plex Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #00FF9D 0%, #00F0FF 100%)',
      }
    },
  },
  plugins: [],
}
