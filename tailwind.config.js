export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-purple-main': '#3A2665',
        'brand-purple-dark': '#1E183A',
        'brand-yellow': '#F59C1A',
        'brand-purple-vibrant': '#ED00E2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
