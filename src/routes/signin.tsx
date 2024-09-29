import { createFileRoute, redirect } from "@tanstack/react-router";
import SignIn from "../pages/SignIn";
import isAuthenticated from "../utilities/isAuthenticated";
import LoadingComponent from "../components/LoadingComponent";
import MissingPage from "../components/MissingPage";
import ErrorPage from "../components/ErrorPage";

export const Route = createFileRoute("/signin")({
  component: () => <SignIn />,
  pendingComponent: () => <LoadingComponent />,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  notFoundComponent: () => <MissingPage />,
  beforeLoad: async () => {
    const isAuth = await isAuthenticated();
    if (isAuth) {
      throw redirect({ to: "/", replace: true });
    }
  },
});
