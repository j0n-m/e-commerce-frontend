import { queryClient } from "../App";
import fetch from "./fetch";

export default async function isAuthenticated(): Promise<boolean> {
  //because __root route handles invalidating queries, we no longer need to add this line
  // await queryClient.invalidateQueries({ queryKey: ["auth"] });
  const getUserAuth = await queryClient.fetchQuery({
    queryKey: ["auth"],
    queryFn: () =>
      fetch.post(
        "/auth/check-auth",
        {},
        {
          withCredentials: true,
        }
      ),
    staleTime: 1000 * 60 * 5,
  });
  const data = getUserAuth.data;

  if (data) {
    return data.isAuth;
  }
  if (!data) {
    const error = new Error("Error retrieving auth info.");
    console.error(error);
  }

  return false;
}
