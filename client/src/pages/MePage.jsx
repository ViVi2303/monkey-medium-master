// eslint-disable-next-line no-unused-vars
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { NavbarHome } from "../components/navbar";
import StickyBox from "react-sticky-box";
import { Col, Row } from "antd";

const MePageStyle = styled.div``;

const navMe = [
  {
    title: "Following",
    url: "/me/following",
  },
  {
    title: "Muted",
    url: "/me/muted",
  },
  {
    title: "Blocked",
    url: "/me/blocked",
  },
  {
    title: "Suggestions",
    url: "/me/suggestions",
  },
];

const MePage = () => {
  return (
    <MePageStyle>
      <div className="w-full border-t border-gray-300 "></div>
      <Row className="px-5 ">
        <Col xs={24} md={15}>
          <div className="pb-20 border-r border-gray-300">
            <div className="max-w-[700px] w-full mx-auto pt-9 ">
              <h1 className="mb-5 text-4xl font-semibold leading-normal">
                Refine recommendations
              </h1>
              <h3 className="mb-10 text-xs text-gray-500">
                Adjust recommendations by updating what you’re following, your
                reading history, and who you’ve muted.
              </h3>
              <div className="flex items-center mt-8">
                <NavbarHome data={navMe} className="flex-1"></NavbarHome>
              </div>
              <div className="">
                <Outlet></Outlet>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={0} md={9}>
          <StickyBox>
            <div className="me-side max-w-[400px] w-full"></div>
          </StickyBox>
        </Col>
      </Row>
    </MePageStyle>
  );
};

export default MePage;
