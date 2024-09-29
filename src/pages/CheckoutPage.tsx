import { IconLock } from "@tabler/icons-react";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Button, Label, Radio, RadioGroup } from "react-aria-components";
import {
  PaymentElement,
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentContext } from "../context/PaymentSecretContext";
import { ContactOption } from "@stripe/stripe-js";
import fetch from "../utilities/fetch";
import { queryClient } from "../App";
import { useQuery } from "@tanstack/react-query";
import { trimString } from "../utilities/trimString";
import isAuthenticated from "../utilities/isAuthenticated";
import { Link, useNavigate } from "@tanstack/react-router";
import useAuth from "../hooks/useAuth";

function CheckoutPage() {
  const { cart, setCart } = useContext(CartContext);
  const { customer } = useContext(PaymentContext);
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [shippingCode, setShippingCode] = useState("1");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isStripeLoading, setIsStripeLoading] = useState(true);
  const [amount, setAmount] = useState<null | {
    total: number;
    shipping: number;
    cartTotal: number;
  }>();
  const navigate = useNavigate();

  //on initial component load, stripe is still resolving
  const stripe = useStripe();
  const elements = useElements();

  const shippingQuery = useQuery({
    queryKey: ["payment", { shippingCode: +shippingCode }],

    queryFn: () => {
      console.log("initial fetch for cart totals");
      return fetch.post(
        `http://localhost:3000/api/update-intent/${paymentIntentId}`,
        {
          cart: cart,
          shippingCode: +shippingCode,
        }
      );
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!paymentIntentId,
  });
  // const handleQuantityChange = (value: number, product: CartItemsType) => {
  //   let newCart = [...cart];

  //   if (value <= 0) {
  //     newCart = newCart.filter((p) => p._id !== product._id);
  //   } else {
  //     const currentProductIndex = newCart.findIndex(
  //       (p) => p._id === product._id
  //     );
  //     if (currentProductIndex !== -1) {
  //       newCart[currentProductIndex].cart_quantity = value;
  //     }
  //   }

  //   localStorage.setItem("cart", JSON.stringify(newCart));
  //   setCart(newCart);
  // };

  // const md = queryClient.getMutationCache()?.find({ mutationKey: ["checkout"] })
  //   ?.state?.data;
  // console.log("query client -> ", md);

  // const today = new Date();
  // const month = today.getMonth();
  // const day = today.getDate();

  const contactsList: ContactOption[] = [
    (customer as ContactOption) ?? {
      name: "Placeholder name",
      address: {
        line1: "123 Main st.",
        city: "Kansas City",
        state: "MO",
        postal_code: "64110",
        country: "US",
      },
    },
  ];

  const cartItemsCount = cart.reduce(
    (prev, item) => prev + item.cart_quantity,
    0
  );

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("trying to submit payment");
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      navigate({ to: "/signin", replace: true });
    }
    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/checkout/complete",
      },
    });
    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    console.log("submitted payment");
  };
  const handleShipping = async (shipCode: number) => {
    try {
      const updatePaymentQuery = await queryClient.fetchQuery({
        queryKey: ["payment", { shippingCode: shipCode }],

        queryFn: () => {
          console.log("called handleshipping query");
          return fetch.post(
            `http://localhost:3000/api/update-intent/${paymentIntentId}`,
            {
              cart: cart,
              shippingCode: shipCode,
            }
          );
        },
        staleTime: 1000 * 60 * 3,
      });
      const newAmount = updatePaymentQuery.data.amount;
      if (newAmount) {
        console.log("handleshipping setAmount", newAmount);
        setAmount(newAmount);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect(() => {
  //   if (stripe && clientSecret) {
  //     console.log("handling shipping on mounnt");
  //     handleShipping(1);
  //   }
  // }, [stripe]);

  if (shippingQuery.isSuccess && !amount) {
    console.log("success in initial query!");
    const newAmount = shippingQuery.data.data.amount;
    if (newAmount) {
      setAmount(newAmount);
    }
  }

  useEffect(() => {
    const redirect = async () => {
      await navigate({ to: "/signin", replace: true });
    };
    if (!user) {
      redirect();
    }
    if (stripe) {
      setIsStripeLoading(false);
      const cachedResponseData = queryClient
        .getMutationCache()
        ?.find({ mutationKey: ["checkout"] })?.state?.data as Partial<{
        data: { paymentIntentId: string | undefined };
      }>;

      const paymentId: string = cachedResponseData?.data?.paymentIntentId
        ? cachedResponseData?.data.paymentIntentId
        : "";

      if (paymentId) {
        setPaymentIntentId(paymentId);
      }
    }
  }, [stripe, isStripeLoading, user]);

  if (isStripeLoading) {
    console.log("loading stripe...");
  }

  return (
    <>
      <header>
        <div className="header flex p-4 justify-around items-center bg-white dark:bg-gray-900 dark:border-b dark:border-b-gray-800 dark:text-neutral-300">
          <div className="logo flex items-center font-bold text-xl">
            <Link to="/">Cyber Den</Link>
          </div>
          <div className="header-name">
            <p className="flex items-center gap-1">
              <span className="text-xl font-bold">Checkout</span>
              <span className="text-lg">
                (
                <span className="font-bold text-blue-600 dark:text-blue-500">
                  {cartItemsCount} {cartItemsCount > 1 ? "items" : "item"}
                </span>
                )
              </span>
            </p>
          </div>
          <div className="checkout-logo hidden md:block">
            <p>
              <IconLock size={30}></IconLock>
            </p>
          </div>
        </div>
      </header>
      <main className="p-4 max-w-[1500px] mx-auto">
        {isStripeLoading ? (
          <div className="text-center">
            <p className="text-lg font-bold">Loading Payment Form...</p>
            <p className="text-sm">
              If payment form doesn't load after a few seconds, retry again
              soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handlePaymentSubmit}
            className="flex flex-col gap-4 lg:flex-row lg:gap-8 relative"
          >
            <div className="left lg:flex-[3]">
              <h2 className="font-bold">Shipping Address</h2>
              <AddressElement
                className="mt-2"
                options={{
                  mode: "shipping",
                  allowedCountries: ["US", "CA"],
                  autocomplete: { mode: "automatic" },
                  contacts: contactsList,
                }}
              />

              <br />
              <h2 className="font-bold">Payment Method</h2>
              <PaymentElement
                className="mt-2"
                options={{ layout: { type: "tabs", defaultCollapsed: true } }}
              />
              <div className="mt-4">
                <h2 className="font-bold">Delivery Options</h2>
                <RadioGroup
                  aria-label="Choose delivery option"
                  defaultValue={shippingCode}
                  isDisabled={!stripe || !paymentIntentId}
                  className={`group`}
                  onChange={(e) => {
                    setShippingCode(e);
                    handleShipping(+e);
                  }}
                >
                  <Radio
                    className={`radioBtn group-data-[disabled]:cursor-not-allowed`}
                    value="1"
                  >
                    <p className="flex flex-col min-w-[115px]">
                      <span>Standard</span>
                      <span className="text-sm">5 - 7 day delivery</span>
                    </p>
                    <span>(Free)</span>
                  </Radio>
                  <Radio
                    className={`radioBtn group-data-[disabled]:cursor-not-allowed`}
                    value="2"
                  >
                    <p className="flex flex-col min-w-[115px]">
                      <span>Express</span>
                      <span className="text-sm">3 - 5 day delivery</span>
                    </p>
                    <span>(+$5.99)</span>
                  </Radio>
                  <Radio
                    className={`radioBtn group-data-[disabled]:cursor-not-allowed`}
                    value="3"
                  >
                    <p className="flex flex-col min-w-[115px]">
                      <span>Next Day Air</span>
                      <span className="text-sm">1 day delivery</span>
                    </p>
                    <span>(+$15.99)</span>
                  </Radio>
                </RadioGroup>
              </div>

              <div className="cart-review mt-4">
                <h2 className="font-bold">Review Items</h2>
                {cart.map((item) => {
                  return (
                    <div className="review-items-card mt-2 p-2 shadow-card border dark:border-[#3c3d4c] dark:bg-[#30313d]">
                      <p>{trimString(item.name, 80)}</p>
                      <p>Qty: {item.cart_quantity}</p>
                      <p>${(item.price * item.cart_quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <div className="summary lg:hidden shadow-card border dark:border-[#3c3d4c] bg-white dark:bg-[#30313d] p-4 rounded-md">
                  <h2 className="font-bold text-2xl">Order Summary</h2>
                  <p>Subtotal: ${amount?.cartTotal ?? "calculating..."}</p>
                  <p>Shipping: ${amount?.shipping ?? "calculating..."}</p>
                  <p>Total amount: ${amount?.total ?? "calculating..."}</p>
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  isDisabled={!stripe || !paymentIntentId || !amount?.total}
                  className={({ isDisabled }) =>
                    `mt-4 py-2 px-4 ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-orange-400 dark:text-black"}`
                  }
                >
                  SUBMIT PAYMENT
                </Button>
                {!paymentIntentId && (
                  <p className="text-red-600">
                    An error occurred while creating your transaction.
                  </p>
                )}
                {errorMessage && (
                  <div>
                    <p className="text-red-600">{errorMessage}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="right hidden relative lg:block lg:relative lg:flex-[1] border-l border-l-gray-300 dark:border-l-neutral-600 px-4 pb-4">
              <div className="summary sticky top-4 shadow-card border dark:border-[#3c3d4c] bg-white dark:bg-[#30313d] p-4 rounded-md">
                <h2 className="font-bold text-xl">Order Summary</h2>
                <p>Subtotal: ${amount?.cartTotal ?? "calculating..."}</p>
                <p>Shipping: ${amount?.shipping ?? "calculating..."}</p>
                <p>Total amount: ${amount?.total ?? "calculating..."}</p>
              </div>
            </div>
          </form>
        )}
        <div className="h-[300px]"></div>
      </main>
    </>
  );
}

export default CheckoutPage;
