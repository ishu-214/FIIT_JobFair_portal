/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fiit: {
          50: '#F4F4FB',
          100: '#E9E9F7',
          200: '#D5D5F0',
          300: '#B2B0E3',
          400: '#7E7BD0',
          500: '#5451BA',
          DEFAULT: '#2F2D7D', // FIIT Brand Navy: #2F2D7D (RGB: 47, 45, 125)
          600: '#2F2D7D',
          700: '#262468',
          800: '#1D1C52',
          900: '#15143D',
          950: '#0C0C24',
        }
      }
    },
  },
  plugins: [],
}
