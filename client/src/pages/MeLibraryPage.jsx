import React from "react";
import { NavbarHome } from "../components/navbar";
import { Outlet } from "react-router-dom";

const MeLibraryPage = () => {
  const navLibrary = [
    {
      title: "Reading history",
      url: "/me/library/reading-history",
    },
  ];
  return (
    <div className="w-full">
      <div className="my-5 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Your Library</h1>
      </div>
      <NavbarHome data={navLibrary} className="flex-1 mt-9 "></NavbarHome>
      <div className="mt-4">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default MeLibraryPage;
