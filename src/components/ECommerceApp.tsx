import { useEffect, useState } from "react";
import Nav from "./Nav";
import { useLocation } from "@tanstack/react-router";
import Footer from "./Footer";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
import PersistAuth from "./PersistAuth";

function useScreenSize() {
  function checkScreenSize() {
    const isMobile =
      window.matchMedia("(min-width: 0px)").matches &&
      window.matchMedia("(max-width: 767px)").matches;

    const isTablet =
      window.matchMedia("(min-width: 768px)").matches &&
      window.matchMedia("(max-width: 1023px)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    return { isMobile, isTablet, isDesktop };
  }
  //to get initial values
  const screen = checkScreenSize();

  const [isMobile, setIsMobile] = useState(screen.isMobile);
  const [isTablet, setIsTablet] = useState(screen.isTablet);
  const [isDesktop, setIsDesktop] = useState(screen.isDesktop);

  useEffect(() => {
    const cbResize = () => {
      const screen = checkScreenSize();

      if (screen.isMobile !== isMobile) {
        setIsMobile(screen.isMobile);
      } else if (screen.isTablet !== isTablet) {
        setIsTablet(screen.isTablet);
      } else {
        setIsDesktop(screen.isDesktop);
      }
    };

    window.addEventListener("resize", cbResize);
    console.log("set new screen size.");
    return () => window.removeEventListener("resize", cbResize);
  }, [isMobile, isTablet, isDesktop]);
  //return object from hook
  return { isMobile, isTablet, isDesktop };
}

function ECommerceApp() {
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  const route = useLocation();
  const path = route.pathname.replace("/", "").split("/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const { user, setUser } = useAuth();

  // if (getUserAuth.data?.data?.isAuth && !user) {
  //   setUser(getUserAuth.data?.data?.user);
  // }
  // if (!getUserAuth.data?.data?.isAuth && user) {
  //   setUser(null);
  // }
  // console.log(getUserAuth.data?.data);
  // console.log("user", user);

  return (
    <ScreenSizeContext.Provider value={{ isMobile, isDesktop, isTablet }}>
      <div className="app-container flex flex-col">
        {!path[0].match(/checkout/i) && <Nav />}
        <div className="bg-light-primary-gray dark:bg-dark-primary-gray outlet-container flex-1 min-h-[768px] relative">
          <PersistAuth />
          {/* <Outlet></Outlet> */}
        </div>
        <Footer />
      </div>
    </ScreenSizeContext.Provider>
  );
}

export default ECommerceApp;
