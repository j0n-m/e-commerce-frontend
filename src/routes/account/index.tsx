import { createFileRoute, redirect } from "@tanstack/react-router";
import ErrorPage from "../../components/ErrorPage";
import MissingPage from "../../components/MissingPage";
import LoadingComponent from "../../components/LoadingComponent";
import AccountDashboard from "../../pages/AccountDashboard";
import isAuthenticated from "../../utilities/isAuthenticated";

export const Route = createFileRoute("/account/")({
  component: () => <AccountDashboard />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  notFoundComponent: () => <MissingPage />,
  pendingComponent: () => <LoadingComponent />,
  beforeLoad: async () => {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      throw redirect({
        to: "/signin",
        replace: true,
        search: { from: window.location.pathname },
      });
    }
  },
});
