import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../../../App";
import ProductPage from "../../../components/ProductPage";
import LoadingComponent from "../../../components/LoadingComponent";
import MissingPage from "../../../components/MissingPage";
import ErrorPage from "../../../components/ErrorPage";
import fetch from "../../../utilities/fetch";

export function singleProductQueryOption(productId: string) {
  return queryOptions({
    queryKey: [productId],
    queryFn: async () => (await fetch.get(`/api/product/${productId}`)).data,
    staleTime: 1000 * 60 * 5,
  });
}
export function singleProductReviewQuery(productId: string) {
  return queryOptions({
    queryKey: [productId, "review"],
    queryFn: async () => await fetch.get(`api/reviews/product/${productId}`),
    staleTime: 1000 * 60 * 5,
  });
}

export const Route = createFileRoute("/shop/product/$productId")({
  component: () => <ProductPage />,
  pendingComponent: () => <LoadingComponent />,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  notFoundComponent: () => <MissingPage />,
  loader: async ({ params }) => {
    try {
      const data = await queryClient.ensureQueryData(
        singleProductQueryOption(params.productId)
      );
      const review = await queryClient.ensureQueryData(
        singleProductReviewQuery(params.productId)
      );

      return { data, review };
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 404) {
        throw notFound();
      }
    }
  },
});
