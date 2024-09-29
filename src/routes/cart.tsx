import { createFileRoute } from "@tanstack/react-router";
import Cart from "../components/Cart";

export const Route = createFileRoute("/cart")({
  component: () => <Cart />,
  beforeLoad: () => {
    console.log(Route.fullPath);
  },
});
