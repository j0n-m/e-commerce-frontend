import { useSuspenseQuery } from "@tanstack/react-query";
import { singleProductQueryOption } from "../routes/shop/product/$productId";
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
import { memo, useContext, useState } from "react";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";
import {
  CartContext,
  CartItemsType,
  CartItemZodSchema,
} from "../context/CartContext";
import { trimString } from "../utilities/trimString";
const route = getRouteApi("/shop/product/$productId");

function useProductPage(productId: string) {
  const { data } = useSuspenseQuery(singleProductQueryOption(productId));
  // console.log("data", data);
  const product = (data.product[0] as ProductType) || null;
  // console.log(product);
  // const reviews = data.reviews as ReviewType[];
  // const rating_average = (data?.rating_info[0]?.rating_average as number) || 0;
  return { product };
}
const quantityList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const ProductPage = memo(function ProductPage() {
  const { productId } = route.useParams();
  const { product } = useProductPage(productId);
  const [quantity, setQuantity] = useState(1);
  const { cart, setCart } = useContext(CartContext);
  const cartList = cart.map((p) => p._id); //stores a list of product ids that is in the cart

  const productTableHighlights: JSX.Element = (
    <table className="mt-6 text-base overflow-scroll w-max">
      <tbody className="">
        {product.highlights.map((d, i) => {
          return (
            <tr key={i}>
              {/* "w-[160px] mr-6" */}

              <td className="">
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
        dupedItem.cart_quantity += cartItem.cart_quantity;
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
  return (
    <div className="wrapper max-w-[1600px] mx-auto">
      {product ? (
        <>
          {/* divide-y-8 dark:divide-neutral-700 */}
          <div className="product-page">
            <div className="top-section flex flex-col lg:flex-row mt-4 lg:mx-4">
              <section className="product-card flex flex-col p-4 lg:flex-[2]">
                <h1 className="product-name font-semibold pb-3 lg:text-2xl">
                  {product.name}
                </h1>
                <Link to=".">
                  <p className="text-blue-600 dark:text-blue-400 hover:text-blue-300 hover:underline">
                    Shop {product.brand} Products
                  </p>
                </Link>

                {/* <p className="product-rating text-end">
                {rating_average <= 0
                  ? "Be the first to review this product."
                  : `${rating_average}Stars...${reviews.length} reviews`}
              </p> */}
                <p className="product-rating text-end">
                  Be the first to review this product.
                </p>
                <div className="expanded-section hidden lg:flex lg:flex-col lg:text-lg">
                  <p className="flex items-end">
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
                    <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-2">
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
              <section className="product-card p-4 lg:order-[-1] lg:flex-[2] lg:max-w-[600px]">
                {/* max-w-[600px] min-w-[300px] mx-auto */}
                <div className="image-container flex justify-center">
                  <img
                    className="aspect-square"
                    src={product?.image_src || noImage}
                    alt={product?.image_src ? product.name : "No image to show"}
                  />
                </div>
              </section>

              <section className="product-card flex flex-col lg:flex-1">
                <div className="purchase-method flex lg:hidden">
                  <h2 className="px-4 pt-2 text-xl border-gray-400 border-t border-r border-b-transparent rounded-tr-md">
                    Delivery
                  </h2>
                  <p className="flex-1 border-b border-gray-400"></p>
                </div>
                <div className="purchase-card rounded-md flex flex-col m-4 lg:m-0 p-4 outline outline-1 outline-neutral-400">
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
                      <p className="price-section text-3xl pb-1">
                        <span>$</span>
                        {productPrice_formatted}
                      </p>
                    </div>
                  </div>
                  <div className="purchase-card-section-btns">
                    <p className="uppercase text-blue-600 dark:text-blue-400 font-normal text-sm">
                      * Free 30-day Returns
                    </p>
                    <p className="uppercase text-sm">
                      <span className="text-blue-600 dark:text-blue-400">
                        * Free Delivery
                      </span>

                      <span className=""> from United States</span>
                    </p>

                    <p
                      className={`text-2xl ${product.quantity > 0 ? "text-green-600" : "text-neutral-500"} mb-2`}
                    >
                      {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                    {product.quantity < 10 && (
                      <p className="text-orange-700 dark:text-orange-500">
                        Only {product.quantity} left in stock!
                      </p>
                    )}
                    <Select
                      className={"flex flex-col mb-3 group"}
                      selectedKey={quantity}
                      onSelectionChange={(e) => setQuantity(Number(e))}
                    >
                      <Label>Quantity:</Label>
                      <Button
                        className={({ isHovered, isFocusVisible }) =>
                          `border bg-neutral-50 rounded-md text-black shadow-sm py-1 flex justify-center px-2
                          ${isHovered || isFocusVisible ? "bg-neutral-200" : ""}
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
                          "bg-white text-black border-2 flex flex-col w-[--trigger-width] overflow-y-auto py-1 rounded-md"
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
                                  }) => `group px-4
                              ${isHovered && !isSelected ? "bg-gray-200 cursor-pointer" : ""}
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
                    <div className="inputs flex flex-col gap-4">
                      {product.quantity > 0 && (
                        <select
                          name="quantity"
                          id="quantity"
                          className="border-2 max-w-52 text-black"
                          hidden={true}
                        >
                          <optgroup
                            className="text-neutral-400 font-normal text-sm tracking-widest"
                            label="Quantity"
                          >
                            <option value="1">1</option>
                          </optgroup>
                        </select>
                      )}
                      {product.quantity > 0 && (
                        <DialogTrigger>
                          <Button
                            type="button"
                            className={({ isFocusVisible, isHovered }) =>
                              `shadow-sm text-neutral-950 px-2 py-[.15rem] rounded-md ${cartList?.includes(product._id) ? `bg-gray-200 outline outline-gray-400 ${isHovered && "bg-gray-300"} ${isFocusVisible && "bg-gray-300 ring-2 ring-blue-700 ring-offset-2"}` : `bg-orange-400 outline outline-orange-400 ${isHovered && "bg-orange-500"} ${isFocusVisible && "bg-orange-500 ring-offset-2 ring-2 ring-blue-700"}`}`
                            }
                            onPress={() => handleAddToCart(quantity, product)}
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
                                      <span>
                                        {cart
                                          .reduce((p, c) => p + c.price, 0)
                                          .toFixed(2)}
                                      </span>
                                    </p>
                                    <div className="cart-body">
                                      <div className="cart-product-details py-2">
                                        {product.image_src && (
                                          <img
                                            src={product.image_src}
                                            alt={product.name}
                                            height={100}
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
                                        <Link
                                          onClick={() => close()}
                                          tabIndex={0}
                                        >
                                          <p className="text-center bg-orange-400 text-black rounded-full p-1 font-normal h-[30px] flex items-center justify-center hover:bg-orange-300">
                                            <span>Continue Shopping</span>
                                          </p>
                                        </Link>
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
                    <div className="soldby-section mt-4">
                      <p className="">
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
              <section className="product-card px-4 pt-4 pb-6 lg:hidden border-t border-b border-neutral-400">
                <h2 className="font-bold text-lg">Details</h2>
                {productTableHighlights}
              </section>
            </div>

            <section className="product-card flex flex-col pt-6 px-4 pb-[300px]">
              <h2 className="font-semibold">Product Description</h2>
              <p className="p-4">
                {product.description || "Not available yet."}
              </p>
            </section>
          </div>
        </>
      ) : (
        <p>Nothing here :(</p>
      )}
    </div>
  );
});

export default ProductPage;
