import { Button } from "../components/button";
import { NavbarHome } from "../components/navbar";
import { Outlet } from "react-router-dom";

const MeStoryPage = () => {
  const navStory = [
    {
      title: "Drafts",
      url: "/me/stories/drafts",
    },
  ];
  return (
    <>
      <div className="w-full">
        <div className="my-5 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Your stories</h1>
          <Button to={"/write"} height="40px">
            Write a story
          </Button>
        </div>
        <NavbarHome data={navStory} className="flex-1 mt-9 w-full"></NavbarHome>
        <div className="mt-4">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
};

export default MeStoryPage;
