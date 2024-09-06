import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { queryClient } from "../../../../App";
import EditProduct from "../../../../components/EditProduct";
import LoadingComponent from "../../../../components/LoadingComponent";

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
  errorComponent: () => <p>Error loading resources.</p>,
  pendingComponent: () => <LoadingComponent />,
});
