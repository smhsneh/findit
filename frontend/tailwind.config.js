/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: '#0a0908',
        'stormy-teal': '#e9d5e6',
        'yale-blue': '#3f303d',
        'dust-grey': '#D9D9D9',
        surface: '#FFFFFF',
        background: '#f2f4f3',
        border: '#EEF1F4',
        'text-main': '#0a0908',
        'text-muted': '#0a0908',
        'text-light': '#3f303d',
      },
      fontFamily: {
        header: ['"Martian Mono"', 'monospace'],
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
