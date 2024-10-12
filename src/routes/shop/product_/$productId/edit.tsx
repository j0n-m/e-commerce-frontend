import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import axios from "axios";
import { queryClient } from "../../../../App";
import EditProduct from "../../../../components/EditProduct";
import LoadingComponent from "../../../../components/LoadingComponent";
import ErrorPage from "../../../../components/ErrorPage";
import isAuthenticated from "../../../../utilities/isAuthenticated";

//Gets the most current product details
export function editProductOption(productId: string) {
  return queryOptions({
    queryKey: ["edit", productId],
    queryFn: async () =>
      await axios.get(`http://localhost:3000/api/product/${productId}`),
    staleTime: 1000 * 60 * 5,
  });
}
export function allCategoriesOption() {
  return queryOptions({
    queryKey: ["edit", "categories"],
    queryFn: async () =>
      await axios.get("http://localhost:3000/api/categories"),
    staleTime: 1000 * 60 * 5,
  });
}

export const Route = createFileRoute("/shop/product/$productId/edit")({
  component: () => <EditProduct />,
  loader: ({ params }) => {
    queryClient.ensureQueryData(editProductOption(params.productId));
    return queryClient.ensureQueryData(allCategoriesOption());
  },
  beforeLoad: async ({ params }) => {
    const auth = (await isAuthenticated(true)) as {
      isAuth: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: any;
    };

    if (!auth.isAuth || !auth.user?.is_admin) {
      throw redirect({
        to: "/shop/product/$productId",
        replace: true,
        params: { productId: params.productId },
      });
    }
  },
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  pendingComponent: () => <LoadingComponent />,
});
