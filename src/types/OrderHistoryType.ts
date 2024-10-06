import { CartItemsType } from "../context/CartContext";

export type OrderHistoryType = [
  {
    _id: string;
    customer_id: string;
    order_date: string;
    cart_total: number;
    shipping: {
      code: number;
      cost: number;
    };
    cart: CartItemsType[];
  },
];
