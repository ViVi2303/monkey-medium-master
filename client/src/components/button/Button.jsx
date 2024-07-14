/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react/prop-types */
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import LoadingSpinner from "../loading/LoadingSpinner";

const ButtonStyles = styled.button`
  cursor: pointer;
  padding: 0 10px;
  margin: 0 5px;
  line-height: 1;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  height: ${(props) => props.height || "66px"};
  width: ${(props) => props.width || ""};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  z-index: 0;
  position: relative;

  ${(props) =>
    props.notification !== "" &&
    css`
      &:after {
        content: "${(props) =>
          props.notification && +props.notification >= 5
            ? "5+"
            : props.notification}";
        position: absolute;
        top: -5px;
        right: -5px;
        border-radius: 50%;
        height: 20px;
        width: 20px;
        font-size: 14px;
        color: white;
        font-weight: 300;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${(props) => props.theme.red};
      }
    `};
  ${(props) =>
    props.kind === "secondary" &&
    css`
      color: ${(props) => props.theme.primary};
      background-color: white;
      &:hover {
        color: ${(props) => props.theme.secondary};
      }
    `};
  ${(props) =>
    props.kind === "primary" &&
    css`
      color: white;
      background-color: ${(props) => props.theme.primary};
      &:hover {
        background-color: ${props.theme.secondary};
      }
    `};
  ${(props) =>
    props.kind === "ghost" &&
    css`
      color: ${(props) => props.theme.primary};
      background-color: rgba(29, 192, 113, 0.1);
    `};
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;
/**
 * @param {*} onClick Handler onClick
 * @requires
 * @param {string} type Type of button 'button' | 'submit'
 */
const Button = ({
  type = "button",
  onClick = () => {},
  children,
  kind = "primary",
  notification = "",
  to,
  ...props
}) => {
  const { isLoading } = props;
  const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
  if (to !== "" && typeof to === "string") {
    return (
      <NavLink to={to} className="inline-block">
        <ButtonStyles
          type={type}
          kind={kind}
          notification={notification}
          {...props}
        >
          {child}
        </ButtonStyles>
      </NavLink>
    );
  }
  return (
    <ButtonStyles
      type={type}
      kind={kind}
      notification={notification}
      onClick={onClick}
      {...props}
    >
      {child}
    </ButtonStyles>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]),
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  notification: PropTypes.string,
  kind: PropTypes.oneOf(["primary", "secondary", "ghost"]),
};

export default Button;
