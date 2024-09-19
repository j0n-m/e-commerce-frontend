import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { queryClient } from "../../../App";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import ProductResults from "../../../components/ProductResults";
import LoadingComponent from "../../../components/LoadingComponent";
import fetch from "../../../utilities/fetch";
import { AxiosError } from "axios";
import MissingPage from "../../../components/MissingPage";
import ErrorPage from "../../../components/ErrorPage";

export type ProductSearch = {
  q: string;
  page: number;
  sort?: string;
  price_low?: number;
  price_high?: number;
  pageSize?: number;
};

export function queryFormSearchOptions(
  search: string,
  searchDeps: ProductSearch
) {
  return queryOptions({
    queryKey: ["searchQuery", search, { ...searchDeps }],
    queryFn: async () =>
      await fetch.get(
        `/api/products?search=${search}&deals=true&page=${searchDeps.page}${searchDeps.pageSize && `&limit=${searchDeps.pageSize}`}`
      ),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}

export const Route = createFileRoute("/shop/products/")({
  beforeLoad: ({ search: { q } }) => {
    if (q === "") {
      throw redirect({ to: "/" });
    }
  },
  component: () => <ProductResults />,
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      q: (search.q as string) || "",
      page: Number(search?.page || 1) || 1,
    };
  },
  pendingComponent: () => <LoadingComponent />,
  notFoundComponent: () => <MissingPage />,

  loaderDeps: ({
    search: { q, page, pageSize, price_high, price_low, sort },
  }) => ({ q, page, pageSize, price_high, price_low, sort }),

  loader: async ({ deps }) => {
    try {
      const data = await queryClient.ensureQueryData(
        queryFormSearchOptions(deps.q, deps)
      );
      return data;
    } catch (error) {
      if ((error as AxiosError)?.response?.status == 404) {
        throw notFound();
      }
    }
  },
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
});
