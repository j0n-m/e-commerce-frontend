import { useContext, useEffect, useState } from "react";
import Nav from "./Nav";
import { Outlet, useLocation } from "@tanstack/react-router";
import Footer from "./Footer";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
import { CartContext } from "../context/CartContext";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import fetch from "../utilities/fetch";
import { Elements } from "@stripe/react-stripe-js";
import { ThemeContext } from "../context/ThemeContext";
import Cart from "./Cart";
import { PaymentContext } from "../context/PaymentSecretContext";

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
// const defaultComponents = (
//   <>
//     <Nav />
//     <Outlet></Outlet>
//   </>
// );
const stripePublishKey =
  "pk_test_51Q0TEsP2PfjUIESRgbKfEbmEtiIKYbJKRmaNsi27hTUCBNXiCUuy6PvIYsohIzECYR4rWEnrp6luTapCDrxY2Lq200hpM9dWSq";
const stripePromise = loadStripe(stripePublishKey);

function ECommerceApp() {
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  const { cart } = useContext(CartContext);
  const { theme: pageTheme } = useContext(ThemeContext);
  const { clientSecret, setClientSecret } = useContext(PaymentContext);
  const route = useLocation();
  const path = route.pathname.replace("/", "").split("/");

  // const ElementTheme = (theme === "dark" ? ({theme:"night"}): ({theme:"stripe"}))
  const ElementOptions: StripeElementsOptions | undefined = {
    clientSecret: clientSecret,
    appearance: { theme: pageTheme === "dark" ? "night" : "stripe" },
  };

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        // console.log(stripePromise);
        const response = await fetch.post("api/create-payment-intent", {
          cart: cart,
        });
        console.log("create-payment-intent response:", response);

        if (response.status === 200) {
          setClientSecret(response.data["clientSecret"]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    // if (cart.length <= 0) return;
    getClientSecret().catch((e) => console.log(e));
  }, [cart]);
  console.log("client secret?", clientSecret);

  return (
    <ScreenSizeContext.Provider value={{ isMobile, isDesktop, isTablet }}>
      <div className="app-container flex flex-col">
        {!path[0].match(/checkout/i) && <Nav />}
        <div className="bg-light-primary-gray dark:bg-dark-primary-gray outlet-container flex-1 min-h-[768px] relative">
          {clientSecret ? (
            <Elements options={{ ...ElementOptions }} stripe={stripePromise}>
              <p>This is the Elements Path</p>
              <Outlet></Outlet>
            </Elements>
          ) : (
            <>
              <p>no elements provider</p>
              <Outlet></Outlet>
            </>
          )}
        </div>
        <Footer />
      </div>
    </ScreenSizeContext.Provider>
  );
}

export default ECommerceApp;
