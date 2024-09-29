import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import CheckoutPage from "./CheckoutPage";
import { Navigate } from "@tanstack/react-router";
import { PaymentContext } from "../context/PaymentSecretContext";

const stripePublishKey =
  "pk_test_51Q0TEsP2PfjUIESRgbKfEbmEtiIKYbJKRmaNsi27hTUCBNXiCUuy6PvIYsohIzECYR4rWEnrp6luTapCDrxY2Lq200hpM9dWSq";
const stripePromise = loadStripe(stripePublishKey);

function VerifyCheckoutPage() {
  const { clientSecret, customerSessionSecret } = useContext(PaymentContext);
  const { theme: pageTheme } = useContext(ThemeContext);

  //redirect back to /cart if attempting to go to this path without a client secret
  if (!clientSecret) {
    console.log("no client secret, redirection back to /cart");
    return <Navigate to="/cart"></Navigate>;
  }
  // Client secret is guarenteed at this point.

  const ElementOptions: StripeElementsOptions = {
    clientSecret: clientSecret,
    appearance: { theme: pageTheme === "dark" ? "night" : "stripe" },
    customerSessionClientSecret: customerSessionSecret || undefined,
  };

  return (
    <Elements options={{ ...ElementOptions }} stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
}

export default VerifyCheckoutPage;
