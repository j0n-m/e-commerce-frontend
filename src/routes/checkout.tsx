import { createFileRoute, redirect } from "@tanstack/react-router";
import CheckoutPage from "../pages/CheckoutPage";
import ErrorPage from "../components/ErrorPage";
import checkAndParseCart from "../utilities/checkAndParseCart";

export const Route = createFileRoute("/checkout")({
  component: () => <CheckoutPage />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  beforeLoad: () => {
    const check = checkAndParseCart();

    if (!check.success) {
      console.log("router->redirect");
      throw redirect({ to: "/cart" });
    }
  },
});
