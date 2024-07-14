// eslint-disable-next-line no-unused-vars
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Col, Row } from "antd";
import HomeSide from "../modules/home/HomeSide";
import { NavLink, Outlet } from "react-router-dom";
import { NavbarHome } from "../components/navbar";

const HomePageStyle = styled.div``;

const navHome = [
  {
    title: "New",
    url: "/",
  },
  {
    title: "Following",
    url: "/following",
  },
];

const HomePage = () => {
  return (
    <HomePageStyle>
      <div className="w-full border-t border-gray-300"></div>
      <Row className="px-5 ">
        <Col
          xs={24}
          md={15}
          className="flex flex-col w-full border-r border-gray-300"
        >
          <div className="max-w-[700px] w-full mx-auto my-0 mt-8 flex items-center px-5 ">
            <NavLink to={"/me/following"}>
              <button className="mr-5 text-gray-400 transition-all hover:text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </NavLink>
            <NavbarHome data={navHome} className="flex-1"></NavbarHome>
          </div>
          <Outlet></Outlet>
        </Col>
        <Col xs={0} md={9}>
          <HomeSide></HomeSide>
        </Col>
      </Row>
    </HomePageStyle>
  );
};

export default HomePage;
