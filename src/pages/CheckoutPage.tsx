import { IconLock } from "@tabler/icons-react";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Button, Radio, RadioGroup } from "react-aria-components";
import {
  PaymentElement,
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import fetch from "../utilities/fetch";
import { queryClient } from "../App";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { trimString } from "../utilities/trimString";
import isAuthenticated from "../utilities/isAuthenticated";
import { Link, useNavigate } from "@tanstack/react-router";
import useAuth from "../hooks/useAuth";
import { AxiosError } from "axios";

function CheckoutPage() {
  const { cart } = useContext(CartContext);
  // const { customer } = useContext(PaymentContext);
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [shippingCode, setShippingCode] = useState("1");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
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
    queryKey: ["payment", { shippingCode: +shippingCode, user: user?.id }],

    queryFn: () => {
      return fetch.post(`api/update-intent/${paymentIntentId}`, {
        cart: cart,
        shippingCode: +shippingCode,
        userId: user?.id,
      });
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!paymentIntentId,
    placeholderData: keepPreviousData,
  });
  // console.log();

  // const contactsList: ContactOption[] = [
  //   (customer as ContactOption) ?? {
  //     name: "Placeholder name",
  //     address: {
  //       line1: "123 Main st.",
  //       city: "Kansas City",
  //       state: "MO",
  //       postal_code: "64110",
  //       country: "US",
  //     },
  //   },
  // ];

  const cartItemsCount = cart.reduce(
    (prev, item) => prev + item.cart_quantity,
    0
  );

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    console.log("trying to submit payment");
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }
    try {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        await navigate({ to: "/signin", replace: true });
      } else {
        //call mutate to send updated customer shipping info

        const { error } = await stripe.confirmPayment({
          //`Elements` instance that was used to create the Payment Element
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/complete${`?customerId=${user?.id}`}&pId=${paymentIntentId}`,
          },
        });
        if (error) {
          console.log("error in submitting form");
          setIsFormSubmitting(false);
          // This point will only be reached if there is an immediate error when
          // confirming the payment. Show error to your customer (for example, payment
          // details incomplete)

          setErrorMessage(error.message);
        } else {
          console.log("submitted payment");
          // Your customer will be redirected to your `return_url`. For some payment
          // methods like iDEAL, your customer will be redirected to an intermediate
          // site first to authorize the payment, then redirected to the `return_url`.
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleShipping = async (shipCode: number) => {
    try {
      const updatePaymentQuery = await queryClient.fetchQuery({
        queryKey: ["payment", { shippingCode: shipCode, userId: user?.id }],

        queryFn: () => {
          return fetch.post(`api/update-intent/${paymentIntentId}`, {
            cart: cart,
            shippingCode: shipCode,
            userId: user?.id,
          });
        },
        staleTime: 1000 * 60 * 5,
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
    //updates cart total after initial query
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

  // if (isStripeLoading) {
  //   console.log("loading stripe...");
  // }
  // if (shippingQuery.isLoading) {
  //   return <p>Loading</p>;
  // }
  if (shippingQuery.isError) {
    console.log(shippingQuery.error);
    return (
      <section className="text-center mt-4">
        <h2 className="text-xl font-bold">
          An Error occurred. {shippingQuery.error.message}.{" "}
          {(shippingQuery.error as AxiosError).response?.statusText}.
        </h2>
        <p>
          Please try again later. If this error keeps occurring, please contact
          us.{" "}
        </p>
      </section>
    );
  }
  if (shippingQuery.isSuccess) {
    console.log("shippingquery", shippingQuery.data.data);
  }

  return (
    <>
      <header>
        <div className="header flex p-4 justify-between items-center bg-white dark:bg-gray-900 dark:border-b dark:border-b-gray-800 dark:text-neutral-300">
          <div className="logo flex items-center">
            <Link to="/" replace={true}>
              <span className="logo text-2xl uppercase items-stretch tracking-wider">
                Cyber Den
              </span>
            </Link>
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
      <main className="p-4">
        {isStripeLoading || shippingQuery.isLoading ? (
          // <div className="text-center">
          //   <p className="text-lg font-bold">Loading Payment Form...</p>
          //   <p className="text-sm">
          //     If payment form doesn't load after a few seconds, retry again
          //     soon.
          //   </p>
          // </div>
          <div className="loading-circle mx-auto"></div>
        ) : (
          <form
            onSubmit={handlePaymentSubmit}
            className="flex flex-col gap-4 lg:flex-row lg:gap-8 relative"
          >
            <div className="left lg:flex-[3]">
              <p>
                <Link
                  to="/cart"
                  replace={true}
                  className="underline underline-offset-2"
                >
                  Back to cart
                </Link>
              </p>
              <h2 className="font-bold mt-4 text-lg">Shipping Address</h2>
              <AddressElement
                className="mt-2"
                options={{
                  mode: "shipping",
                  allowedCountries: ["US"],
                  autocomplete: { mode: "automatic" },
                  contacts: shippingQuery?.data?.data?.shipping?.name
                    ? [
                        {
                          address: shippingQuery?.data?.data.shipping.address,
                          name: shippingQuery?.data?.data.shipping.name,
                        },
                      ]
                    : undefined,
                }}
              />

              <br />
              <h2 className="font-bold text-lg">Payment Method</h2>
              <PaymentElement
                className="mt-2"
                options={{ layout: { type: "tabs", defaultCollapsed: true } }}
              />
              <div className="mt-6">
                <h2 className="font-bold text-lg">Delivery Options</h2>
                <RadioGroup
                  aria-label="Choose delivery option"
                  defaultValue={shippingCode}
                  isDisabled={
                    !stripe ||
                    !paymentIntentId ||
                    !amount?.total ||
                    isFormSubmitting
                  }
                  className={`group mt-2`}
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
                <h2 className="font-bold text-lg">Review Items</h2>
                {cart.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="review-items-card mt-2 p-2 shadow-card border dark:border-[#3c3d4c] dark:bg-[#30313d] rounded-lg"
                    >
                      <p>{trimString(item.name, 80)}</p>
                      <p>Qty: {item.cart_quantity}</p>
                      <p>
                        ${(item.price * item.cart_quantity).toFixed(2)}
                        {item.cart_quantity > 1 && "/each"}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <div className="lg:hidden divider dark:bg-a3sd bg-neutral-200 mb-4"></div>
                <div className="summary lg:hidden shadow-card border dark:border-[#3c3d4c] bg-white dark:bg-[#30313d] p-4 rounded-md">
                  <h2 className="font-bold text-2xl">Order Summary</h2>
                  <p className="mt-2">
                    Subtotal: $
                    {amount?.cartTotal.toFixed(2) ?? "calculating..."}
                  </p>
                  <p>
                    Shipping: ${amount?.shipping.toFixed(2) ?? "calculating..."}
                  </p>
                  <p>
                    Total amount: $
                    {amount?.total.toFixed(2) ?? "calculating..."}
                  </p>
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  isDisabled={
                    !stripe ||
                    !paymentIntentId ||
                    !amount?.total ||
                    isFormSubmitting ||
                    shippingQuery.isFetching
                  }
                  className={({ isDisabled }) =>
                    `mt-6 py-2 px-4 ${isDisabled ? "bg-gray-400 cursor-not-allowed text-black" : "bg-[#ff914d] dark:text-black hover:bg-[#ff914d]/90"}`
                  }
                >
                  SUBMIT PAYMENT
                </Button>
                {!paymentIntentId && (
                  <p className="text-[#e31a00] dark:text-[#FF1E00] mt-2 text-lg tracking-tight">
                    An error occurred while creating your transaction.
                  </p>
                )}
                {errorMessage && (
                  <div className="mt-2">
                    <p className="text-[#e31a00] dark:text-[#FF1E00] text-lg tracking-tight">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="right hidden relative lg:block lg:relative lg:flex-[1] border-l border-l-gray-300 dark:border-l-neutral-600 px-4 pb-4">
              <div className="summary sticky top-4 shadow-card border dark:border-[#3c3d4c] bg-white dark:bg-[#30313d] p-4 rounded-md">
                <h2 className="font-bold text-xl">Order Summary</h2>
                <p>
                  Subtotal: ${amount?.cartTotal.toFixed(2) ?? "calculating..."}
                </p>
                <p>
                  Shipping: ${amount?.shipping.toFixed(2) ?? "calculating..."}
                </p>
                <p>
                  Total amount: ${amount?.total.toFixed(2) ?? "calculating..."}
                </p>
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
