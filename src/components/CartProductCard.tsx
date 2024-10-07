import React, { useState } from "react";
import { CartItemsType } from "../context/CartContext";
import no_product_image from "../assets/images/no_product_image.jpg";
import { trimString } from "../utilities/trimString";
import {
  Button,
  Group,
  Input,
  Label,
  NumberField,
} from "react-aria-components";
import { IconTrash } from "@tabler/icons-react";

type CartProductCardProps = {
  product: CartItemsType;
  handleQuantityChange: (value: number, product: CartItemsType) => void;
  // cart: CartItemsType[];
  // setCart: React.Dispatch<React.SetStateAction<CartItemsType[]>>;
};

function CartProductCard({
  product,
  handleQuantityChange,
}: CartProductCardProps) {
  const [productQuantity, setProductQuantity] = useState(product.cart_quantity);

  return (
    <div className="cart-product-card dark:bg-dark-secondary-gray mb-4 bg-white shadow-around dark:shadow-none">
      <div className="product-details flex gap-4">
        <div className="product-image flex-1">
          <img
            src={product.image_src || no_product_image}
            alt={
              product.image_src ? product.name : "No product image available"
            }
          />
        </div>
        <div className="product-sub-details flex-[3]">
          <p className="text-lg">{trimString(product.name)}</p>
          {product.price < product.retail_price && (
            <p className="line-through text-base">${product.retail_price}</p>
          )}
          <p className="text-lg font-bold">
            $<span className="">{product.price}</span>
          </p>
          <p>Free Shipping</p>
          <p>
            {product.quantity > 0 && (
              <span className="text-[#018786] dark:text-[#03dac6]">
                In Stock
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="cart-details flex gap-3 py-3 px-[2px] ml-3">
        <div className="product-quantity">
          <NumberField
            value={productQuantity}
            onChange={(v: number) => {
              setProductQuantity(v);
              handleQuantityChange(v, product);
            }}
            minValue={0}
            className="text-center"
          >
            <Label aria-label="product quantity"></Label>
            <Group
              className={`[box-shadow:0px_0px_2px_#c3c3c3] dark:[box-shadow:0px_0px_2px_white] rounded-md flex`}
            >
              <Button
                slot="decrement"
                className={({ isHovered, isFocusVisible }) =>
                  `text-2xl font-bold min-w-[32px] rounded-l-md border-r dark:border-r-neutral-500 flex justify-center items-center ${isFocusVisible || isHovered ? "bg-neutral-200 dark:bg-[#2e2e2e]" : ""}`
                }
              >
                {productQuantity <= 1 ? <IconTrash /> : "-"}
              </Button>
              <Input
                className={`w-20 text-center text-black text-lg dark:text-white dark:bg-gray-900`}
              />
              <Button
                slot="increment"
                className={({ isHovered, isFocusVisible }) =>
                  `h-full text-2xl font-bold min-w-[32px] rounded-r-md flex justify-center items-center border-l dark:border-l-neutral-500 ${isFocusVisible || isHovered ? "bg-neutral-200 dark:bg-[#2e2e2e]" : ""}`
                }
              >
                +
              </Button>
            </Group>
          </NumberField>
        </div>
        <div className="cart-delete-section flex">
          <Button
            className={({ isFocusVisible, isHovered }) =>
              `rounded-full px-2 py-1 [box-shadow:0px_0px_2px_#c3c3c3] dark:[box-shadow:0px_0px_2px_white] ${isFocusVisible || isHovered ? "bg-neutral-200 dark:bg-[#2e2e2e]" : ""}`
            }
            onPress={() => handleQuantityChange(0, product)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartProductCard;
