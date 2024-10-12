import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import fetch from "../utilities/fetch";
import { Outlet } from "@tanstack/react-router";

function PersistAuth() {
  const { user, setUser } = useAuth();
  const getUserAuth = useQuery({
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
  useEffect(() => {
    if (getUserAuth.data && getUserAuth.isSuccess) {
      const userData = getUserAuth.data.data.user;
      const isAuth = getUserAuth.data.data.isAuth as boolean;
      if (isAuth && !user) {
        console.log("persist auth: adding user to context b/c isAuth is true");
        setUser(userData);
      }
      if (!isAuth && user) {
        console.log("persist auth: reseting user to null", isAuth);
        setUser(null);
      }
    }
  }, [user, getUserAuth.data, getUserAuth.isSuccess, setUser]);
  return (
    <>
      <Outlet></Outlet>
    </>
  );
}

export default PersistAuth;
