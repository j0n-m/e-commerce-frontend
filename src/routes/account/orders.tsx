import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import isAuthenticated from "../../utilities/isAuthenticated";
import { queryClient } from "../../App";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import fetch from "../../utilities/fetch";
import { AxiosError, AxiosResponse } from "axios";
import Orders from "../../pages/Orders";
import ErrorPage from "../../components/ErrorPage";
import MissingPage from "../../components/MissingPage";
import LoadingComponent from "../../components/LoadingComponent";
import { ShopURLQuery } from "../shop/category/$categoryId";

export const orderHistoryQueryOptions = (
  customerId: string,
  page: number = 1
) => {
  return queryOptions({
    queryKey: ["orderhistory", { page: page }],
    queryFn: async () => {
      return await fetch.get(
        `api/orderhistory/customer/${customerId}?page=${page}&sort=-order_date`,
        {
          withCredentials: true,
        }
      );
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  });
};
export const Route = createFileRoute("/account/orders")({
  component: () => <Orders />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  notFoundComponent: () => <MissingPage />,
  pendingComponent: () => <LoadingComponent />,
  validateSearch: (search: Record<string, number>): ShopURLQuery => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
  loaderDeps: ({ search: { page } }) => ({
    page,
  }),
  loader: async ({ deps }) => {
    try {
      const auth = queryClient.getQueryData(["auth"]) as AxiosResponse;

      const userId = auth.data.user.id as string;

      return queryClient.ensureQueryData(
        orderHistoryQueryOptions(userId, deps.page)
      );
      // console.log(orderData);
    } catch (error) {
      if ((error as AxiosError)?.response?.status == 404) {
        throw notFound();
      }
      throw error;
    }
  },
  beforeLoad: async () => {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      throw redirect({
        to: "/signin",
        search: { from: Route.fullPath + window.location.search },
      });
    }
  },
});
