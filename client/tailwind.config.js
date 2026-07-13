/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prussian-blue': '#0a1128',
        'deep-navy': '#0a1128',
        'yale-blue': '#034078',
        'white-brilliant': '#fefcfb',
        
        // Aliases for existing classes to avoid breaking changes
        graphite: '#0a1128', // Mapping to Prussian Blue
        'stormy-teal': '#034078', // Mapping to Yale Blue for accents
        'dust-grey': '#0a1128', // Mapping to Deep Navy
        
        surface: '#ffffff',
        background: '#000000', 
        border: 'rgba(0, 0, 0, 0.1)', 
        'text-main': '#000000', 
        'text-muted': 'rgba(0, 0, 0, 0.6)', 
        'text-light': 'rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        header: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        'search': '28px',
        'panel': '28px',
        'card': '24px',
        'btn': '18px',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,.04)',
        'search': '0 12px 40px rgba(0,0,0,.04)',
        'card-hover': '0 12px 30px rgba(60,110,113,.12)',
        'focus': '0 0 0 4px rgba(40,75,99,.08)',
      },
      maxWidth: {
        'container': '1600px',
      }
    },
  },
  plugins: [],
}
