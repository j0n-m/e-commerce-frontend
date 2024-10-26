/** @type {import('tailwindcss').Config} */
import tw from "tailwindcss-react-aria-components";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      // dark-gray-900: #111827
      // colors: {
      //   a0d: "#dedede",
      //   a1d: "#999999",
      //   a2d: "#616161",
      //   a0sd: "#121212",
      //   a1sd: "#282828",
      //   a2sd: "#3f3f3f",
      //   a3sd: "#575757",
      //   a4sd: "#717171",
      //   a5sd: "#8b8b8b",
      // },
      colors: {
        a0d: "#f1f1f1",
        a1d: "#aaa",
        a2d: "#717171",
        a0sd: "#0f0f0f",
        a1sd: "#282828",
        a2sd: "#303030",
        a3sd: "#3b3b3b",
        amenusd: "#212121",
        a0: "#0f0f0f",
        a1: "#606060",
        a2: "#424242",
        a0s: "white",
        a1s: "#eeeeee",
        a2s: "#cccccc",
        a3s: "#909090",
        a4s: "#717171",
        a5s: "#606060",
      },
      backgroundColor: {
        "light-primary-gray": "#f2f2f2",
        "dark-primary-gray": "#121212",
        "dark-secondary-gray": "#1f1b24",
        // a0d: "#121212",
        // a1d: "#282828",
        // a2d: "#3f3f3f",
        // a3d: "#575757",
        // a4d: "#717171",
        // a5d: "#8b8b8b",
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
      screens: {
        xxs: "320px",
        xs: "375px",
      },
    },
  },
  plugins: [tw({ prefix: "rac" })],
};
