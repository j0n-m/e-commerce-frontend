import { createContext, ReactNode, useEffect, useState } from "react";
import { z } from "zod";

export const CartItemZodSchema = z.object({
  _id: z.string(),
  name: z.string(),
  brand: z.string(),
  price: z.number(),
  retail_price: z.number(),
  quantity: z.number(),
  cart_quantity: z.number(),
  category: z.array(
    z.object({
      alias: z.string().optional(),
      _id: z.string(),
      name: z.string(),
    })
  ),
  image_src: z.string().optional(),
  discount: z.number().optional(),
});

export type CartItemsType = z.infer<typeof CartItemZodSchema>;

type CartContextType = {
  cart: CartItemsType[];
  setCart: React.Dispatch<React.SetStateAction<CartItemsType[]>>;
};

const initialCart: CartContextType = {
  cart: [],
  setCart: () => {},
};

type CartProviderProps = {
  children: ReactNode;
};

const CartContext = createContext(initialCart);

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItemsType[]>(initialCart.cart);
  useEffect(() => {
    if (localStorage.getItem("cart")) {
      const lsCart: CartItemsType[] = JSON.parse(
        localStorage.getItem("cart") || ""
      );

      const cartSchema = z.array(CartItemZodSchema).nonempty();
      const response = cartSchema.safeParse(lsCart);

      if (response.success) {
        setCart([...response.data]);
        localStorage.setItem("cart", JSON.stringify(response.data));
      } else {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}
export { CartContext };
