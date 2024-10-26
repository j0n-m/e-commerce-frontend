import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "@tanstack/react-router";
import { Link as LinkAria } from "react-aria-components";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import fetch from "../utilities/fetch";
import useAuth from "../hooks/useAuth";
import checkAndParseCart from "../utilities/checkAndParseCart";
import { queryClient } from "../App";
import { useMutation } from "@tanstack/react-query";
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
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const { cart, setCart } = useContext(CartContext);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );
  const customerId = new URLSearchParams(window.location.search).get(
    "customerId"
  );
  const paymentIntentId = new URLSearchParams(window.location.search).get(
    "pId"
  );

  const orderhistoryMutate = useMutation({
    mutationFn: async () =>
      await fetch.post(
        "api/orderhistory",
        {
          paymentIntentId,
          customerId,
          cart,
        },
        { withCredentials: true }
      ),
    onSuccess: async () => {
      await queryClient
        .invalidateQueries({ queryKey: ["orderhistory"] })
        .catch((e) => console.error(e));
      await queryClient
        .invalidateQueries({ queryKey: ["product"] })
        .catch((e) => console.error(e));
      setCart([]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (stripe && user) {
      // Retrieve the "payment_intent_client_secret" query parameter appended to
      // your return_url by Stripe.js

      // Retrieve the PaymentIntent
      stripe
        .retrievePaymentIntent(clientSecret!)
        .then(({ paymentIntent }) => {
          // (paymentIntent.)
          // Inspect the PaymentIntent `status` to indicate the status of the payment
          // to your customer.
          //
          // Some payment methods will [immediately succeed or fail][0] upon
          // confirmation, while others will first enter a `processing` state.
          //
          // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification

          switch (paymentIntent!.status) {
            case "succeeded": {
              orderhistoryMutate.mutate();

              if (localStorage.getItem("cart")) {
                localStorage.removeItem("cart");
              }

              // setCart([]);
              setMessage("Success! Payment received.");
              setIsPaymentSuccess(true);
              break;
            }

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
              setMessage("Something went wrong! Please try again later.");
              break;
          }
        })
        .catch(() => {
          setMessage("Something went wrong! Please try again later.");
        });
    }

    if (isLoading) {
      setIsLoading(false);
    }
  }, [stripe, user, isLoading]);

  if (isLoading || !message) {
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
    <>
      <div className="p-4">
        <div className="border dark:border-a3sd border-a1s rounded-lg p-5">
          <h1 className="text-center text-2xl font-bold">
            {isPaymentSuccess ? "Order Complete" : "Payment Error"}
          </h1>
          <p className="text-center text-lg">{message}</p>
          <br />
          <p className="text-center text-lg">
            <LinkAria
              className="bg-blue-600 dark:bg-blue-500 text-a0d py-2 px-4 rounded-full"
              href="/"
              routerOptions={{ replace: true }}
            >
              Back to home
            </LinkAria>
          </p>
        </div>
      </div>
    </>
  );
}

export default CheckoutComplete;
