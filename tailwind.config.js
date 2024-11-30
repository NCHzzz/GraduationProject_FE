/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
      },
      colors: {
        customOrange: '#d2511f'
      },
      borderColor: {
        customOrange: '#d2511f'
      },
      light: {
        background: '#ffffff',
        color: '#000000',
        primary: '#007bff',
      },
      dark: {
        background: '#000000',
        color: '#ffffff',
        primary: '#1e1e1e',
      }
    },
  },
  plugins: [],
}