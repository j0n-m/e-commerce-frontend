import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart } = useContext(CartContext);

  return (
    <div className="page-container mx-5 my-2 flex gap-8">
      <div className="cartCard border flex-[3] p-4">
        <h1 className="border-b-2 text-3xl tracking-wide pb-2">
          Shopping Cart
        </h1>
        <div className="cart-details pt-2">
          <p className="text-2xl font-extralight">Your cart is empty</p>
          <a href="/" className="text-purple-600 hover:underline">
            Shop today's deals
          </a>
        </div>
      </div>
      <div className="payment-section border flex-1 p-4">
        <form>
          <p>
            <span className="font-bold">Subtotal: </span>$0.00
          </p>
          <div className="payment-btn flex justify-center">
            {cart.length > 0 && (
              <button
                type="button"
                disabled={true}
                className="rounded-md bg-zinc-400 p-2 text-neutral-50 cursor-not-allowed"
              >
                Proceed to checkout
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cart;
