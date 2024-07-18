/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "nav-searchIcon": "url('./src/assets/icons/searchIcon.svg')",
      },
    },
  },
  plugins: [],
};
