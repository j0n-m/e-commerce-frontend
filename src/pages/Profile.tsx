import React from "react";
import useAuth from "../hooks/useAuth";

function Profile() {
  const { user } = useAuth();
  const userCreateDate = user?.created_at;
  return (
    <div className="mt-4 shadow-card max-w-[700px] mx-auto border border-neutral-200 bg-white dark:bg-[#30313d] dark:border-[#3f4050]  p-4">
      <h2 className="text-2xl font-bold text-center">
        <span className="">
          Welcome to the test profile, {user?.first_name}
        </span>
      </h2>
      <h3 className="font-bold">User Info</h3>
      <p>User Id: {user?.id}</p>
      <p>Username: {user?.username}</p>
      <p>First Name: {user?.first_name}</p>
      <p>Last Name: {user?.last_name}</p>
      <p>Email: {user?.email}</p>
      <p>
        Account creation date:{" "}
        {new Date(userCreateDate || Date.now()).toDateString()}
      </p>
      <p>Is Admin? {user?.is_admin ? "Yes" : "No"}</p>
      <p>
        User code: {user?.user_code === 1 ? "1 -> Customer" : user?.user_code}
      </p>
    </div>
  );
}

export default Profile;
