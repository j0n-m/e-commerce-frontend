import {
  IconStars,
  IconTruckDelivery,
  IconUserCircle,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

const dashboard = [
  {
    link: "/account/profile",
    label: "Profile",
    icon: <IconUserCircle stroke={1.25} size={30}></IconUserCircle>,
  },
  {
    link: "/account/orders",
    label: "My Orders",
    icon: <IconTruckDelivery stroke={1.25} size={30}></IconTruckDelivery>,
  },
  {
    link: "/account/myreviews",
    label: "My Reviews",
    icon: (
      <IconStars
        color="#FFA46B"
        stroke={1.25}
        size={30}
        fill="#FFA46B"
      ></IconStars>
    ),
  },
];
function AccountDashboard() {
  return (
    <main className="flex-1 p-4">
      <div className="max-w-[700px] mx-auto">
        <h1 className="text-2xl font-bold">Your Account</h1>
        <div className="dashboard mt-4 grid grid-cols-[repeat(auto-fit,200px)] place-content-center gap-4 text-center">
          {dashboard.map((item) => {
            return (
              <Link to={item.link} className="" key={item.label}>
                <div className="card profile p-4 border dark:border-a4sd dark:bg-a1d min-h-[100px] flex gap-2 items-center justify-center font-bold rounded-lg hover:bg-a3sd focus-visible:bg-a3sd">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default AccountDashboard;
