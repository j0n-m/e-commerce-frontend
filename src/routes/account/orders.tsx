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

const mappedSort = new Map([
  ["newest", "-order_date"],
  ["oldest", "order_date"],
  ["highest_price", "-cart_total"],
  ["lowest_price", "cart_total"],
]);
export const orderHistoryQueryOptions = ({
  customerId,
  deps,
}: {
  customerId: string;
  deps: ShopURLQuery;
}) => {
  return queryOptions({
    queryKey: ["orderhistory", deps],
    queryFn: async () => {
      return await fetch.get(
        `api/orderhistory/customer/${customerId}?page=${deps.page || 1}${deps.sort ? `&sort=${mappedSort.get(deps.sort)}` : "&sort=-order_date"}`,
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
      page: Number(search?.page || 1) || 1,
    };
  },
  loaderDeps: ({ search: { page, sort, pageSize, category, sortBy } }) => ({
    page,
    sort,
    pageSize,
    category,
    sortBy,
  }),
  loader: async ({ deps }) => {
    try {
      const auth = queryClient.getQueryData(["auth"]) as AxiosResponse;

      const userId = auth.data.user.id as string;

      return queryClient.ensureQueryData(
        orderHistoryQueryOptions({ customerId: userId, deps })
      );
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
