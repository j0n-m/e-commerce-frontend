import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate } from "@tanstack/react-router";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import fetch from "../utilities/fetch";
import useAuth from "../hooks/useAuth";
import checkAndParseCart from "../utilities/checkAndParseCart";
const stripePublishKey =
  "pk_test_51Q0TEsP2PfjUIESRgbKfEbmEtiIKYbJKRmaNsi27hTUCBNXiCUuy6PvIYsohIzECYR4rWEnrp6luTapCDrxY2Lq200hpM9dWSq";
const stripePromise = loadStripe(stripePublishKey);

function CheckoutComplete() {
  //page to verify credentials before going to payment status
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const clientSecret =
    new URLSearchParams(window.location?.search).get(
      "payment_intent_client_secret"
    ) ?? "";

  useEffect(() => {
    const redirect = async () => {
      await navigate({ to: "/cart", replace: true });
    };
    const check = checkAndParseCart();
    if (!check.success) {
      redirect();
    }
    if (!clientSecret) {
      redirect();
    } else {
      setIsLoading(false);
    }
  }, []);
  if (isLoading) {
    return (
      <>
        <p className="text-center text-lg">Awaiting payment status...</p>
        <div className="loading-circle mt-4 mx-auto"></div>
      </>
    );
  }

  return (
    <Elements options={{ clientSecret: clientSecret }} stripe={stripePromise}>
      <Complete></Complete>
    </Elements>
  );
}
function Complete() {
  const stripe = useStripe();
  const [message, setMessage] = useState<string | undefined>(undefined);
  const { setCart } = useContext(CartContext);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );
  const orderId = new URLSearchParams(window.location.search).get("orderId");

  useEffect(() => {
    if (stripe && user) {
      // Retrieve the "payment_intent_client_secret" query parameter appended to
      // your return_url by Stripe.js

      // Retrieve the PaymentIntent
      stripe
        .retrievePaymentIntent(clientSecret!)
        .then(({ paymentIntent }) => {
          // Inspect the PaymentIntent `status` to indicate the status of the payment
          // to your customer.
          //
          // Some payment methods will [immediately succeed or fail][0] upon
          // confirmation, while others will first enter a `processing` state.
          //
          // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification

          switch (paymentIntent!.status) {
            case "succeeded":
              if (localStorage.getItem("cart")) {
                localStorage.removeItem("cart");
              }
              setCart([]);
              setMessage("Success! Payment received.");
              break;

            case "processing":
              setMessage(
                "Payment processing. We'll update you when payment is received."
              );
              break;

            case "requires_payment_method":
              // Redirect your user back to your payment page to attempt collecting
              // payment again
              fetch
                .delete(`api/orderhistory/${orderId}`)
                .then()
                .catch((e) => console.log(e));
              setMessage("Payment failed. Please try another payment method.");
              break;

            default:
              fetch
                .delete(`api/orderhistory/${orderId}`)
                .then()
                .catch((e) => console.log(e));
              setMessage("Something went wrong! Please try again later.");
              break;
          }
        })
        .catch(() => {
          fetch
            .delete(`api/orderhistory/${orderId}`)
            .then()
            .catch((e) => console.log(e));

          setMessage("Something went wrong! Please try again later.");
        });
    }

    // if (!isLoading && !user) {
    //   if (orderId) {
    //     fetch
    //       .delete(`api/orderhistory/${orderId}`)
    //       .then()
    //       .catch((e) => console.log(e));
    //   }
    //   setMessage(
    //     "Payment canceled. You must be signed in to complete your order."
    //   );
    //   if (orderId) {
    //     fetch
    //       .delete(`api/orderhistory/${orderId}`)
    //       .then()
    //       .catch((e) => console.log(e));
    //   }
    // }
    if (isLoading) {
      setIsLoading(false);
    }
  }, [stripe, user, isLoading]);

  if (isLoading) {
    return (
      <div className="max-w-[1500px] mx-auto p-4">
        <p className="text-center text-lg font-bold">
          Awaiting payment status...
        </p>
        <div className="loading-circle mt-4 mx-auto"></div>
      </div>
    );
  }
  return (
    <div className="max-w-[1500px] mx-auto p-4">
      <h2 className="text-center text-2xl font-bold">{message}</h2>
      <br />
      <p className="text-center text-lg">
        <Link
          className="text-blue-700 dark:text-blue-400"
          to="/"
          replace={true}
        >
          Click here to return to home.
        </Link>
      </p>
    </div>
  );
}

export default CheckoutComplete;
