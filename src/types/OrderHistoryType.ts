import { CartItemsType } from "../context/CartContext";
import { ProductType } from "./ProductType";

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
export type OrderHistoryByCustomerType = [
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
    product_info: ProductType[];
  },
];
