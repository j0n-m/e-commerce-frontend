import { createRootRoute } from "@tanstack/react-router";
import MissingPage from "../components/MissingPage";
import App, { queryClient } from "../App";
import ErrorPage from "../components/ErrorPage";
import React, { Suspense } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <App />
        <Suspense>
          <TanStackRouterDevtools />
        </Suspense>
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
