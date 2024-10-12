import { queryClient } from "../App";
import fetch from "./fetch";

export default async function isAuthenticated(includeUserId = false) {
  //because __root route handles invalidating queries, we no longer need to add this line
  await queryClient.invalidateQueries({ queryKey: ["auth"] });
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

  if (data && includeUserId) {
    return { isAuth: data.isAuth as boolean, user: data.user };
  } else if (data && !includeUserId) {
    return data.isAuth as boolean;
  }
  //no data
  return false;
}
