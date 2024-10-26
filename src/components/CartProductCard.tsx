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
import { Link } from "@tanstack/react-router";

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
        <div className="product-image bg-white flex flex-col justify-center">
          <Link
            to="/shop/product/$productId"
            params={{ productId: product._id }}
          >
            <img
              className="max-w-[150px] aspect-square object-contain"
              src={product.image_src || no_product_image}
              alt={
                product.image_src ? product.name : "No product image available"
              }
            />
          </Link>
        </div>
        <div className="product-sub-details flex-1">
          <Link
            to="/shop/product/$productId"
            params={{ productId: product._id }}
            className="hover:underline focus-visible:underline "
          >
            <p className="lg:text-lg">{trimString(product.name)}</p>
          </Link>
          {product.price < product.retail_price && (
            <p className="line-through text-base dark:text-a1d text-a1">
              ${product.retail_price}
            </p>
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
          {product.quantity < 10 && (
            <p className="text-orange-700 dark:text-orange-500">
              Only {product.quantity} left in stock!
            </p>
          )}
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
                  `py-1 px-2 min-w-[35px] rounded-l-md border-r dark:border-r-[#575757] flex justify-center items-center ${isFocusVisible || isHovered || isPressed ? "bg-[#EFEFEF] dark:bg-[#3f3f3f]" : "dark:bg-a2sd"}`
                }
              >
                {productQuantity <= 1 ? (
                  <IconTrash stroke={1.25} size={18} />
                ) : (
                  <IconMinus stroke={2} width={16} />
                )}
              </Button>
              <Input
                className={`w-20 min-h-[32px] text-center text-black text-lg dark:text-white dark:bg-[#121212]`}
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
                  `py-1 px-2 rounded-r-md flex justify-center items-center border-l dark:border-l-[#575757] ${isFocusVisible || isHovered || isPressed ? "bg-[#EFEFEF] dark:bg-[#3f3f3f]" : isDisabled ? "dark:text-a2d dark:bg-amenusd bg-a2s text-a2/60" : "dark:bg-a2sd"}`
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
