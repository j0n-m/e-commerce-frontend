import { createFileRoute, redirect } from "@tanstack/react-router";
import SignUp from "../pages/SignUp";
import isAuthenticated from "../utilities/isAuthenticated";

export const Route = createFileRoute("/signup")({
  component: () => <SignUp />,
  beforeLoad: async () => {
    const isAuth = await isAuthenticated();
    if (isAuth) {
      throw redirect({ to: "/", replace: true });
    }
  },
});
