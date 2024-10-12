import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../../../App";
import ProductPage from "../../../components/ProductPage";
import LoadingComponent from "../../../components/LoadingComponent";
import MissingPage from "../../../components/MissingPage";
import ErrorPage from "../../../components/ErrorPage";
import fetch from "../../../utilities/fetch";
import { ReviewType } from "../../../types/ReviewType";
import isAuthenticated from "../../../utilities/isAuthenticated";

export function singleProductQueryOption(productId: string) {
  return queryOptions({
    queryKey: ["product", { id: productId }],
    queryFn: async () => (await fetch.get(`/api/product/${productId}`)).data,
    staleTime: 1000 * 60 * 10,
  });
}
export function productReviewsQuery(productId: string) {
  return queryOptions({
    queryKey: ["reviews", { id: productId }],
    queryFn: async () => await fetch.get(`api/reviews/product/${productId}`),
    staleTime: 1000 * 60 * 10,
  });
}
export function orderHistoryByUserQuery(userId: string, productId: string) {
  return queryOptions({
    queryKey: ["orderhistory", { id: userId, product: productId }],
    queryFn: async () =>
      await fetch.get(
        `api/orderhistory/customer/${userId}?product=${productId}`,
        {
          withCredentials: true,
        }
      ),
    staleTime: 1000 * 60 * 10,
  });
}

export const Route = createFileRoute("/shop/product/$productId")({
  component: () => <ProductPage />,
  pendingComponent: () => <LoadingComponent />,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  notFoundComponent: () => <MissingPage />,
  loader: async ({ params }) => {
    let isEligibleToReview: boolean = false;
    try {
      const data = await queryClient.ensureQueryData(
        singleProductQueryOption(params.productId)
      );
      const review = await queryClient.ensureQueryData(
        productReviewsQuery(params.productId)
      );
      const auth = (await isAuthenticated(true)) as {
        isAuth: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: any;
      };

      if (auth.isAuth) {
        const userId = auth.user.id;
        //look through review arr for this user id return true/false
        const hasReviewed: boolean = review.data?.reviews
          .map((obj: ReviewType) => obj.reviewer)
          .some((v: string) => v === userId);
        const usersOrders = (
          await queryClient.ensureQueryData(
            orderHistoryByUserQuery(userId, params.productId)
          )
        ).data;
        const hasPurchasedProduct = !!usersOrders.records_count;
        isEligibleToReview = hasPurchasedProduct && !hasReviewed;
        return { data, review, isEligibleToReview };
      }

      return { data, review, isEligibleToReview };
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 404) {
        throw notFound();
      }
    }
  },
});
