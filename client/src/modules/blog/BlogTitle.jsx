/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
const BlogTitleStyles = styled.h3`
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.25px;
  font-weight: bold;
  a {
    display: block;
  }
  ${(props) =>
    props.size === "normal" &&
    css`
      font-size: 18px;
      @media screen and (max-width: 1023.98px) {
        font-size: 14px;
      }
    `};
  ${(props) =>
    props.size === "big" &&
    css`
      font-size: 24px;
      @media screen and (max-width: 1023.98px) {
        font-size: 16px;
      }
    `};
`;

const BlogTitle = ({ children, className = "", size = "normal", to = "" }) => {
  return (
    <BlogTitleStyles size={size} className={`post-title ${className}`}>
      <NavLink to={to}>
        <p className="text-gray-700 line-clamp-2">{children}</p>
      </NavLink>
    </BlogTitleStyles>
  );
};

export default BlogTitle;
