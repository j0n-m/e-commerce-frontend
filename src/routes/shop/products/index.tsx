import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "../../../App";
import { queryOptions } from "@tanstack/react-query";
import ProductResults from "../../../components/ProductResults";
import LoadingComponent from "../../../components/LoadingComponent";
import fetch from "../../../utilities/fetch";

type ProductSearch = {
  q: string;
};

export function queryFormSearchOptions(search: string) {
  return queryOptions({
    queryKey: ["searchQuery", search],
    queryFn: async () => await fetch.get(`/api/products?search=${search}`),
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
    };
  },
  pendingComponent: () => <LoadingComponent />,
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    const data = await queryClient.ensureQueryData(queryFormSearchOptions(q));
    return data;
  },
  errorComponent: () => <p>Error loading resources.</p>,
});
