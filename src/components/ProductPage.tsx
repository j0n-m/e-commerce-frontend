import { useSuspenseQuery } from "@tanstack/react-query";
import {
  orderHistoryByUserQuery,
  productReviewsQuery,
  singleProductQueryOption,
} from "../routes/shop/product/$productId";
import { getRouteApi, Link } from "@tanstack/react-router";
import { ProductType } from "../types/ProductType";
import noImage from "../assets/images/no_product_image.jpg";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  Section,
  Select,
  SelectValue,
} from "react-aria-components";
import { useContext, useEffect, useState } from "react";
import {
  IconCheck,
  IconChevronDown,
  IconPackageImport,
  IconTruckDelivery,
  IconX,
} from "@tabler/icons-react";
import {
  CartContext,
  CartItemsType,
  CartItemZodSchema,
} from "../context/CartContext";
import { trimString } from "../utilities/trimString";
import { SingleProductReview } from "../types/ReviewType";
import { calculateStars } from "./ProductCard";
import ExpandableReviewDescription from "./ExpandableReviewDescription";
import useAuth from "../hooks/useAuth";
import { queryClient } from "../App";
import { Helmet } from "react-helmet-async";

const route = getRouteApi("/shop/product/$productId");

function useProductPage({ productId }: { productId: string }) {
  const { data } = useSuspenseQuery(singleProductQueryOption(productId));
  const review = useSuspenseQuery(productReviewsQuery(productId));

  const productData = data.product as ProductType;
  const product = productData;
  const reviews = review.data.data as SingleProductReview;

  return { product, reviews };
}
const quantityList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

