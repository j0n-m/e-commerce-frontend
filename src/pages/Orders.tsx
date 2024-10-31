import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { orderHistoryQueryOptions } from "../routes/account/orders";
import useAuth from "../hooks/useAuth";
import { OrderHistoryByCustomerType } from "../types/OrderHistoryType";
import { trimString } from "../utilities/trimString";
import noProductImage from "../assets/images/no_product_image.jpg";
import { getRouteApi, Link } from "@tanstack/react-router";
import { PaginationBar } from "../components/PaginationBar";
import { ScreenSizeContext } from "../context/ScreenSizeContext";
import { ShopURLQuery } from "../routes/shop/category/$categoryId";
import ProductSortBySelectBox from "../components/ProductSortBySelectBox";
import { Section } from "react-aria-components";
import SortBoxListItem from "../components/SortBoxListItem";
import { Helmet } from "react-helmet-async";
import getDeliveryStatus from "../utilities/getDeliveryStatus";
import { IconCircleCheckFilled, IconMailFast } from "@tabler/icons-react";

const route = getRouteApi("/account/orders");
function useOrderHistory({
  customerId,
  deps,
}: {
  customerId: string;
  deps: ShopURLQuery;
}) {
  const orderHistoryResponse = useSuspenseQuery(
    orderHistoryQueryOptions({ customerId, deps })
  ).data.data;
  const orderHistory =
    orderHistoryResponse.order_history as OrderHistoryByCustomerType;
  return { orderHistory, orderHistoryResponse };
}
const orderHistorySortItems = [
  {
    name: "Newest",
    id: "1",
    href: "." as const,
    deps: { search: { page: 1 } } as const,
  },
  {
    name: "Oldest",
    id: "2",
    href: "." as const,
    deps: { search: { page: 1, sort: "oldest" } } as const,
  },
  {
    name: "Highest Price",
    id: "3",
    href: "." as const,
    deps: { search: { sort: "highest_price", page: 1 } } as const,
  },
  {
    name: "Lowest Price",
    id: "4",
    href: "." as const,
    deps: { search: { sort: "lowest_price", page: 1 } } as const,
  },
];

