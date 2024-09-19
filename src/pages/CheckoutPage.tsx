import { IconLock, IconPlus, IconX } from "@tabler/icons-react";
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Link } from "@tanstack/react-router";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentContext } from "../context/PaymentSecretContext";

function CheckoutPage() {
  const { cart, setCart } = useContext(CartContext);
  const [paymentMessage, setPaymentMessage] = useState("");
  const { clientSecret } = useContext(PaymentContext);

  console.log("checkoutPage is loaded, calling Elements");
  if (!clientSecret) {
    console.log("checkoutpage-returning");
    return;
  }
  const stripe = useStripe();
  const elements = useElements();

  const cartItemsCount = cart.reduce(
    (prev, item) => prev + item.cart_quantity,
    0
  );
  return (
    <>
      <header>
        <div className="header flex p-4 justify-around bg-white dark:bg-gray-900 dark:border-b dark:border-b-gray-800 dark:text-neutral-300">
          <div className="logo flex items-center font-bold text-xl">
            <Link to="/cart">Cyber Den</Link>
          </div>
          <div className="header-name">
            <p className="flex items-center gap-1">
              <span className="text-xl font-bold">Checkout</span>
              <span className="text-lg">
                (
                <span className="font-bold text-blue-600">
                  {cartItemsCount} {cartItemsCount > 1 ? "items" : "item"}
                </span>
                )
              </span>
            </p>
          </div>
          <div className="checkout-logo">
            <p>
              <IconLock size={30}></IconLock>
            </p>
          </div>
        </div>
      </header>
      <main className="p-2">
        <div>
          <DialogTrigger>
            <Button
              className={`border border-red-600 bg-white flex dark:text-black`}
            >
              <IconPlus stroke={1.25} size={22}></IconPlus>
              <span>Add a credit card</span>
            </Button>
            <ModalOverlay
              isDismissable={true}
              className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[3px] h-svh`}
            >
              <Modal
                isDismissable={true}
                className={`bg-light-primary-gray w-svw h-svh dark:text-black lg:w-[700px] lg:h-[500px] border border-purple-700 m-auto lg:mt-4`}
              >
                <Dialog className="border border-red-700">
                  {({ close }) => (
                    <>
                      <div className="header flex items-center border-b bg-white">
                        <p className="font-bold flex-1 text-center">
                          Add a credit card or debit card
                        </p>
                        <Button onPress={close} className={`py-3 px-4 border`}>
                          <IconX />
                        </Button>
                      </div>
                      <div className="m-4">
                        <form action="" className="bg-white">
                          <PaymentElement
                            options={{ layout: "tabs" }}
                            onChange={(e) => console.log(e)}
                          ></PaymentElement>
                          <div className="border bg-blue-500"></div>
                        </form>
                      </div>
                    </>
                  )}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </div>
      </main>
    </>
  );
}

export default CheckoutPage;
