import { createFileRoute } from "@tanstack/react-router";
import Home from "../components/Home";
import { queryOptions } from "@tanstack/react-query";
import { queryClient } from "../App";
import LoadingComponent from "../components/LoadingComponent";
import MissingPage from "../components/MissingPage";
import fetch from "../utilities/fetch";
import ErrorPage from "../components/ErrorPage";

export const dealProductsQueryOptions = queryOptions({
  queryKey: ["index-deals"],
  queryFn: async () =>
    await fetch.get(
      "api/products?deals=true&discount_low=0.1&discount_high=0.5&limit=5"
    ),
  staleTime: 1000 * 60 * 5,
});
export const popularProductQueryOptions = queryOptions({
  queryKey: ["index-bestsellers"],
  queryFn: async () =>
    await fetch.get("/api/products?sort=-total_bought&limit=5"),
  staleTime: 1000 * 60 * 5,
});

export const Route = createFileRoute("/")({
  component: () => <Home />,
  pendingComponent: () => <LoadingComponent />,
  notFoundComponent: () => <MissingPage />,
  loader: async () => {
    await queryClient.ensureQueryData(dealProductsQueryOptions);
    return queryClient.ensureQueryData(popularProductQueryOptions);
  },
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
});
