import { createFileRoute, redirect } from "@tanstack/react-router";
import Profile from "../../pages/Profile";
import isAuthenticated from "../../utilities/isAuthenticated";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorPage from "../../components/ErrorPage";
import MissingPage from "../../components/MissingPage";

export const Route = createFileRoute("/account/profile")({
  component: () => <Profile />,
  pendingComponent: () => <LoadingComponent />,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  notFoundComponent: () => <MissingPage />,

  beforeLoad: async () => {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      throw redirect({ to: "/signin", search: { from: Route.fullPath } });
    }
  },
});
