import { createContext, ReactNode, useEffect, useState } from "react";
import { z } from "zod";

export const themeValues = z.enum(["auto", "light", "dark"] as const);
// const initialTheme = z.object({
//   theme: z.enum(themeValues),
//   setTheme: z.function((themeValues),z.void())
// })
// type ThemeType = z.infer<typeof initialTheme>
type ThemeValues = z.infer<typeof themeValues>;
type ThemeType = {
  theme: ThemeValues;
  setTheme: React.Dispatch<React.SetStateAction<ThemeValues>>;
};
const initialTheme: ThemeType = {
  theme: "auto",
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeType>(initialTheme);

type ThemeProviderProps = {
  children: ReactNode;
};

const initializeThemeHTML = (theme: ThemeValues) => {
  //works with theme switch in nav component
  const auto_preferDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  document.documentElement.className = "";

  theme !== "auto"
    ? document.documentElement.classList.add(theme)
    : document.documentElement.classList.add(
        auto_preferDark ? "dark" : "light"
      );
};
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState(initialTheme.theme);
  initializeThemeHTML(theme);
  document.body.classList.add(
    "antialiased"
    // "dark:bg-slate-900",
    // "dark:text-neutral-100"
  );

  useEffect(() => {
    const cbThemeChange = () => {
      const preferDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const newTheme = preferDark ? "dark" : "light";
      if (theme !== newTheme) {
        document.documentElement.className = "";
        document.documentElement.classList.add(newTheme);
        setTheme(newTheme);
      }
    };
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme != "light" && storedTheme != "dark") {
      localStorage.setItem("theme", "auto");
      cbThemeChange();
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", cbThemeChange);
    } else {
      if (
        (storedTheme === "dark" && theme !== "dark") ||
        (storedTheme === "light" && theme !== "light")
      ) {
        document.documentElement.className = "";
        document.documentElement.classList.add(storedTheme);
        setTheme(storedTheme);
        localStorage.setItem("theme", storedTheme);
      }
    }
    console.log("theme", theme);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", cbThemeChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
