import { createFileRoute, redirect } from "@tanstack/react-router";
import CreateProduct from "../../../pages/CreateProduct";
import { queryClient } from "../../../App";
import { allCategoriesOption } from "../product_/$productId/edit";
import isAuthenticated from "../../../utilities/isAuthenticated";
import LoadingComponent from "../../../components/LoadingComponent";
import ErrorPage from "../../../components/ErrorPage";
import MissingPage from "../../../components/MissingPage";

export const Route = createFileRoute("/shop/products/create")({
  component: () => <CreateProduct />,
  pendingComponent: () => <LoadingComponent />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  notFoundComponent: () => <MissingPage />,
  loader: async () => {
    return await queryClient.ensureQueryData(allCategoriesOption());
  },
  beforeLoad: async () => {
    const auth = (await isAuthenticated(true)) as {
      isAuth: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: any;
    };

    if (!auth || !auth?.user?.is_admin) {
      throw redirect({
        to: "/signin",
        replace: true,
      });
    }
  },
});
