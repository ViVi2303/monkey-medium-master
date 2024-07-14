import { NavbarHome } from "../components/navbar";
import { Outlet } from "react-router-dom";

const MeNotificationPage = () => {
  const navStory = [
    {
      title: "See All",
      url: "/me/notifications",
    },
  ];
  return (
    <>
      <div className="w-full">
        <div className="my-5 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Notifications</h1>
        </div>
        <NavbarHome data={navStory} className="flex-1 mt-9 w-full"></NavbarHome>
        <div className="mt-4">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
};

export default MeNotificationPage;
