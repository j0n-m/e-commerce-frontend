import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "../../../../App";
import EditProduct from "../../../../components/EditProduct";
import LoadingComponent from "../../../../components/LoadingComponent";
import ErrorPage from "../../../../components/ErrorPage";
import isAuthenticated from "../../../../utilities/isAuthenticated";
import { singleProductQueryOption } from "../../product/$productId";
import fetch from "../../../../utilities/fetch";

//Gets the most current product details
export function editProductOption(productId: string) {
  return queryOptions({
    queryKey: ["edit", productId],
    queryFn: async () => await fetch.get(`api/product/${productId}`),
    staleTime: 1000 * 60 * 5,
  });
}
export function allCategoriesOption() {
  return queryOptions({
    queryKey: ["get_all", "categories"],
    queryFn: async () => await fetch.get("api/categories"),
    staleTime: 1000 * 60 * 5,
  });
}

export const Route = createFileRoute("/shop/product/$productId/edit")({
  component: () => <EditProduct />,
  loader: ({ params }) => {
    // queryClient.ensureQueryData(editProductOption(params.productId));
    queryClient.ensureQueryData(singleProductQueryOption(params.productId));
    return queryClient.ensureQueryData(allCategoriesOption());
  },
  beforeLoad: async ({ params }) => {
    const auth = (await isAuthenticated(true)) as {
      isAuth: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: any;
    };

    if (!auth || !auth?.user?.is_admin) {
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
