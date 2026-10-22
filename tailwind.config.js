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
        // Deep obsidian executive palette
        'obsidian-bg': '#030712',
        'obsidian-surface': '#050A0F',
        'obsidian-card': '#0A1017',
        'obsidian-border': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        // High-Precision Typography System
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        ui: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        legal: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // Fallback font aliases
        cairo: ['"Cairo"', '"Inter"', 'sans-serif'],
        almarai: ['"Almarai"', '"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #00FF9D 0%, #00F0FF 100%)',
      }
    },
  },
  plugins: [],
}
