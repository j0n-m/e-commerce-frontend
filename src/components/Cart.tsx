import React, { useContext } from "react";
import { CartContext, CartItemsType } from "../context/CartContext";
import { Button } from "react-aria-components";
import CartProductCard from "./CartProductCard";
import { useNavigate } from "@tanstack/react-router";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
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
    // setProductQuantity(value);
  };

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
                aria-label="Go to checkout"
                onPress={() => navigate({ to: "/checkout" })}
                type="button"
                className={({ isHovered, isFocusVisible }) =>
                  `rounded-full py-2 px-10 bg-[#0070ba] text-white uppercase text-base font-bold ${isFocusVisible || isHovered ? "bg-[#0069af]" : ""}`
                }
              >
                Secure Checkout
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cart;
