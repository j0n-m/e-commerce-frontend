import React, { useContext, useEffect, useState } from "react";
import { CartContext, CartItemsType } from "../context/CartContext";
import { Button } from "react-aria-components";
import CartProductCard from "./CartProductCard";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import fetch from "../utilities/fetch";
import { PaymentContext } from "../context/PaymentSecretContext";
import { IconAlertCircle } from "@tabler/icons-react";
import useAuth from "../hooks/useAuth";
import isAuthenticated from "../utilities/isAuthenticated";
import checkAndParseCart from "../utilities/checkAndParseCart";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const {
    clientSecret,
    setClientSecret,
    setCustomerSessionSecret,
    setPaymentAmount,
  } = useContext(PaymentContext);
  const [responseMessage, setResponseMessage] = useState<null | string>(null);
  const { user } = useAuth();
  const location = useLocation();

  const mutation = useMutation({
    mutationKey: ["checkout"],
    mutationFn: (cart: unknown) => {
      return fetch.post("api/create-payment-intent", { cart: cart });
    },
    onSuccess: (response) => {
      setClientSecret(response.data["clientSecret"]);
      const customerSession = response.data[
        "customer_session_client_secret"
      ] as string;
      if (customerSession.length > 0) {
        setCustomerSessionSecret(customerSession);
      }
      setPaymentAmount(response.data.payAmount || 0);

      // const customerData = response?.data?.customer as CustomerType | null;

      // setCustomer(customerData);

      // localStorage.setItem(
      //   "customer",
      //   JSON.stringify(response.data["customer"])
      // );
      console.log("response data", response.data);
    },
    onError: () => {
      setResponseMessage(
        "Unable to fullfill your order.\n Try again next time."
      );
    },
  });
  const navigate = useNavigate();
  const subtotal = cart.reduce(
    (prev, product) => prev + product.price * product.cart_quantity,
    0
  );
  const cartQuantity = cart.reduce(
    (prev, curr) => prev + curr.cart_quantity,
    0
  );
  const handleQuantityChange = (value: number, product: CartItemsType) => {
    let newCart = [...cart];

    if (value <= 0) {
      newCart = newCart.filter((p) => p._id !== product._id);
    } else {
      const currentProductIndex = newCart.findIndex(
        (p) => p._id === product._id
      );
      if (currentProductIndex !== -1) {
        newCart[currentProductIndex].cart_quantity = value;
      }
    }

    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };
  const handleCheckout = async () => {
    const isAuth = await isAuthenticated();
    if (!user || !isAuth) {
      return await navigate({
        to: "/signin",
        search: { from: location.pathname },
      });
    } else {
      const check = checkAndParseCart();
      if (!check.success) {
        window.location.reload(); //cart context will delete for no conforming to schema
      } else {
        console.log(check);
        mutation.mutate(cart);
      }
    }
  };
  useEffect(() => {
    if (mutation.isSuccess) {
      navigate({ to: "/checkout" });
    }
    // setIsLoading(false);
  }, [clientSecret]);

  return (
    <div className="page-container mx-2 max-w-[1800px] 2xl:mx-auto my-2 flex flex-col gap-8 lg:flex-row lg:mx-4">
      <div className="cartCard flex-[3]">
        <h1 className="text-3xl tracking-wide pb-4">Shopping Cart</h1>
        {cart.length <= 0 ? (
          <div className="cart-nothing p-3 bg-white dark:bg-dark-secondary-gray">
            <p className="text-2xl font-extralight">Your cart is empty.</p>
            <a href="/" className="text-purple-600 hover:underline">
              Shop today's deals
            </a>
          </div>
        ) : (
          <div className="cart-products">
            {cart.length > 0 &&
              cart.map((product) => {
                return (
                  <CartProductCard
                    key={product._id}
                    product={product}
                    handleQuantityChange={handleQuantityChange}
                  />
                );
              })}
          </div>
        )}
      </div>
      <div className="payment-section border-b lg:border-l lg:border-b-0 flex-1 p-4 -order-1 lg:order-1">
        <form className="p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Summary</h2>
          <p className="text-center lg:border-b pb-4">
            <span>Subtotal ({cartQuantity} items): </span>
            <span className="subtotal font-bold">${subtotal.toFixed(2)}</span>
          </p>
          <div className="payment-btn flex justify-center mt-4">
            {cart.length > 0 && (
              <Button
                isDisabled={mutation.isPending || mutation.isError}
                aria-label="Go to checkout"
                onPress={handleCheckout}
                type="button"
                className={({ isHovered, isFocusVisible, isDisabled }) =>
                  `rounded-full py-2 px-10 bg-[#0070ba] text-white uppercase text-base font-bold ${isFocusVisible || isHovered ? "bg-[#0069af]" : ""} ${isDisabled && "bg-gray-500"}`
                }
              >
                Secure Checkout
              </Button>
            )}
          </div>
          {responseMessage && (
            <p className="border whitespace-pre text-lg text-red-700 flex flex-col justify-center items-center gap-1 rounded-md p-2 my-4 text-center dark:bg-dark-secondary-gray dark:text-red-600 bg-white">
              <IconAlertCircle stroke={2} />
              <span>{responseMessage}</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Cart;