function ProductPage() {
  const { productId } = route.useParams();
  const { user } = useAuth();
  const [userCanReview, setUserCanReview] = useState(false);
  const { product, reviews } = useProductPage({ productId });
  const [quantity, setQuantity] = useState(1);
  const { cart, setCart } = useContext(CartContext);
  const cartList = cart.map((p) => p._id); //stores a list of product ids that is in the cart
  const { starCount, stars } = calculateStars(
    reviews?.rating_info[0]?.rating_average ?? 0
  );

  const productTableHighlights: JSX.Element = (
    <table className="mt-6 text-base overflow-scroll lg:w-[70%]">
      <tbody className="">
        {product.highlights.map((d, i) => {
          return (
            <tr key={i}>
              {/* "w-[160px] mr-6" */}

              <td className="py-1">
                <span className="heading font-bold">{d.heading}</span>
              </td>
              <td className="pl-8">
                <span className="heading-detail">{d.overview}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
  const handleAddToCart = (quantity: number, product: ProductType) => {
    const checkDuplicates = ({ _id }: CartItemsType) => {
      if (cartList.includes(_id)) {
        return true;
      }
      return false;
    };
    const updateDupedItemInCart = (cartItem: CartItemsType) => {
      const cartWithoutDupedItem = cart.filter(
        (product) => product._id !== cartItem._id
      );
      const dupedItem = cart.find((product) => product._id === cartItem._id);
      if (dupedItem) {
        const newCartQuantity = (dupedItem.cart_quantity +=
          cartItem.cart_quantity);
        if (newCartQuantity > cartItem.quantity) {
          dupedItem.cart_quantity = cartItem.quantity;
        } else {
          dupedItem.cart_quantity = newCartQuantity;
        }

        const newCart = [...cartWithoutDupedItem, dupedItem];
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
    };
    const updateItemInCart = (cartItem: CartItemsType) => {
      const newCart = [...cart, cartItem];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    };
    const item = { ...product, cart_quantity: quantity };
    const cartItem = CartItemZodSchema.safeParse(item);
    if (cartItem.success) {
      //check for duplicates
      const isDuplicateCartItem = checkDuplicates(cartItem.data);

      if (isDuplicateCartItem) {
        //find item in cart and update the quantity
        updateDupedItemInCart(cartItem.data);
      } else {
        //not a duped item being added
        updateItemInCart(cartItem.data);
      }
      setQuantity(1);
    } else {
      console.error("An error occured adding product to cart");
      return;
    }
  };

  const productPrice_formatted = product.price
    .toFixed(2)
    .split(".")
    .map((v, i) =>
      i == 1 ? (
        <span
          key={i}
          className="cents-section align-text-top text-base tracking-normal"
        >
          {v}
        </span>
      ) : (
        <span key={i}>{v}</span>
      )
    );
  const subtotal = cart.reduce(
    (prev, product) => prev + product.price * product.cart_quantity,
    0
  );

  useEffect(() => {
    const setCanReviewVariables = async (userId: string) => {
      const orderHistoryData = (await fetchOrderHistory(userId)).data;
      const hasPurchasedProduct = orderHistoryData.records_count > 0;
      const hasReviewed = reviews.reviews
        .map((review) => review.reviewer as unknown as string)
        .some((customerId) => customerId === userId);

      const canReview = !hasReviewed && hasPurchasedProduct;
      if (canReview && !userCanReview) {
        setUserCanReview(true);
      } else if (!canReview && userCanReview) {
        setUserCanReview(false);
      }
    };
    const fetchOrderHistory = async (userId: string) => {
      const orderhistoryData = await queryClient.fetchQuery(
        orderHistoryByUserQuery(userId, productId)
      );
      return orderhistoryData;
    };
    if (user?.id) {
      setCanReviewVariables(user.id);
    }
  }, [user, userCanReview, reviews]);

  return (
    <div className="wrapper">
      {product ? (
        <>
          <Helmet>
            <title>Cyber Den - {product.name}</title>
          </Helmet>

          <div className="product-page">
            <div className="top-section flex flex-col lg:flex-row mt-4 lg:mx-4">
              <section className="product-card info-section flex flex-col p-4 lg:flex-[2] relative">
                <h1 className="product-name font-semibold pb-3 lg:text-2xl">
                  {product.name}
                </h1>
                {user?.is_admin && (
                  <p className="absolute right-4 top-0 max-w-max ml-auto dark:text-a1d text-a1 hover:underline active:underline">
                    <Link
                      to="/shop/product/$productId/edit"
                      params={{ productId }}
                    >
                      Edit this page
                    </Link>
                  </p>
                )}

                <p>
                  <Link
                    to="/shop/products"
                    search={{ q: product.brand, page: 1 }}
                    className="text-blue-600 hover:text-blue-600/70 dark:text-blue-400 dark:hover:text-blue-400/80 hover:underline"
                  >
                    <span>Shop {product.brand} Products</span>
                  </Link>
                </p>

                <div className="product-rating">
                  {reviews.records_count < 1 ? (
                    <p className="text-end">
                      <a
                        href="#reviews"
                        className="active:underline focus-visible:underline max-w-max"
                      >
                        <span>Be the first to review this product</span>
                      </a>
                    </p>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="flex items-end">
                        {starCount?.toFixed(1) || 0}{" "}
                      </span>{" "}
                      {stars}
                      <a
                        href="#reviews"
                        className="flex items-end hover:underline hover:underline-offset-2"
                      >
                        {reviews.records_count}{" "}
                        {reviews.records_count > 1 ? "ratings" : "rating"}
                      </a>
                    </div>
                  )}
                </div>
                <div className="expanded-section hidden lg:flex lg:flex-col lg:text-lg">
                  <p className="flex items-end mt-2">
                    {product.discount && product.discount > 0 ? (
                      <span className="discount-price text-[1.75rem] font-normal text-[#CC0C39] dark:text-red-500">
                        -{(product?.discount * 100).toFixed(0)}%
                      </span>
                    ) : null}
                    <span className="price text-[1.75rem] ml-2 font-normal">
                      ${productPrice_formatted}
                    </span>
                  </p>
                  {product.retail_price > product.price && (
                    <p className="text-sm dark:text-a1d text-a1 mt-2">
                      <span>List Price: </span>
                      <span className="list-price line-through">
                        ${product.retail_price}
                      </span>
                    </p>
                  )}
                  <p className="border-b-2 mt-4 border-neutral-300"></p>
                  {productTableHighlights}
                </div>
              </section>
              <section className="product-card img-section p-4 lg:order-[-1] lg:flex-[2] max-w-[550px] aspect-square mx-auto">
                {/* max-w-[600px] min-w-[300px] mx-auto */}
                <div className="image-container flex justify-center bg-white rounded-md">
                  <img
                    className="aspect-square object-contain rounded-md"
                    src={product?.image_src || noImage}
                    alt={product?.image_src ? product.name : "No image to show"}
                  />
                </div>
              </section>

              <section className="product-card flex flex-col lg:flex-1 lg:items-center">
                <div className="purchase-method flex lg:hidden">
                  <h2 className="px-4 pt-2 text-xl border-gray-400 border-t border-r border-b-transparent rounded-tr-md">
                    Delivery
                  </h2>
                  <p className="flex-1 border-b border-gray-400"></p>
                </div>
                <div className="purchase-card rounded-md flex flex-col m-4 lg:m-0 p-4 dark:bg-a1sd border border-[#e6e6e6] dark:border-a3sd lg:max-w-[300px]">
                  <div className="purchase-card-section-header flex justify-between">
                    <p className="font-semibold">One-time purchase</p>
                    <div className="flex items-center">
                      <input className="w-5 h-5" type="radio" defaultChecked />
                    </div>
                  </div>
                  <div className="purchase-card-section-price">
                    <div className="retail-price-section text-base">
                      {product.retail_price > product.price && (
                        <span className="line-through text-neutral-600 dark:text-neutral-300">
                          ${product.retail_price}
                        </span>
                      )}
                      <br />
                      <p className="price-section text-3xl pb-2">
                        <span>$</span>
                        {productPrice_formatted}
                      </p>
                    </div>
                  </div>
                  <div className="purchase-card-section-btns">
                    <div className="uppercase text-blue-600 dark:text-blue-400 text-sm flex items-center mb-1">
                      <IconPackageImport
                        stroke={1.5}
                        className="mr-1 min-w-max"
                      />
                      <span className="">Free 30-day Returns</span>
                    </div>
                    <div className="uppercase text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <IconTruckDelivery stroke={1.5} className="min-w-max" />
                      <span className="">Free Delivery</span>

                      <span className="lg:hidden"> from United States</span>
                    </div>

                    <p className={`text-2xl mb-2 mt-2`}>
                      {product.quantity > 0 ? (
                        <span className="text-green-600 dark:text-[#22DD67]">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-500">Out of Stock</span>
                      )}
                    </p>
                    {product.quantity < 10 && product.quantity > 0 ? (
                      <p className="text-orange-700 dark:text-orange-500">
                        Only {product.quantity} left in stock!
                      </p>
                    ) : null}
                    {product.quantity > 0 && (
                      <>
                        <Select
                          className={"flex flex-col mb-3 group"}
                          selectedKey={quantity}
                          onSelectionChange={(e) => setQuantity(Number(e))}
                        >
                          <Label>Quantity:</Label>
                          <Button
                            className={({
                              isHovered,
                              isFocusVisible,
                              isPressed,
                            }) =>
                              `border bg-neutral-50 dark:bg-a0d rounded-md text-black shadow-sm py-1 flex justify-center px-2
                          ${isHovered || isFocusVisible || isPressed ? "bg-neutral-200" : ""}
                        `
                            }
                          >
                            <SelectValue className={"flex-1"} />
                            <span aria-hidden="true">
                              <IconChevronDown
                                className={
                                  "group-data-[open]:rotate-180 transition-all duration-300"
                                }
                                stroke={1.25}
                              />
                            </span>
                          </Button>

                          <Popover
                            className={
                              "bg-white dark:bg-a0d text-black border-2 flex flex-col w-[--trigger-width] overflow-y-auto py-1 rounded-md"
                            }
                          >
                            <ListBox className={"max-h-32"}>
                              <Section className="">
                                {/* <Header>Quantity</Header> */}
                                {quantityList.map((num, i) =>
                                  product.quantity >= num ? (
                                    <ListBoxItem
                                      key={i}
                                      id={num}
                                      textValue={num.toString()}
                                      className={({
                                        isHovered,
                                        isSelected,
                                        isFocusVisible,
                                        isPressed,
                                      }) => `group px-4
                              ${(isHovered || isPressed) && !isSelected ? "bg-gray-200 cursor-pointer" : ""}
                              ${isFocusVisible && !isSelected ? "bg-gray-200" : ""}
                              ${isSelected ? "shadow-sm bg-blue-300" : ""}
                            `}
                                    >
                                      {({ isSelected }) => (
                                        <span className="flex items-center justify-between">
                                          {num}
                                          {isSelected && (
                                            <IconCheck
                                              stroke={2}
                                              height={20}
                                              width={20}
                                            />
                                          )}
                                        </span>
                                      )}
                                    </ListBoxItem>
                                  ) : null
                                )}
                              </Section>
                            </ListBox>
                          </Popover>
                        </Select>

                        <div className="add-to-cart-btn flex flex-col gap-4">
                          {product.quantity > 0 && (
                            <DialogTrigger>
                              <Button
                                type="button"
                                className={({ isFocusVisible, isHovered }) =>
                                  `shadow-sm text-neutral-950 px-2 py-[.15rem] rounded-md ${cartList?.includes(product._id) ? `bg-gray-200 outline outline-gray-400 ${isHovered && "bg-gray-300"} ${isFocusVisible && "bg-gray-300 ring-2 ring-blue-700 ring-offset-2"}` : `bg-orange-400 outline outline-orange-400 ${isHovered && "bg-orange-500"} ${isFocusVisible && "bg-orange-500 ring-offset-2 ring-2 ring-blue-700"}`}`
                                }
                                onPress={() =>
                                  handleAddToCart(quantity, product)
                                }
                              >
                                {cartList?.includes(product._id) ? (
                                  <span className="flex items-center justify-center">
                                    <IconCheck size={16} className="mr-1" />
                                    Item is in cart
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
                                          Subtotal: $
                                          <span>{subtotal.toFixed(2)}</span>
                                        </p>
                                        <div className="cart-body">
                                          <div className="cart-product-details py-2">
                                            {product.image_src && (
                                              <img
                                                src={product.image_src}
                                                alt={product.name}
                                                className="object-contain"
                                                height={100}
                                              ></img>
                                            )}
                                            <Link
                                              to="/shop/product/$productId"
                                              params={{
                                                productId: product._id,
                                              }}
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
                          )}
                        </div>
                      </>
                    )}
                    <div className="soldby-section mt-4">
                      <p>
                        <span className="dark:text-neutral-300">Sold By: </span>
                        <span className="">Cyber Den</span>
                      </p>
                      <p>
                        <span className="dark:text-neutral-300">
                          Shipped By:{" "}
                        </span>
                        <span className="">Cyber Den</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              {product.highlights.length > 0 && (
                <section className="product-card px-4 pt-4 pb-6 lg:hidden border-t border-b border-neutral-400">
                  <h2 className="font-bold text-lg">Details</h2>
                  {productTableHighlights}
                </section>
              )}
            </div>

            <section className="product-card flex flex-col pt-6 px-4 lg:mt-6 min-h-[200px]">
              <h2 className="font-semibold text-lg">Product Description</h2>
              <p className="p-4 whitespace-break-spaces">
                {product.description || "Not available yet."}
              </p>
            </section>
            <section
              id="reviews"
              className="product-card reviews flex flex-col md:flex-row gap-8 pt-6 px-4 mt-4 border-t border-t-gray-400"
            >
              <div className="review-left py-4">
                <h2 className="font-semibold pb-3 text-lg">Customer Reviews</h2>
                <div className="customer-ratings mb-2">
                  <div className="review-stars flex gap-2">
                    {stars}
                    <span className="text-lg">{starCount || 0} out of 5</span>
                  </div>
                  <p className="total-ratings">
                    <span className="text-[#565959] dark:text-[#a5a8a8]">
                      {reviews?.rating_info[0]?.rating_count || 0} total ratings
                    </span>
                  </p>
                  {userCanReview && (
                    <p className="mt-2">
                      <Link
                        to="/shop/product/$productId/create-review"
                        params={{ productId }}
                        mask={{
                          to: "/shop/product/$productId",
                          params: { productId },
                          unmaskOnReload: true,
                        }}
                        className="text-[#0253B1] hover:text-[#0253B1]/70 dark:text-[#62ABFD] dark:hover:text-[#62ABFD]/80 hover:underline"
                      >
                        <span>I want to review this product</span>
                      </Link>
                    </p>
                  )}
                </div>
              </div>
              <div className="review-right flex flex-col flex-[3] py-4 md:py-6">
                <div className="review-cards flex flex-col gap-6 md:mx-auto">
                  {reviews.records_count < 1 ? (
                    <div className="lg:p-4">
                      <p className="mt-2">
                        <span>
                          Be the first to review after purchasing this product.
                        </span>
                      </p>
                    </div>
                  ) : (
                    reviews.reviews.map((r, i) => {
                      //only displays 8 reviews before showing the see all reviews link
                      const MAX_INDEX = 7;
                      if (i === MAX_INDEX) {
                        //returns the see all link
                        return (
                          <Link key={i} to="/" className={`active:underline`}>
                            See all reviews
                          </Link>
                        );
                      }
                      if (i >= MAX_INDEX) {
                        //returns nothing, doesn't render any more reviews
                        return;
                      }
                      return (
                        <div className="review-card lg:w-[625px]" key={r._id}>
                          <div className="reviewer flex items-center mb-1 gap-2">
                            <div className="reviewer-icon h-[25px] w-[25px] text-center rounded-full bg-gray-300 dark:text-black inline-flex justify-center items-center">
                              {r.reviewer[0]?.first_name[0]?.toUpperCase()}
                            </div>
                            <span>{`${r.reviewer[0]?.first_name} ${r.reviewer[0]?.last_name}`}</span>
                          </div>
                          <Link
                            to="/shop/review/$reviewId"
                            params={{ reviewId: r._id }}
                            className="hover:underline focus-visible:underline inline-block"
                          >
                            <div className="reviewer-rating">
                              {calculateStars(r.rating).stars}
                            </div>
                            <p className="review-title font-bold mt-1">
                              {r.review_title}
                            </p>
                          </Link>
                          <p>
                            <span className="text-sm dark:text-a1d">
                              Reviewed on{" "}
                              {new Date(r.review_date).toDateString()}
                            </span>
                          </p>
                          {r.review_edit_date && (
                            <p className="text-sm dark:text-a1d">
                              <span>Edited on </span>
                              <span>
                                {new Date(r.review_edit_date).toDateString()}
                              </span>
                            </p>
                          )}
                          <div className="mt-1">
                            <ExpandableReviewDescription
                              reviewDescription={r.review_description}
                              trimCap={300}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>
            <div className="h-[300px]"></div>
          </div>
        </>
      ) : (
        <p>Nothing here :(</p>
      )}
    </div>
  );
}

export default ProductPage;
