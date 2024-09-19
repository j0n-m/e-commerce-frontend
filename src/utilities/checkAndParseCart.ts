import { z } from "zod";
import { CartItemZodSchema } from "../context/CartContext";

const cartSchema = z.array(CartItemZodSchema).nonempty();

export default function checkAndParseCart() {
  const ls_cart = localStorage.getItem("cart") || "[]";
  const cartItems = JSON.parse(ls_cart);

  const check = cartSchema.safeParse(cartItems);
  return check;
}
