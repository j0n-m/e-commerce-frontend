import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
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
    if (!clientSecret) {
      redirect();
    } else {
      setIsLoading(false);
    }
  }, []);
  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  if (localStorage.getItem("cart")) {
    localStorage.removeItem("cart");
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

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    try {
      // Retrieve the PaymentIntent
      stripe.retrievePaymentIntent(clientSecret!).then(({ paymentIntent }) => {
        // Inspect the PaymentIntent `status` to indicate the status of the payment
        // to your customer.
        //
        // Some payment methods will [immediately succeed or fail][0] upon
        // confirmation, while others will first enter a `processing` state.
        //
        // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
        switch (paymentIntent!.status) {
          case "succeeded":
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
            setMessage("Payment failed. Please try another payment method.");
            break;

          default:
            setMessage("Something went wrong.");
            break;
        }
      });
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  }, [stripe]);
  return (
    <div className="max-w-[1500px] mx-auto p-4">
      <h2 className="text-center text-2xl font-bold">{message}</h2>
      <br />
      <p className="text-center text-lg">
        <Link className="text-blue-700 dark:text-blue-400" to="/">
          Click here to return to home.
        </Link>
      </p>
    </div>
  );
}

export default CheckoutComplete;
