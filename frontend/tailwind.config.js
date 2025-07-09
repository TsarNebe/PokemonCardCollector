/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {  backgroundImage: {
    'pokedex': "url('/assets/pokedex-bg.png')"
  }}
  },
  plugins: []
};
