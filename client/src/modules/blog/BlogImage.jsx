// eslint-disable-next-line no-unused-vars
import React from "react";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import addUrlToImg from "../modulesJs/addUrlToImg";
const BlogImageStyles = styled.div`
  max-width: 120px;
  width: 100%;
  height: 120px;
  ${(props) =>
    props.kind === "gird" &&
    css`
      max-width: 360px;
      height: 180px;
    `};
  ${(props) =>
    props.kind === "mobile" &&
    css`
      max-width: 80px;
      height: 80px;
    `};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
`;

// eslint-disable-next-line react/prop-types
const BlogImage = ({ className = "", url = "", alt = "", to = "", kind }) => {
  if (to)
    return (
      <NavLink to={to} style={{ display: "block" }}>
        <BlogImageStyles className={`post-image ${className}`} kind={kind}>
          <img src={addUrlToImg(url)} alt={alt} loading="lazy" />
        </BlogImageStyles>
      </NavLink>
    );
  return (
    <BlogImageStyles className={`post-image ${className}`}>
      <img src={url} alt={alt} loading="lazy" />
    </BlogImageStyles>
  );
};

export default BlogImage;
