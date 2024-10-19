import { useNavigate } from "@tanstack/react-router";
import { queryClient } from "../App";
import { useMutation } from "@tanstack/react-query";
import fetch from "../utilities/fetch";

function useSignOut() {
  const navigate = useNavigate();
  const signoutMutate = useMutation({
    mutationFn: async () =>
      await fetch.post("auth/logout", {}, { withCredentials: true }),
    onSuccess: async () => {
      //as long as navigating to each route resets "auth" query, no need to manually invalidate here
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      await navigate({ to: "/", replace: true });
    },
  });
  const handleSignOut = () => {
    signoutMutate.mutate();
  };
  return { handleSignOut };
}

export default useSignOut;
