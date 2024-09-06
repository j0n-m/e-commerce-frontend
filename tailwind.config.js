/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      backgroundImage: {
        "nav-searchIcon": "url('/src/assets/icons/searchIcon.svg')",
      },
      gridTemplateColumns: {
        "3col": "1fr 1fr 275px",
      },
    },
  },
  plugins: [],
};
