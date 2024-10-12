import { createFileRoute, redirect } from "@tanstack/react-router";
import ErrorPage from "../../../components/ErrorPage";
import MissingPage from "../../../components/MissingPage";
import LoadingComponent from "../../../components/LoadingComponent";
import isAuthenticated from "../../../utilities/isAuthenticated";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import fetch from "../../../utilities/fetch";
import { queryClient } from "../../../App";
import { AxiosResponse } from "axios";
import MyReviews from "../../../pages/MyReviews";

export const reviewsByCustomerQueryOption = ({
  userId,
  page = 1,
}: {
  page?: number;
  userId: string;
}) => {
  return queryOptions({
    queryKey: ["customerReviews", { userId: userId }],
    queryFn: async () => {
      return await fetch.get(`api/reviews?customer=${userId}&page=${page}`);
    },
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });
};
export const Route = createFileRoute("/account/myreviews/")({
  component: () => <MyReviews />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  notFoundComponent: () => <MissingPage />,
  pendingComponent: () => <LoadingComponent />,
  loader: async () => {
    const authcache = queryClient.getQueryData(["auth"]) as AxiosResponse;

    try {
      if (authcache) {
        const user = authcache.data.user;
        const res = await queryClient.ensureQueryData(
          reviewsByCustomerQueryOption({ userId: user.id })
        );
        return res;
      } else {
        throw new Error("Customer is not authenticated");
      }
      // const res = await queryClient.ensureQueryData(reviewsByCustomerQueryOption({}))
    } catch (error) {
      console.error(error);
    }
  },
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
