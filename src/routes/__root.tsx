import { createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import MissingPage from "../components/MissingPage";
import App from "../App";
import ErrorPage from "../components/ErrorPage";

export const Route = createRootRoute({
  component: () => (
    <>
      <App />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => <MissingPage />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
});
