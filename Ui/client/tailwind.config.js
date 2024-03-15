/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: ["Montserrat", "sans-serif"],
      body: ["Montserrat", "sans-serif"],
    },
    extend: {
      colors: {
        "theme-yellow": "#ffc727",
        "theme-yellow-dark": "#e6b323",
        "theme-dark": "#37474f",
        "dark-purple": "#081A51",
        "light-white": "rgba(255, 255, 255, 0.17)",
      },
      height: {
        "screen-75": "90vh",
        "screen-50": "50vh",
      },
      fontFamily: {
        main: ["Montserrat"],
      },
    },
  },
  plugins: [],
};
