import { createFileRoute, redirect } from "@tanstack/react-router";
import isAuthenticated from "../../../../utilities/isAuthenticated";
import ErrorPage from "../../../../components/ErrorPage";
import MissingPage from "../../../../components/MissingPage";
import LoadingComponent from "../../../../components/LoadingComponent";
import fetch from "../../../../utilities/fetch";
import { ReviewType } from "../../../../types/ReviewType";
import { queryOptions } from "@tanstack/react-query";
import { queryClient } from "../../../../App";
import EditReview from "../../../../pages/EditReview";

export const singleReviewQueryOption = (reviewId: string) => {
  return queryOptions({
    queryKey: ["review", { reviewId }],
    queryFn: async () => {
      return fetch.get(`api/review/${reviewId}`);
    },
    staleTime: 1000 * 60 * 10,
  });
};
export const Route = createFileRoute("/shop/review/$reviewId/edit")({
  component: () => <EditReview></EditReview>,
  pendingComponent: () => <LoadingComponent />,
  notFoundComponent: () => <MissingPage />,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  loader: async ({ params: { reviewId } }) => {
    try {
      const reviewResponse = await queryClient.ensureQueryData(
        singleReviewQueryOption(reviewId)
      );
      return reviewResponse;
    } catch (error) {
      console.error(error);
    }
  },
  beforeLoad: async ({ params: { reviewId } }) => {
    try {
      const auth = (await isAuthenticated(true)) as {
        isAuth: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: any;
      };

      if (!auth.isAuth) {
        throw redirect({
          to: "/signin",
          search: { from: window.location.pathname },
          replace: true,
        });
      }
      if (auth.user.is_admin) {
        return true;
      }
      const response = await fetch(`api/review/${reviewId}`);
      if (response.data) {
        const review = response.data.review as ReviewType;
        const hasPermission = review.reviewer._id === auth.user.id;
        if (!hasPermission) {
          throw redirect({
            to: "/shop/review/$reviewId",
            params: { reviewId },
            replace: true,
          });
        }
      }
    } catch (error) {
      if ((error as Partial<{ statusCode: number }>).statusCode === 307) {
        throw error;
      }
    }
  },
});
