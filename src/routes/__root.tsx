import { createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import MissingPage from "../components/MissingPage";
import App, { queryClient } from "../App";
import ErrorPage from "../components/ErrorPage";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <App />
        <TanStackRouterDevtools />
      </>
    );
  },
  notFoundComponent: () => <MissingPage />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  beforeLoad: async () => {
    //Rechecks auth status everytime user click other pages
    await queryClient.invalidateQueries({ queryKey: ["auth"] });
  },
});
