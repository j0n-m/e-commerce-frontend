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
    <div className="cart-product-card bg-white dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#30313D] mb-4 rounded-sm">
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
              <span className="text-green-600 dark:text-[#22DD67]">
                In Stock
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="cart-details flex gap-3 py-3 px-[2px] ml-3">
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
                className={({ isHovered, isFocusVisible }) =>
                  `min-w-[32px] rounded-l-md border-r dark:border-r-[#575757] flex justify-center items-center ${isFocusVisible || isHovered ? "bg-[#EFEFEF] dark:bg-[#3f3f3f]" : ""}`
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
                className={({ isHovered, isFocusVisible }) =>
                  `min-w-[32px] rounded-r-md flex justify-center items-center border-l dark:border-l-[#575757] ${isFocusVisible || isHovered ? "bg-[#EFEFEF] dark:bg-[#3f3f3f]" : ""}`
                }
              >
                <IconPlus size={16} stroke={2}></IconPlus>
              </Button>
            </Group>
          </NumberField>
        </div>
        <div className="cart-delete-section flex">
          <Button
            className={({ isFocusVisible, isHovered }) =>
              `rounded-full text-sm px-2 py-1 border dark:border-[#575757] ${isFocusVisible || isHovered ? "bg-[#EFEFEF] dark:bg-[#3f3f3f]" : ""}`
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
