import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import isAuthenticated from "../../utilities/isAuthenticated";
import { queryClient } from "../../App";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import fetch from "../../utilities/fetch";
import { AxiosError, AxiosResponse } from "axios";
import Orders from "../../pages/Orders";

export const orderHistoryQueryOptions = (customerId: string) => {
  return queryOptions({
    queryKey: ["orderhistory"],
    queryFn: () => {
      return fetch.get(`api/orderhistory/customer/${customerId}`);
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};
export const Route = createFileRoute("/account/orders")({
  component: () => <Orders />,
  loader: async () => {
    try {
      const auth = queryClient.getQueryData(["auth"]) as AxiosResponse;
      const userId = auth.data?.user?.id as string;
      // console.log(userId);

      const orderData = await queryClient.ensureQueryData(
        orderHistoryQueryOptions(userId)
      );
      // console.log(orderData);
      return orderData;
    } catch (error) {
      if ((error as AxiosError)?.response?.status == 404) {
        throw notFound();
      }
    }
  },
  beforeLoad: async () => {
    // const isAuth = await isAuthenticated();
    // if (!isAuth) {
    //   throw redirect({
    //     to: "/signin",
    //     replace: true,
    //   });
    // }
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      throw redirect({ to: "/signin", search: { from: Route.fullPath } });
    }
  },
});
