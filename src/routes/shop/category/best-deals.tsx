import { createFileRoute } from "@tanstack/react-router";
import ErrorPage from "../../../components/ErrorPage";
import LoadingComponent from "../../../components/LoadingComponent";
import MissingPage from "../../../components/MissingPage";
import { queryClient } from "../../../App";
import { ShopURLQuery } from "./$categoryId";
import { queryOptions } from "@tanstack/react-query";
import fetch from "../../../utilities/fetch";
import BestDeals from "../../../pages/BestDeals";

export const productsSortByMap = new Map([
  ["lowest_price", "price"],
  ["highest_price", "-price"],
  ["best_deal", "-discount"],
  ["best_rating", "-review_info.rating"],
  ["most_reviews", "-review_info.review_count"],
  ["best_selling", "-total_bought"],
]);
export const bestDealsQueryOption = ({
  deps,
}: {
  deps: Partial<ShopURLQuery>;
}) =>
  queryOptions({
    queryKey: ["best-deals", deps],
    queryFn: async () =>
      await fetch.get(
        `/api/products?deals=true&sort=-discount${deps.sortBy ? `&sortBy=${productsSortByMap.get(deps.sortBy)}` : ""}${deps.price_low && deps.price_high ? `&price_low=${deps.price_low}&price_high=${deps.price_high}` : ""}`
      ),
    staleTime: 1000 * 60 * 5,
  });

export const Route = createFileRoute("/shop/category/best-deals")({
  component: () => <BestDeals />,
  validateSearch: (): Partial<ShopURLQuery> => ({
    page: 1,
  }),
  loaderDeps: ({
    search: { page, sort, price_low, price_high, pageSize, category, sortBy },
  }) => ({
    page,
    sort,
    price_low,
    price_high,
    pageSize,
    category,
    sortBy,
  }),
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  pendingComponent: () => <LoadingComponent />,
  notFoundComponent: () => <MissingPage />,
  loader: async ({ deps }) => {
    const data = await queryClient.ensureQueryData(
      bestDealsQueryOption({ deps })
    );
    return data;
  },
});
