import { createFileRoute, redirect } from "@tanstack/react-router";
import VerifyCheckoutPage from "../../pages/VerifyCheckoutPage";
import ErrorPage from "../../components/ErrorPage";
import LoadingComponent from "../../components/LoadingComponent";
import isAuthenticated from "../../utilities/isAuthenticated";

export const Route = createFileRoute("/checkout/")({
  component: () => <VerifyCheckoutPage />,
  pendingComponent: () => <LoadingComponent />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  beforeLoad: async () => {
    // const cart = localStorage.getItem("cart");
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      throw redirect({
        to: "/signin",
        replace: true,
      });
    }
  },
});
