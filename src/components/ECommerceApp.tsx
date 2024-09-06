import { useEffect, useState } from "react";
import Nav from "./Nav";
import { Outlet } from "@tanstack/react-router";

function ECommerceApp() {
  const [theme, setTheme] = useState("");

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme((prev) => {
      console.log("setting to", newTheme);
      document?.documentElement?.classList?.remove(prev);
      document.documentElement.classList.add(newTheme);

      return newTheme;
    });
    localStorage.setItem("theme", newTheme);
  };

  //initial mount - set the theme
  useEffect(() => {
    //uses theme value from localstorage first
    const LS_value = localStorage.getItem("theme");
    if (LS_value && (LS_value === "light" || LS_value === "dark")) {
      setTheme(LS_value);
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        localStorage.setItem("theme", "dark");
        setTheme("dark");
      } else {
        localStorage.setItem("theme", "light");
        setTheme("light");
      }
    }
    const appliedTheme = String(localStorage.getItem("theme"));
    document.documentElement.classList.add(
      appliedTheme
      // "antialiased",
      // "dark:bg-slate-900",
      // "dark:text-neutral-100"
    );
    document.body.classList.add(
      "antialiased",
      "dark:bg-slate-900",
      "dark:text-neutral-100"
    );
    console.log(
      "theme set from ecommerceapp.tsx",
      String(localStorage.getItem("theme"))
    );
  }, []);

  return (
    <div className="app-container flex flex-col">
      <Nav theme={theme} handleThemeChange={handleThemeChange} />
      <div className="outlet-container flex-1 min-h-[768px] relative">
        <Outlet />
      </div>
      <footer className="border border-white">footer</footer>
    </div>
  );
}

export default ECommerceApp;
