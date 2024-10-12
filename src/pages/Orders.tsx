import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { orderHistoryQueryOptions } from "../routes/account/orders";
import useAuth from "../hooks/useAuth";
import { OrderHistoryType } from "../types/OrderHistoryType";
import { trimString } from "../utilities/trimString";
import noProductImage from "../assets/images/no_product_image.jpg";
import { getRouteApi, Link } from "@tanstack/react-router";
import { PaginationBar } from "../components/PaginationBar";
import { ScreenSizeContext } from "../context/ScreenSizeContext";

const route = getRouteApi("/account/orders");
function useOrderHistory(userId: string, page: number = 1) {
  const orderHistoryResponse = useSuspenseQuery(
    orderHistoryQueryOptions(userId, page)
  ).data.data;
  const orderHistory = orderHistoryResponse.order_history as OrderHistoryType;
  return { orderHistory, orderHistoryResponse };
}

function Orders() {
  const { user } = useAuth();
  const { page } = route.useLoaderDeps();
  const { isTablet } = useContext(ScreenSizeContext);
  const { orderHistory, orderHistoryResponse } = useOrderHistory(
    user?.id as string,
    page
  );

  // const orderHistory = [];
  console.log(orderHistoryResponse);

  return (
    <div className="p-4 max-w-[1000px] mx-auto mt-4">
      <h1 className="text-2xl font-bold">Your Orders</h1>
      <div className="orders-list flex flex-col mt-4">
        {orderHistory.length > 0 ? (
          orderHistory.map((order) => {
            return (
              <div
                key={order._id}
                className="order-card mb-4 ring-2 dark:ring-slate-800 ring-slate-200/60 rounded-md flex flex-col"
              >
                <div className="card-heading dark:bg-slate-800 bg-slate-200/60 rounded-t-md">
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
                          ${(order.cart_total + order.shipping.cost).toFixed(2)}
                        </p>
                      </div>
                      <div className="card-ship-to">
                        <p>Customer</p>
                        <p>
                          {user?.first_name} {user?.last_name}
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
                    {order.cart.map((item) => (
                      <Link
                        key={item._id}
                        to={`/shop/product/$productId`}
                        params={{ productId: item._id }}
                        className={`hover:underline underline-offset-2`}
                      >
                        <div className="item-card flex gap-2 p-[2px]">
                          <div className="item-card-left">
                            <img
                              src={item.image_src || noProductImage}
                              alt={
                                item.image_src ? item.name : "No Product Image"
                              }
                              className="max-w-[100px] max-h-[100px] aspect-square"
                            />
                          </div>
                          <div className="item-card-right flex-1">
                            <p>{trimString(item.name, 55)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
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
      <PaginationBar
        className="flex justify-center mt-3 md:justify-end"
        totalPages={orderHistoryResponse.total_pages}
        currentPage={page}
        searchDeps={{ page }}
        isLargeScreenSize={isTablet}
      />
    </div>
  );
}

export default Orders;
