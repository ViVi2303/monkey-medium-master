// eslint-disable-next-line no-unused-vars
import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { Outlet, useSearchParams } from "react-router-dom";
import { NavbarHome } from "../components/navbar";
import StickyBox from "react-sticky-box";
import { Col, Row } from "antd";
import PageNotFound from "./PageNotFound";

const SearchPageStyle = styled.div``;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const navSearch = [
    {
      title: "Stories",
      url: `/search/?q=${q}`,
    },
    {
      title: "People",
      url: `/search/people/?q=${q}`,
    },
    {
      title: "topics",
      url: `/search/topics/?q=${q}`,
    },
  ];

  if (!q) return <PageNotFound></PageNotFound>;
  return (
    <SearchPageStyle>
      <div className="w-full border-t border-gray-300 "></div>
      <Row className="px-5 ">
        <Col xs={24} md={15}>
          <div className="max-w-[700px] w-full mx-auto pt-9">
            <h1 className="mb-5 ml-5 text-4xl font-bold leading-normal text-gray-400">
              Results for <span className="text-black">{q}</span>
            </h1>
            <div className="flex items-center px-5 mt-8">
              <NavbarHome data={navSearch} className="flex-1"></NavbarHome>
            </div>
            <Outlet></Outlet>
          </div>
        </Col>
        <Col xs={0} md={9}>
          <StickyBox>
            <div className="me-side max-w-[400px] w-full border-l border-gray-300 min-h-[calc(100vh-75px)]"></div>
          </StickyBox>
        </Col>
      </Row>
    </SearchPageStyle>
  );
};

export default SearchPage;
