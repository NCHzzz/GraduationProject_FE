/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  //Make sure your paths are correct
  ],
  theme: {
    extend: {
      colors: {
        customOrange: '#d2511f'
      },
      borderColor: {
        customOrange: '#d2511f'
      }
    },
  },
  plugins: [],
}
