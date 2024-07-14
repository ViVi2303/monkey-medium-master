/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import styled from "styled-components";
const BlogMetaStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: inherit;
  .post {
    &-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: currentColor;
      border-radius: 100rem;
    }
  }
  @media screen and (max-width: 1023.98px) {
    font-size: 10px;
    gap: 6px;
  }
`;

const BlogMeta = ({
  date = "Mar 23",
  authorName = "Andiez Le",
  className = "",
  to = "",
}) => {
  function formatDate(isoDateString) {
    const options = { month: "short", day: "numeric" };
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", options);
  }
  return (
    <BlogMetaStyles className={`post-meta ${className}`}>
      <Link to={`/profile/${to}`}>
        <span className="text-gray-700 post-author ">{authorName}</span>
      </Link>
      <span className="post-dot"></span>
      <span className="post-time">{formatDate(date)}</span>
    </BlogMetaStyles>
  );
};

export default BlogMeta;
