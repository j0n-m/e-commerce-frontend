import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import fetch from "../utilities/fetch";

function Profile() {
  const { user } = useAuth();
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const userCreateDate = user?.created_at;
  // async function handleDelete() {
  //   if (orderHistory?.length < 1 || !orderHistory) {
  //     return;
  //   }
  //   const orderIds = orderHistory.map((d) => d._id);
  //   for (const id of orderIds) {
  //     await fetch.delete(`/api/orderhistory/${id}`);
  //   }
  //   console.log("done");
  // }
  useEffect(() => {
    const run = async () => {
      const orders = await fetch.get(`api/orderhistory/customer/${user?.id}`, {
        withCredentials: true,
      });
      console.log("past orders", orders.data);
      setOrderHistory(orders.data.order_history);
    };
    if (user?.id) {
      try {
        run();
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  // return dashboard;
  return (
    <main className="flex-1 p-4">
      <p className="text-center">*Add Ability to change firstname,lastname</p>

      <div className="mt-2 shadow-card max-w-[700px] mx-auto border border-neutral-200 bg-white dark:bg-[#30313d] dark:border-[#3f4050] p-4">
        <h2 className="text-2xl font-bold text-center">
          <span className="">
            Welcome to the test profile, {user?.first_name}
          </span>
        </h2>

        {/* <button onClick={handleDelete}>delete order history</button> */}
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
    </main>
  );
}

export default Profile;
