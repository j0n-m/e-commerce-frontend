import { createFileRoute } from "@tanstack/react-router";
import ErrorPage from "../../../components/ErrorPage";
import MissingPage from "../../../components/MissingPage";
import BestSellers from "../../../pages/BestSellers";
import { queryOptions } from "@tanstack/react-query";
import fetch from "../../../utilities/fetch";
import { ShopURLQuery } from "./$categoryId";
import { queryClient } from "../../../App";
import LoadingComponent from "../../../components/LoadingComponent";
import { productsSortByMap } from "./best-deals";

export const bestsellersQueryOptions = ({
  deps,
}: {
  deps: Partial<ShopURLQuery>;
}) =>
  queryOptions({
    queryKey: ["best-sellers", deps],
    queryFn: async () =>
      await fetch.get(
        `/api/products?deals=true&sort=-total_bought${deps.sortBy ? `&sortBy=${productsSortByMap.get(deps.sortBy)}` : ""}${deps.price_low && deps.price_high ? `&price_low=${deps.price_low}&price_high=${deps.price_high}` : ""}`
      ),
    staleTime: 1000 * 60 * 5,
  });
export const Route = createFileRoute("/shop/category/best-sellers")({
  component: () => <BestSellers />,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateSearch: (search: Record<string, unknown>): Partial<ShopURLQuery> => ({
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
    return await queryClient.ensureQueryData(bestsellersQueryOptions({ deps }));
  },
});
