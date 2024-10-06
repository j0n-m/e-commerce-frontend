import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { orderHistoryQueryOptions } from "../routes/account/orders";
import useAuth from "../hooks/useAuth";
import { OrderHistoryType } from "../types/OrderHistoryType";

function useOrderHistory(userId: string) {
  const orderHistoryResponse = useSuspenseQuery(
    orderHistoryQueryOptions(userId)
  ).data.data;
  const orderHistory = orderHistoryResponse.order_history as OrderHistoryType;
  return { orderHistory, orderHistoryResponse };
}

function Orders() {
  const { user } = useAuth();
  const { orderHistory, orderHistoryResponse } = useOrderHistory(
    user?.id as string
  );
  console.log(orderHistoryResponse);

  return (
    <div>
      <h1>Order History</h1>
      {orderHistory.length > 0 ? (
        orderHistory.map((order) => {
          return (
            <div className="order-card border mb-4">
              <p>Order #: {order._id}</p>
              <p>Ordered on {new Date(order.order_date).toLocaleString()}</p>
              {order.cart.map((d) => (
                <p key={d._id}>
                  Qty:{d.cart_quantity} - {d.name}
                </p>
              ))}
            </div>
          );
        })
      ) : (
        <p>You do not have any recent orders.</p>
      )}
    </div>
  );
}

export default Orders;
