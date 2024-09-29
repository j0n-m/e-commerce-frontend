/** @type {import('tailwindcss').Config} */
import tw from "tailwindcss-react-aria-components";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      // dark-gray-900: #111827
      backgroundColor: {
        "light-primary-gray": "#f2f2f2",
        "dark-primary-gray": "#121212",
        "dark-secondary-gray": "#1f1b24",
      },
      backgroundImage: {
        "nav-searchIcon": "url('/src/assets/icons/searchIcon.svg')",
      },
      gridTemplateColumns: {
        "3col": "1fr 1fr 275px",
      },
      boxShadow: {
        around: "0px 1px 2px #c3c3c3",
      },
    },
  },
  plugins: [tw({ prefix: "rac" })],
};
