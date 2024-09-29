import { createFileRoute } from "@tanstack/react-router";
import CheckoutComplete from "../../pages/CheckoutComplete";

export const Route = createFileRoute("/checkout/complete")({
  component: () => <CheckoutComplete />,
});
