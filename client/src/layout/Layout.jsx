// eslint-disable-next-line no-unused-vars
import React, { Fragment, useEffect } from "react";
import Header from "./Header";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
const LayoutStyle = styled.div``;
// eslint-disable-next-line react/prop-types
const Layout = () => {
  return (
    <LayoutStyle>
      <Header></Header>
      <Outlet></Outlet>
    </LayoutStyle>
  );
};

export default Layout;
