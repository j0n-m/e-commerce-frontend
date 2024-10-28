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
                    className="order-card mb-4 ring-2 dark:ring-slate-800 ring-slate-200/60 rounded-md flex flex-col"
                  >
                    <div className="card-heading dark:bg-a1sd bg-slate-200/60 rounded-t-md">
                      <div className="card-inner-heading p-4 flex justify-between">
                        <div className="card-inner-left flex gap-6">
                          <div className="card-ordered-at">
                            <p>Order Placed</p>
                            <p>
                              {new Date(order.order_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  weekday: "short",
                                }
                              )}
                            </p>
                          </div>
                          <div className="card-total">
                            <p>Total</p>
                            <p>
                              $
                              {(order.cart_total + order.shipping.cost).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="card-inner-right hidden lg:flex">
                          <div className="card-order-num">
                            <p className="">Order #</p>
                            <p className="">
                              <span className="text-wrap whitespace-break-spaces">
                                {order._id}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-inner-content p-2 grid grid-cols-1 gap-1">
                        {order.cart.map((item) => {
                          const productInfo = order.product_info.find(
                            (product) => product._id === item._id
                          );

                          return (
                            <Link
                              key={item._id}
                              to={`/shop/product/$productId`}
                              params={{ productId: item._id }}
                              className={`hover:underline underline-offset-2`}
                            >
                              <div className="item-card flex gap-2 p-[2px]">
                                <div className="item-card-left bg-white">
                                  <img
                                    src={
                                      productInfo?.image_src || noProductImage
                                    }
                                    alt={
                                      productInfo?.image_src
                                        ? item.name
                                        : "No Product Image"
                                    }
                                    className="max-w-[100px] max-h-[100px] aspect-square object-contain"
                                  />
                                </div>
                                <div className="item-card-right flex-1">
                                  <p>{trimString(item.name, 55)}</p>
                                  <p>Qty: {item.cart_quantity}</p>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
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
