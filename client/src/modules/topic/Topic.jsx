// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";

import styled, { css } from "styled-components";

const TopicStyle = styled.section`
  display: inline-block;
  padding: 3px 10px 4px;
  border-radius: 20px;
  color: ${(props) => props.theme.gray6B};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  a {
    display: block;
  }
  ${(props) =>
    props.type === "primary" &&
    css`
      background-color: ${(props) => props.theme.grayF1};
    `};
  ${(props) =>
    props.type === "secondary" &&
    css`
      background-color: white;
    `};
  @media screen and (max-width: 1023.98px) {
    font-size: 10px;
  }
`;

// eslint-disable-next-line react/prop-types
const Topic = ({ children, type = "primary", className = "", to = "" }) => {
  return (
    <TopicStyle type={type} className={`post-category ${className}`}>
      <Link to={`/${to}`}>{children}</Link>
    </TopicStyle>
  );
};

export default Topic;
