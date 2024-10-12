import { createFileRoute } from "@tanstack/react-router";
import ErrorPage from "../../../../components/ErrorPage";
import MissingPage from "../../../../components/MissingPage";
import LoadingComponent from "../../../../components/LoadingComponent";
import { queryClient } from "../../../../App";
import { singleReviewQueryOption } from "../$reviewId_/edit";
import ReviewDetails from "../../../../pages/ReviewDetails";

// const allowedToEdit = () => {
//   return queryOptions({
//     queryKey:[""]
//   })
// }
export const Route = createFileRoute("/shop/review/$reviewId/")({
  component: () => <ReviewDetails />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  pendingComponent: () => <LoadingComponent />,
  notFoundComponent: () => <MissingPage />,
  beforeLoad: () => {
    //public page does not need auth
  },
  loader: async ({ params: { reviewId } }) => {
    // const auth = (await isAuthenticated(true)) as {
    //   isAuth: boolean;
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   user: any;
    // };
    const res = await queryClient.ensureQueryData(
      singleReviewQueryOption(reviewId)
    );
    return res;
  },
});
