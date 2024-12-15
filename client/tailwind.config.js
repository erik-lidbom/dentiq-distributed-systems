/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dentiqDarkBlue: '#0D47A1',
        dentiqBlue: '#1565C0',
        dentiqLightBlue: '#4A90E2',
        dentiqBtnBlue: '#1565C0',
        dentiqGray: '#BDBDBD',
        dentiqLightGray: '#E0E0E0',
      },
    },
  },
  plugins: [],
}
