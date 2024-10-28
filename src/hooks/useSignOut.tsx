import { useNavigate } from "@tanstack/react-router";
import { queryClient } from "../App";
import { useMutation } from "@tanstack/react-query";
import fetch from "../utilities/fetch";
import useBroadcast from "./useBroadcast";

function useSignOut() {
  const { broadcast } = useBroadcast({
    channelName: "logout",
    messageHandler: async () => await handleSuccess(),
  });
  const handleSuccess = async () => {
    //as long as navigating to each route resets "auth" query, no need to manually invalidate here
    await queryClient.invalidateQueries({ queryKey: ["auth"] });
    // queryClient.clear();
    // localStorage.removeItem("user")
    await navigate({ to: "/", replace: true });
  };
  const navigate = useNavigate();
  const signoutMutate = useMutation({
    mutationFn: async () =>
      await fetch.post("auth/logout", {}, { withCredentials: true }),
    onSuccess: async () => handleSuccess(),
  });
  const handleSignOut = () => {
    signoutMutate.mutate();
    broadcast("logout");
  };
  return { handleSignOut };
}

export default useSignOut;
