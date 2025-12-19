/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ancient: {
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
