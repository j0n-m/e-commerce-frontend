import { createFileRoute, redirect } from "@tanstack/react-router";
import ErrorPage from "../../../components/ErrorPage";
import MissingPage from "../../../components/MissingPage";
import LoadingComponent from "../../../components/LoadingComponent";
import isAuthenticated from "../../../utilities/isAuthenticated";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import fetch from "../../../utilities/fetch";
import { queryClient } from "../../../App";
import { AxiosResponse } from "axios";
import MyReviews from "../../../pages/MyReviews";
import { ShopURLQuery } from "../../shop/category/$categoryId";

const mappedSort = new Map([
  ["newest", "-review_date"],
  ["oldest", "review_date"],
  ["highest_rating", "-rating"],
  ["lowest_rating", "rating"],
]);
export const reviewsByCustomerQueryOption = ({
  customerId,
  deps,
}: {
  customerId: string;
  deps: ShopURLQuery;
}) => {
  return queryOptions({
    queryKey: ["customerReviews", customerId, { ...deps }],
    queryFn: async () => {
      return await fetch.get(
        `api/reviews?customer=${customerId}&page=${deps.page || 1}${deps.sort ? `&sort=${mappedSort.get(deps.sort) || "-review_date"}` : "&sort=-review_date"}`
      );
    },
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });
};
export const Route = createFileRoute("/account/myreviews/")({
  component: () => <MyReviews />,
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
    const authcache = queryClient.getQueryData(["auth"]) as AxiosResponse;

    try {
      if (authcache) {
        const user = authcache.data.user;
        const res = await queryClient.ensureQueryData(
          reviewsByCustomerQueryOption({ customerId: user.id, deps })
        );
        return res;
      } else {
        throw new Error("Customer is not authenticated");
      }
      // const res = await queryClient.ensureQueryData(reviewsByCustomerQueryOption({}))
    } catch (error) {
      console.error(error);
    }
  },
  beforeLoad: async () => {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      throw redirect({
        to: "/signin",
        replace: true,
        search: { from: window.location.pathname },
      });
    }
  },
});
