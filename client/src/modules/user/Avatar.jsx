/* eslint-disable react/prop-types */
import styled, { css } from "styled-components";
import addUrlToImg from "../modulesJs/addUrlToImg";

const AvatarStyle = styled.div`
  ${(props) =>
    props.size === "xs" &&
    css`
      height: 25px;
      width: 25px;
    `};
  ${(props) =>
    props.size === "small" &&
    css`
      height: 35px;
      width: 35px;
    `};
  ${(props) =>
    props.size === "medium" &&
    css`
      height: 45px;
      width: 45px;
    `};
  ${(props) =>
    props.size === "large" &&
    css`
      height: 80px;
      width: 80px;
    `};
  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Avatar = ({ url = "", alt = "", size }) => {
  return (
    <AvatarStyle size={size}>
      <img
        className="avatar rounded-1/2"
        src={addUrlToImg(url)}
        alt={alt}
        loading="lazy"
      />
    </AvatarStyle>
  );
};

export default Avatar;
