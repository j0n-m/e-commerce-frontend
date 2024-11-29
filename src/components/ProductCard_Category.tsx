import { ProductType } from "../types/ProductType";
import noProductImage from "../assets/images/no_product_image.jpg";
import { calculateStars } from "./ProductCard";
import { trimString } from "../utilities/trimString";
import { Link } from "@tanstack/react-router";
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
import { IconCheck, IconX } from "@tabler/icons-react";
import { useContext } from "react";
import {
  CartContext,
  CartItemsType,
  CartItemZodSchema,
} from "../context/CartContext";

type ProductCard_CategoryProps = {
  product: ProductType;
  reviewIdMap: Map<string, number>;
  reviewTotalCountMap: Map<string, number>;
};

//Less than large screens => flex rows cards take full width
//Large screens => wrapped flex row of cards
function ProductCard_Category({
  product,
  reviewIdMap,
  reviewTotalCountMap,
}: ProductCard_CategoryProps) {
  const rating = reviewIdMap.get(product._id) || 0;
  const { cart, setCart } = useContext(CartContext);
  const { stars, starCount } = calculateStars(rating);
  const cartList = cart.map((p) => p._id);
  const subtotal = cart.reduce(
    (prev, product) => prev + product.price * product.cart_quantity,
    0
  );
  const totalReviews = reviewTotalCountMap.get(product._id);
  const handleAddToCart = (cartQuantity = 1, item: ProductType) => {
    const cartItem: CartItemsType = {
      _id: item._id,
      name: item.name,
      brand: item.brand,
      retail_price: item.retail_price,
      price: item.price,
      discount: item.discount,
      category: item.category,
      image_src: item.image_src,
      quantity: item.quantity,
      cart_quantity: cartQuantity,
    };
    const cartWithoutDupes = cart.filter((d) => d._id !== item._id);
    if (cartWithoutDupes.length !== cart.length) {
      const dupedItem = cart.find((product) => product._id === item._id);

      if (dupedItem) {
        const newCartQuantity = ++dupedItem.cart_quantity;
        if (newCartQuantity > cartItem.quantity) {
          dupedItem.cart_quantity = cartItem.quantity;
        } else {
          dupedItem.cart_quantity = newCartQuantity;
        }
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

  return (
    <div className="product-card flex gap-3 py-2 lg:w-[calc(100%/5-10px)] xl:w-[calc(100%/6-10px)] lg:flex-col">
      <div className="section-img bg-white flex flex-col lg:max-w-full">
        <Link
          to={`/shop/product/$productId`}
          params={{ productId: product._id }}
          className="active:underline"
        >
          <img
            className="max-w-[150px] lg:max-w-full aspect-square object-contain"
            src={product.image_src || noProductImage}
            alt={
              product.image_src ? product.name : "No Product Image Available"
            }
          />
        </Link>
      </div>
      <div className="section-content flex-1 lg:flex lg:flex-col">
        <Link
          to={`/shop/product/$productId`}
          params={{ productId: product._id }}
          className="active:underline"
        >
          <h2 className="lg:hidden">{trimString(product.name)}</h2>
          <h2 className="hidden lg:block">{trimString(product.name, 115)}</h2>
        </Link>
        {rating > 0 && (
          <div className="ratings-info-section max-w-max">
            <TooltipTrigger delay={100}>
              <Link
                to={`/shop/product/$productId`}
                params={{ productId: product._id }}
              >
                <Button className="flex gap-1 max-w-max">
                  {stars}
                  <span className="text-sm text-a1d">({totalReviews})</span>
                </Button>
              </Link>
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
                  {totalReviews}{" "}
                  {totalReviews && totalReviews > 1
                    ? "total reviews"
                    : "total review"}
                </p>
              </Tooltip>
            </TooltipTrigger>
          </div>
        )}
        <div className="inner lg:flex-1 lg:flex lg:flex-col lg:justify-end">
          {product?.discount ? (
            <p className="text-[#db1600] dark:text-[#FF3E29] inline-block max-w-max text-sm rounded-sm font-semibold tracking-wider mb-1">
              {/* <span>Save </span> */}
              <span>{(product.discount * 100).toFixed(0)}%</span>
              <span> Off</span>
            </p>
          ) : (
            ""
          )}
          <p>
            <span className="text-xl font-bold">${product.price}</span>
            {product.price < product.retail_price && (
              <span className="ml-3 line-through text-a1 dark:text-a1d">
                ${product.retail_price.toFixed(2)}
              </span>
            )}
          </p>
          <p>
            <span className="dark:text-[#62ABFD] text-[#0253B1]">
              Free Shipping
            </span>
          </p>
          <div className="btns hidden lg:block lg:mt-2">
            <DialogTrigger>
              <Button
                className={({ isFocusVisible, isHovered }) =>
                  `shadow-sm text-neutral-950 px-2 py-[.15rem] rounded-md ${cartList?.includes(product._id) ? `bg-gray-200 ${isHovered && "bg-gray-300"} ${isFocusVisible && "bg-gray-300 ring-2 ring-blue-700 ring-offset-2"}` : `bg-orange-400 ${isHovered && "bg-orange-500"} ${isFocusVisible && "bg-orange-500 ring-offset-2 ring-2 ring-blue-700"}`}`
                }
                onPress={() => handleAddToCart(1, product)}
              >
                {cartList?.includes(product._id) ? (
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
                            {product.image_src && (
                              <img
                                src={product.image_src}
                                alt={product.name}
                                className="object-contain mx-auto max-h-[180px]"
                              ></img>
                            )}
                            <Link
                              to="/shop/product/$productId"
                              params={{ productId: product._id }}
                              tabIndex={0}
                            >
                              <p>{trimString(product.name)}</p>
                            </Link>
                            <p>${product.price.toFixed(2)}</p>
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
  );
}

export default ProductCard_Category;