function Orders() {
  const { user } = useAuth();
  const deps = route.useLoaderDeps();
  const { isDesktop } = useContext(ScreenSizeContext);
  const [showSortBySelectBox, setShowSortBySelectBox] = useState(false);
  const { orderHistory, orderHistoryResponse } = useOrderHistory({
    customerId: user?.id || "",
    deps,
  });
  const sortMap = new Map([
    ["newest", "1"],
    ["oldest", "2"],
    ["highest_price", "3"],
    ["lowest_price", "4"],
  ]);
  const orderDeliveryStatusMap = new Map(
    orderHistory.map((order) => [
      order._id,
      { ...getDeliveryStatus(new Date(order.order_date), order.shipping.code) },
    ])
  );
  const sortURL = new URLSearchParams(window.location.search).get("sort");
  useEffect(() => {
    const overlay = document.getElementById("select-box-overlay");
    if (showSortBySelectBox) {
      overlay?.classList.add("show");
    } else {
      setTimeout(() => {
        overlay?.classList.remove("show");
      }, 200);
    }
  }, [showSortBySelectBox]);

  return (
    <>
      <Helmet>
        <title>Cyber Den: Past Orders</title>
      </Helmet>
      <div className="flex-1 p-4 mt-4">
        <div className="lg:max-w-[1000px] lg:mx-auto">
          <h1 className="font-bold text-xl lg:text-2xl py-3 lg:py-5">
            Your Orders
          </h1>
          {orderHistory.length > 0 && (
            <div className="filters dark:bg-amenusd p-2 rounded-md mb-2 relative">
              <ProductSortBySelectBox
                isOpen={showSortBySelectBox}
                onOpenChange={setShowSortBySelectBox}
                items={orderHistorySortItems}
                selectedKey={sortMap.get(sortURL || "") || "1"}
                label="Sort By "
              >
                <Section className="flex flex-col">
                  {orderHistorySortItems.map((option) => {
                    return (
                      <SortBoxListItem
                        text={option.name}
                        key={option.id}
                        props={{
                          textValue: option.name,
                          id: option.id,
                          href: option.href,
                          routerOptions: option.deps,
                        }}
                      />
                    );
                  })}
                </Section>
              </ProductSortBySelectBox>
            </div>
          )}
          <div className="divider dark:bg-a2sd bg-a2s mb-2"></div>
          <div className="orders-list flex flex-col mt-4">
            {orderHistory.length > 0 ? (
              orderHistory.map((order) => {
                return (
                  <div
                    key={order._id}
                    className="order-card mb-4 rounded-md flex flex-col border dark:border-a2"
                  >
                    <div className="card-heading dark:bg-a1sd bg-a1s rounded-t-md">
                      <div className="card-inner-heading p-4 flex justify-between lg:p-6">
                        <div className="card-inner-left flex gap-6">
                          <div className="card-ordered-at">
                            <p className="font-bold">Order placed</p>
                            <p className="mt-1">
                              {new Date(order.order_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div className="card-total">
                            <p className="font-bold">Total amount</p>
                            <p className="mt-1">
                              $
                              {(order.cart_total + order.shipping.cost).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>
                        {/* <div className="card-inner-right hidden lg:flex">
                          <div className="card-order-num">
                            <p className="">Order #</p>
                            <p className="">
                              <span className="text-wrap whitespace-break-spaces">
                                {order._id}
                              </span>
                            </p>
                          </div>
                        </div> */}
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-inner-content p-4 grid grid-cols-1 gap-2 lg:gap-5 lg:p-6">
                        {order.cart.map((item) => {
                          const productInfo = order.product_info.find(
                            (product) => product._id === item._id
                          );

                          return (
                            <>
                              <div className="item-card flex gap-6">
                                <div className="item-card-left bg-white max-w-[80px] max-h-[80px] lg:max-w-[160px] lg:max-h-[160px]">
                                  <img
                                    src={
                                      productInfo?.image_src || noProductImage
                                    }
                                    alt={
                                      productInfo?.image_src
                                        ? item.name
                                        : "No Product Image"
                                    }
                                    className="max-w-[80px] max-h-[80px] aspect-square object-contain lg:max-w-[160px] lg:max-h-[160px]"
                                  />
                                </div>
                                <div className="item-card-right flex-1 flex flex-col justify-center lg:justify-normal">
                                  <div className="product-info flex flex-col lg:flex-row">
                                    <div className="info-left flex-1">
                                      <Link
                                        to="/shop/product/$productId"
                                        className="w-max block hover:underline focus-visible:underline"
                                        params={{ productId: item._id }}
                                      >
                                        <p className="font-bold lg:hidden">
                                          {trimString(item.name, 25)}
                                        </p>
                                        <p className="font-bold hidden lg:block">
                                          {trimString(item.name, 75)}
                                        </p>
                                      </Link>
                                    </div>
                                    <div className="info-right flex-1 lg:flex-none">
                                      <p className="lg:text-end font-bold">
                                        <span>${item.price.toFixed(2)} </span>
                                        {item.cart_quantity > 1 && (
                                          <span>x {item.cart_quantity}</span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="product-desc hidden lg:block dark:text-a1d text-a1 mt-2">
                                    {trimString(
                                      productInfo?.description || "",
                                      250
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })}
                        <div className="card-footer mt-6 flex flex-col lg:flex-row lg:justify-between">
                          <div className="delivery-status">
                            <p className="dark:text-a1d text-a1 flex items-center">
                              {orderDeliveryStatusMap.get(order._id)?.status ? (
                                <IconCircleCheckFilled
                                  color="#00A300"
                                  className="mr-2 dark:fill-[#00CC00]"
                                />
                              ) : (
                                <IconMailFast className="mr-2" />
                              )}
                              <span>
                                {
                                  orderDeliveryStatusMap.get(order._id)
                                    ?.statusText
                                }
                              </span>
                            </p>
                            {orderDeliveryStatusMap.get(order._id)?.status ===
                              false && (
                              <p className="dark:text-a1d text-a1 mt-1">
                                Estimate delivery on{" "}
                                {orderDeliveryStatusMap
                                  .get(order._id)
                                  ?.deliveryDate?.toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                              </p>
                            )}
                          </div>
                          {/* <div className="footer-inner border-t dark:border-t-a2 mt-6 pt-4 lg:mt-0 lg:border-none lg:pt-0 flex lg:items-end">
                            <Link
                              // to={`/shop/product/$productId`}
                              className="mx-auto w-max block active:underline"
                              // params={{ productId: item._id }}
                            >
                              View product
                            </Link>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="order-card mb-4 p-4 border border-slate-600 rounded-md flex flex-col">
                <p>You do not have any recent orders.</p>
              </div>
            )}
          </div>
        </div>
        <div id="select-box-overlay" className="select-box-overlay"></div>
      </div>
      <PaginationBar
        className="flex justify-center mt-3"
        totalPages={orderHistoryResponse.total_pages}
        currentPage={deps.page}
        searchDeps={deps}
        isLargeScreenSize={isDesktop}
      />
    </>
  );
}

export default Orders;
