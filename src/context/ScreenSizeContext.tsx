import { createContext } from "react";

const initialScreenData = {
  isMobile: false,
  isTablet: false,
  isDesktop: false,
};
export const ScreenSizeContext = createContext(initialScreenData);
