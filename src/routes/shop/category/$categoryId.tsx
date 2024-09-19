import { createFileRoute, notFound } from "@tanstack/react-router";
import LoadingComponent from "../../../components/LoadingComponent";
import ProductsByCategory from "../../../components/ProductsByCategory";
import { AxiosError } from "axios";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { queryClient } from "../../../App";
import ErrorPage from "../../../components/ErrorPage";
import MissingPage from "../../../components/MissingPage";
// import ErrorPage from "../../../components/ErrorPage";
import fetch from "../../../utilities/fetch";

export function productsByCategoryOption(
  categoryId: string,
  { page = 1, sort, price_low, price_high, pageSize }: ShopURLQuery
) {
  const url = `/api/products/category/${categoryId}?page=${page}${pageSize ? `&limit=${pageSize}` : ""}${sort ? `&sort=${sort}` : ""}${price_low ? `&price_low=${price_low}` : ""}${price_high ? `&price_high=${price_high}` : ""}&deals=true`;
  return queryOptions({
    queryKey: [
      "category",
      categoryId,
      page,
      { sort, pageSize, price_low, price_high },
    ],
    queryFn: () => fetch.get(url),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}
export type ShopURLQuery = {
  page: number;
  sort?: string;
  price_low?: number;
  price_high?: number;
  pageSize?: number;
  category?: string;
};

export const Route = createFileRoute("/shop/category/$categoryId")({
  component: () => <ProductsByCategory />,
  pendingComponent: () => <LoadingComponent />,
  validateSearch: (search: Record<string, unknown>): ShopURLQuery => ({
    page: Number(search?.page || 1) || 1,
  }),
  shouldReload: false,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  notFoundComponent: () => <MissingPage />,
  loaderDeps: ({
    search: { page, sort, price_low, price_high, pageSize, category },
  }) => ({
    page,
    sort,
    price_low,
    price_high,
    pageSize,
    category,
  }),
  loader: async ({ params, deps }) => {
    try {
      const data = await queryClient.ensureQueryData(
        productsByCategoryOption(params.categoryId, deps)
      );

      return data;
    } catch (error) {
      if ((error as AxiosError)?.response?.status == 404) {
        throw notFound();
      }
    }
  },
});