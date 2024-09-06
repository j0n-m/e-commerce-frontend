import { createContext, ReactNode, useState } from "react";

export type CartItemsType = {
  id: string;
  price: number;
  quantity: number;
};
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

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}
export { CartContext };
