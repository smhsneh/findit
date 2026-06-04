/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          light: '#f4effa',
          DEFAULT: '#e6e6fa',
        },
        steel: {
          light: '#b0c4de',
          medium: '#7a9bd4',
          dark: '#4b6f9e',
        },
        brand: {
          dark: '#2c4f7c',
        },
      },
      fontFamily: {
        header: ['Offside', 'sans-serif'],
        body: ['"Google Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
