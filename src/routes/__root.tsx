import { createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import MissingPage from "../components/MissingPage";
import App from "../App";

export const Route = createRootRoute({
  component: () => (
    <>
      <App />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => <MissingPage />,
});
