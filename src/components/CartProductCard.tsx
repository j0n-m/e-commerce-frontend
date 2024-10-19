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
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";

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

  // dark:bg-[#30313d]
  return (
    <div className="cart-product-card bg-white dark:bg-a1sd border border-[#e6e6e6] dark:border-[#30313D] mb-4 rounded-sm">
      <div className="product-details flex gap-4 p-1">
        <div className="product-image">
          <img
            className="max-w-[150px]"
            src={product.image_src || no_product_image}
            alt={
              product.image_src ? product.name : "No product image available"
            }
          />
        </div>
        <div className="product-sub-details flex-1">
          <p className="lg:text-lg">{trimString(product.name)}</p>
          {product.price < product.retail_price && (
            <p className="line-through text-base">${product.retail_price}</p>
          )}
          <p className="text-lg font-bold">
            $<span className="">{product.price}</span>
          </p>
          <p>Free Shipping</p>
          <p>
            {product.quantity > 0 && (
              <span className="text-green-600 dark:text-[#22DD67]">
                In Stock
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="cart-details flex gap-3 p-1 mt-2">
        <div className="product-quantity flex">
          <NumberField
            value={productQuantity}
            onChange={(v: number) => {
              setProductQuantity(v);
              handleQuantityChange(v, product);
            }}
            minValue={0}
            maxValue={product.quantity}
            className="text-center flex"
          >
            <Label aria-label="product quantity"></Label>
            <Group className={`border dark:border-[#575757] rounded-md flex`}>
              <Button
                slot="decrement"
                className={({ isHovered, isFocusVisible, isPressed }) =>
                  `py-1 px-2 rounded-l-md border-r dark:border-r-[#575757] flex justify-center items-center ${isFocusVisible || isHovered || isPressed ? "bg-[#EFEFEF] dark:bg-[#3f3f3f]" : "dark:bg-a2sd"}`
                }
              >
                {productQuantity <= 1 ? (
                  <IconTrash stroke={1.25} size={18} />
                ) : (
                  <IconMinus stroke={2} width={16} />
                )}
              </Button>
              <Input
                className={`w-20 text-center text-black text-lg dark:text-white dark:bg-[#121212]`}
              />
              <Button
                slot="increment"
                isDisabled={productQuantity >= product.quantity}
                className={({
                  isHovered,
                  isFocusVisible,
                  isDisabled,
                  isPressed,
                }) =>
                  `py-1 px-2 rounded-r-md flex justify-center items-center border-l dark:border-l-[#575757] ${isFocusVisible || isHovered || isPressed ? "bg-[#EFEFEF] dark:bg-[#3f3f3f]" : isDisabled ? "dark:text-a2d dark:bg-amenusd" : "dark:bg-a2sd"}`
                }
              >
                <IconPlus size={16} stroke={2}></IconPlus>
              </Button>
            </Group>
          </NumberField>
        </div>
        <div className="cart-delete-section flex ml-2">
          <Button
            className={({ isFocusVisible, isHovered, isPressed }) =>
              `rounded-full text-sm px-2 border flex items-center justify-center dark:border-[#575757] ${isFocusVisible || isHovered || isPressed ? "bg-[#EFEFEF] dark:bg-[#3f3f3f]" : "dark:bg-a2sd"}`
            }
            onPress={() => handleQuantityChange(0, product)}
          >
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartProductCard;
