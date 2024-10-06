import React, { useContext } from "react";
import noProductImage from "../assets/images/no_product_image.jpg";
import { trimString } from "../utilities/trimString";
import { ProductType, ReviewInfoType } from "../types/ProductType";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  OverlayArrow,
  Tooltip,
  TooltipTrigger,
} from "react-aria-components";
import { Link } from "@tanstack/react-router";
import { IconCheck, IconStar, IconStarHalf, IconX } from "@tabler/icons-react";
import {
  CartContext,
  CartItemsType,
  CartItemZodSchema,
} from "../context/CartContext";

type ProductCardProps = {
  orientation?: "row" | "col";
  item: ProductType;
  isScreenSizeLarge: boolean;
  reviewInfo?: ReviewInfoType[];
  cartList?: string[];
};
export const calculateStars = (rating?: number) => {
  if (typeof rating !== "number") return {};
  const starCount = rating - (rating % 0.5);
  let starsArr = [];

  let starCounter = starCount;
  while (starCounter > 0) {
    if (starCounter === 0.5) {
      starCounter -= 0.5;
      starsArr.push(0.5);
    } else {
      starCounter--;
      starsArr.push(1);
    }
  }
  if (starsArr.length < 5) {
    for (let i = starsArr.length; i < 5; i++) {
      starsArr.push(0);
    }
  }
  starsArr = starsArr.map((value, i) => {
    const sizeInPx = 18;
    if (value === 0.5) {
      return (
        <IconStarHalf
          key={i}
          color="orange"
          fill="orange"
          stroke={1}
          width={sizeInPx}
          height={sizeInPx}
        />
      );
    } else if (value === 1) {
      return (
        <IconStar
          key={i}
          color="orange"
          fill="orange"
          stroke={1}
          width={sizeInPx}
          height={sizeInPx}
        />
      );
    } else {
      //0 star
      return (
        <IconStar
          key={i}
          color="orange"
          fill="white"
          stroke={1}
          width={sizeInPx}
          height={sizeInPx}
          className="dark:fill-black"
        />
      );
    }
  });
  const stars = <div className="flex items-center">{starsArr}</div>;
  return { starCount, stars };
};

