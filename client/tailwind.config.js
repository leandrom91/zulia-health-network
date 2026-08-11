/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zulia: {
          blue: '#003882',
          red: '#CE1126',
          sun: '#FDB813',
          dark: '#0A192F',
          sky: '#0077C8',
        },
        health: {
          green: '#00A86B',
          red: '#DC2626',
          gray: '#9CA3AF',
          lightBg: '#F4F7F9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
