/* eslint-disable react/prop-types */
import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { useEffect } from "react";

const AuthenticationPageStyles = styled.div`
  min-height: 100vh;
  padding: 40px;
  .logo {
    margin: 0 auto 20px;
  }
  .heading {
    text-align: center;
    font-weight: bold;
    font-size: 40px;
    margin-bottom: 60px;
  }
  .form {
    max-width: 600px;
    margin: 0 auto;
  }
  .have-account {
    margin-bottom: 20px;
    font-size: 14px;
    a {
      display: inline-block;
      color: ${(props) => props.theme.primary};
      font-weight: 500;
    }
  }
`;

const AuthenticationPage = () => {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) window.location.replace("/");
  }, [token]);

  return (
    <AuthenticationPageStyles>
      <div className="container">
        <div className="mb-5 text-center">
          <NavLink to="/" className="inline-block w-16 h-16">
            <img srcSet={logo} alt="monkey-blogging" className="logo" />
          </NavLink>
        </div>
        <div className="flex justify-center">
          <h1 className="heading bg-gradient-to-r from-[#74B9FF] to-[#0be881] text-transparent bg-clip-text inline-block">
            Monkey Medium
          </h1>
        </div>
        <Outlet></Outlet>
      </div>
    </AuthenticationPageStyles>
  );
};

export default AuthenticationPage;
