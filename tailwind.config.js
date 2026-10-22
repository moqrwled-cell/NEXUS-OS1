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
        'nexus-emerald': '#0E6B52',
        'nexus-cyan': '#123B5C',
        'nexus-mint': '#0E6B52',
        'nexus-surface': '#071015',
        'nexus-border': 'rgba(255, 255, 255, 0.08)',
        // Official AmLaw 100 Institutional Design Palette
        'legal-primary': '#123B5C',       // Navy Blue
        'legal-primary-dark': '#0C2A42',  // Midnight Navy
        'legal-accent': '#0E6B52',        // Deep Emerald Green (10-15% usage)
        'legal-success': '#0E6B52',       // Institutional Emerald
        'legal-text': '#0F1B2A',          // Deep Charcoal Navy Text
        'legal-muted': '#5A6B7A',         // Muted Slate Blue-Grey
        'legal-bg': '#F7F9FA',            // Institutional Canvas Off-White
        'legal-surface': '#FFFFFF',       // Pure White Document Paper / Card
        'legal-border': '#D9E1E7',        // Refined Neutral Legal Border
        'legal-danger': '#B3261E',        // Restrained Court Burgundy / Red
      },
      fontFamily: {
        // AmLaw 100 Professional Legal Typography
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        legal: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // Fallback font aliases
        cairo: ['"Cairo"', '"Inter"', 'sans-serif'],
        almarai: ['"Almarai"', '"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #123B5C 0%, #0E6B52 100%)',
        'legal-gradient': 'linear-gradient(135deg, #0C2A42 0%, #123B5C 100%)',
      }
    },
  },
  plugins: [],
}