function ProductCard({
  orientation = "row",
  item,
  isScreenSizeLarge,
  reviewInfo,
  cartList,
}: ProductCardProps) {
  const review = reviewInfo?.find((review) => review._id === item._id);

  const { starCount, stars } = calculateStars(review?.rating_average);
  const { cart, setCart } = useContext(CartContext);

  const handleAddToCart = (
    cartQuantity = 1,
    {
      _id = "",
      name,
      brand,
      quantity,
      retail_price,
      price,
      discount,
      category,
      image_src,
    }: ProductType
  ) => {
    const cartItem: CartItemsType = {
      _id,
      name,
      brand,
      retail_price,
      price,
      discount,
      category,
      image_src,
      quantity,
      cart_quantity: cartQuantity,
    };
    const cartWithoutDupes = cart.filter((d) => d._id !== _id);
    if (cartWithoutDupes.length !== cart.length) {
      const dupedItem = cart.find((product) => product._id === _id);

      if (dupedItem) {
        dupedItem.cart_quantity++;
        setCart([...cartWithoutDupes, dupedItem]);
        localStorage.setItem(
          "cart",
          JSON.stringify([...cartWithoutDupes, dupedItem])
        );
      }
      return;
    }

    const storedCartItem = CartItemZodSchema.safeParse(cartItem);
    if (storedCartItem.success) {
      setCart([...cart, storedCartItem.data]);
      localStorage.setItem(
        "cart",
        JSON.stringify([...cart, storedCartItem.data])
      );
    } else {
      console.error("error occured while adding items to cart.");
    }
  };
  const subtotal = cart.reduce(
    (prev, product) => prev + product.price * product.cart_quantity,
    0
  );

  return (
    <div
      className={`product-card shadow-around dark:shadow-none dark:border-gray-900 p-2 lg:px-6 lg:pt-4 lg:pb-6 ${orientation === "col" && "h-full"} rounded-md dark:bg-dark-secondary-gray bg-white`}
    >
      <div
        className={`product-content flex ${"flex-" + orientation} gap-4 ${orientation === "col" && "h-full"}`}
      >
        <div className="section1 flex-[2] lg:flex-1 flex items-center justify-center max-w-[220px]">
          <Link
            to={`/shop/product/$productId`}
            params={{ productId: item._id }}
          >
            <img
              className="aspect-auto"
              src={item.image_src || noProductImage}
              alt={item.image_src ? item.image_src : "No product image"}
            />
          </Link>
        </div>
        <div
          className={`section2 flex flex-col flex-[3] lg:flex-[2] lg:flex-${orientation} lg:justify-evenly`}
        >
          <div className="sub1 lg:flex flex-col lg:flex-1 lg:pt-6 lg:pb-2">
            <p>
              <span className="text-neutral-600 uppercase text-xs dark:text-neutral-300">
                {item.brand}
              </span>
            </p>
            <Link
              className="hover:text-blue-600 dark:hover:text-blue-400"
              to={`/shop/product/$productId`}
              params={{ productId: item._id }}
            >
              <p className="lg:font-semibold">
                {isScreenSizeLarge
                  ? trimString(item.name, 200)
                  : trimString(item.name)}
              </p>
            </Link>
            {review && review.rating_count > 0 && (
              <TooltipTrigger delay={100}>
                <div className="review-container cursor-pointer w-max">
                  <Link
                    to={"/shop/product/$productId"}
                    params={{ productId: item._id }}
                  >
                    <div className="ratings flex items-center">
                      <Button className={"flex items-center"}>
                        {stars}
                        <span className="rating-count ml-[2px]">
                          ({review.rating_count})
                        </span>
                      </Button>
                    </div>
                  </Link>
                </div>
                <Tooltip
                  placement="bottom"
                  className={
                    "bg-neutral-100 relative text-black z-20 p-2 rounded-sm shadow-xl border border-gray-600"
                  }
                  offset={8}
                >
                  <OverlayArrow>
                    <svg
                      className="dark:fill-[white] fill-[#7a7a7a]"
                      width={12}
                      height={12}
                      viewBox="0 0 8 8"
                    >
                      <path d="M0 0 L4 4 L8 0" />
                    </svg>
                  </OverlayArrow>
                  <p className="font-bold z-50">{starCount} out of 5 stars</p>
                  <p className="text-sm z-50">
                    {review.rating_count} total reviews
                  </p>
                </Tooltip>
              </TooltipTrigger>
            )}
            <p
              className={`text-neutral-500 text-sm dark:text-neutral-300 hidden lg:block`}
            >
              item #: {item._id}
            </p>
          </div>

          <div
            className={`sub2 lg:flex flex-col lg:flex-1 ${orientation === "row" ? "items-end" : "items-start"} gap-1 ${orientation === "col" && "justify-end"}`}
          >
            <p
              className={`text-neutral-500 text-sm dark:text-neutral-300 lg:hidden`}
            >
              item #: {item._id}
            </p>
            {item.retail_price > item.price && (
              <p>
                <span className="line-through text-sm text-neutral-500 dark:text-neutral-200">
                  ${item.retail_price.toFixed(2)}
                </span>
              </p>
            )}
            {/* {item.retail_price === item.price && (
              <div className="lg:h-[24px]"></div>
            )} */}
            <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
            {item.discount! <= 0 && orientation === "col"
              ? // <p className="h-[16px]"></p>
                null
              : null}
            {item.discount! > 0 && (
              <p className="bg-red-600 text-white w-fit text-xs px-1 rounded-sm font-semibold tracking-wider mb-1">
                <span>Save </span>
                <span>{(item.discount! * 100).toFixed(0)}%</span>
              </p>
            )}
            <p>
              <span className="text-blue-600 dark:text-blue-400 font-semibold italic">
                Free Shipping
              </span>
            </p>
            {item.quantity < 10 && (
              <p className="text-orange-700 dark:text-orange-500">
                Only a few left!
              </p>
            )}
            <div className="hidden lg:block">
              <DialogTrigger>
                <Button
                  className={({ isFocusVisible, isHovered }) =>
                    `shadow-sm text-neutral-950 px-2 py-[.15rem] rounded-md ${cartList?.includes(item._id) ? `bg-gray-200 outline outline-gray-400 ${isHovered && "bg-gray-300"} ${isFocusVisible && "bg-gray-300 ring-2 ring-blue-700 ring-offset-2"}` : `bg-orange-400 outline outline-orange-500 ${isHovered && "bg-orange-500"} ${isFocusVisible && "bg-orange-500 ring-offset-2 ring-2 ring-blue-700"}`}`
                  }
                  onPress={() => handleAddToCart(1, item)}
                >
                  {cartList?.includes(item._id) ? (
                    <span className="flex items-center justify-between">
                      <IconCheck size={16} className="mr-1" />
                      Item in cart
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
                <ModalOverlay
                  isDismissable={true}
                  className={
                    "fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
                  }
                >
                  <Modal
                    isDismissable={true}
                    className={
                      "addToCart-modal fixed top-0 right-0 bottom-0 max-w-[250px] bg-[rgba(0,0,0,0.8)] p-2 dark:bg-gray-800 bg-white rounded-md z-40"
                    }
                  >
                    <Dialog className="p-4 rounded-md">
                      {({ close }) => (
                        <div>
                          <div className="flex justify-end items-center">
                            <Button
                              className={`data-[hovered]:text-gray-400`}
                              onPress={() => close()}
                            >
                              <span>
                                <IconX></IconX>
                              </span>
                            </Button>
                          </div>
                          <Heading
                            slot="title"
                            className="text-xl font-bold py-2 text-center"
                          >
                            Added to Cart
                          </Heading>
                          <p className="text-center font-bold text-red-500 border-b pb-2">
                            Subtotal: $<span>{subtotal.toFixed(2)}</span>
                          </p>
                          <div className="cart-body">
                            <div className="cart-product-details py-2">
                              {item.image_src && (
                                <img
                                  src={item.image_src}
                                  alt={item.name}
                                  height={100}
                                ></img>
                              )}
                              <Link
                                to="/shop/product/$productId"
                                params={{ productId: item._id }}
                                tabIndex={0}
                              >
                                <p>{trimString(item.name)}</p>
                              </Link>
                              <p>${item.price.toFixed(2)}</p>
                            </div>
                            <div className="cart-btns flex flex-col gap-2 py-2">
                              <Link to={"/cart"} tabIndex={0}>
                                <p className="text-center bg-orange-400 text-black rounded-full font-normal p-1 h-[30px] flex items-center justify-center hover:bg-orange-300">
                                  <span>Go to Cart</span>
                                </p>
                              </Link>
                              <Button onPress={() => close()}>
                                <p className="text-center bg-orange-400 text-black rounded-full p-1 font-normal h-[30px] flex items-center justify-center hover:bg-orange-300">
                                  <span>Continue Shopping</span>
                                </p>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Dialog>
                  </Modal>
                </ModalOverlay>
              </DialogTrigger>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
