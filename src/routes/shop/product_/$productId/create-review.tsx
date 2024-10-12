import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import CreateReview from "../../../../pages/CreateReview";
import isAuthenticated from "../../../../utilities/isAuthenticated";
import LoadingComponent from "../../../../components/LoadingComponent";
import MissingPage from "../../../../components/MissingPage";
import ErrorPage from "../../../../components/ErrorPage";
import { queryClient } from "../../../../App";
import {
  orderHistoryByUserQuery,
  singleProductQueryOption,
} from "../../product/$productId";
import { AxiosError } from "axios";

export const Route = createFileRoute("/shop/product/$productId/create-review")({
  component: () => <CreateReview />,
  pendingComponent: () => <LoadingComponent />,
  notFoundComponent: () => <MissingPage />,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  loader: async ({ params }) => {
    try {
      const auth = (await isAuthenticated(true)) as {
        isAuth: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: any;
      };
      const data = await queryClient.ensureQueryData(
        singleProductQueryOption(params.productId)
      );
      const productFromOrderHistory = (
        await queryClient.fetchQuery(
          orderHistoryByUserQuery(auth?.user?.id, params.productId)
        )
      ).data;
      return { data, productFromOrderHistory };
    } catch (error) {
      if ((error as AxiosError)?.response?.status == 404) {
        throw notFound();
      }
    }
  },
  beforeLoad: async ({ params: { productId } }) => {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      throw redirect({
        to: "/shop/product/$productId",
        params: { productId },
        replace: true,
      });
    }
  },
});
