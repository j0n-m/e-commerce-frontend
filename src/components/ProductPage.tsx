import { useSuspenseQuery } from "@tanstack/react-query";
import { singleProductQueryOption } from "../routes/shop/product/$productId";
import { getRouteApi, Link } from "@tanstack/react-router";
import { ProductType } from "../types/ProductType";
import noImage from "../assets/images/no_product_image.jpg";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Section,
  Select,
  SelectValue,
} from "react-aria-components";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
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

function ProductPage() {
  const { productId } = route.useParams();
  const { product } = useProductPage(productId);
  const [quantity, setQuantity] = useState(1);

  const productPrice_formatted = product.price
    .toFixed(2)
    .split(".")
    .map((v, i) =>
      i == 1 ? (
        <span key={i} className="cents-section align-text-top text-base">
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
            <div className="top-section flex flex-col lg:flex-row mt-4">
              <section className="product-card flex flex-col p-4 lg:flex-1">
                <h1 className="product-name font-semibold pb-3 lg:text-2xl">
                  {product.name}
                </h1>
                <Link to=".">
                  <p className="text-blue-500">Shop {product.brand} Products</p>
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
                  <p className="flex items-center">
                    {(product?.discount || 0) * 100 > 0 && (
                      <span className="discount-price text-2xl font-normal text-red-400">
                        -{product.discount! * 100}%
                      </span>
                    )}
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
                  <table className="mt-6 text-base">
                    <tbody>
                      {product.highlights.map((d, i) => {
                        return (
                          <tr key={i} className="flex">
                            <td className="w-[160px] mr-6">
                              <span className="heading font-semibold">
                                {d.heading}
                              </span>
                            </td>
                            <td className="flex-1">
                              <span className="heading-detail">
                                {d.overview}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
              <section className="product-card flex flex-col p-4 lg:order-[-1] lg:min-w-[600px]">
                <div className="image-container flex justify-center">
                  <img
                    className="lg:max-w-[600px] aspect-square"
                    src={product?.image_src || noImage}
                    alt={product?.image_src ? product.name : "No image to show"}
                  />
                </div>
              </section>

              <section className="product-card flex flex-col">
                <div className="purchase-method flex lg:hidden">
                  <h2 className="px-4 pt-2 text-xl border-gray-400 border-t border-r border-b-transparent rounded-tr-md">
                    Delivery
                  </h2>
                  <p className="flex-1 border-b border-gray-400"></p>
                </div>
                <div className="purchase-card rounded-md flex flex-col m-4 p-4 outline outline-1 outline-neutral-400 lg:min-w-[275px]">
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
                    <p className="uppercase text-blue-500 font-normal text-sm">
                      * Free 30-day Returns
                    </p>
                    <p className="uppercase text-sm">
                      <span className="text-blue-500">* Free Delivery</span>

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
                        className={
                          "border bg-neutral-100 rounded-md text-black shadow-sm py-1 flex justify-center px-2"
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
                                  }) => `px-4
                              ${isHovered && !isSelected ? "bg-gray-200 cursor-pointer" : ""}
                              ${isFocusVisible && !isSelected ? "bg-gray-200" : ""}
                              ${isSelected ? "bg-blue-300 border border-blue-600" : ""}
                            `}
                                >
                                  {num}
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
                        <button
                          type="button"
                          className="bg-orange-400 rounded-md py-1"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                    <div className="soldby-section mt-4">
                      <p className="">
                        <span className="dark:text-neutral-400">Sold By: </span>
                        <span className="">Cyber Den</span>
                      </p>
                      <p>
                        <span className="dark:text-neutral-400">
                          Shipped By:{" "}
                        </span>
                        <span className="">Cyber Den</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="product-card flex flex-col pt-6 px-4 pb-[300px]">
              <h2 className="font-semibold">Product Description</h2>
              <p className="p-4">{product.description}</p>
            </section>
          </div>
        </>
      ) : (
        <p>Nothing here :(</p>
      )}
    </div>
  );
}

export default ProductPage;
