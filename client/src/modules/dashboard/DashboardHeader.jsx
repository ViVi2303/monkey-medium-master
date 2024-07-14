// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Space, Popover } from "antd";
import styled from "styled-components";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/auth-context";
import axios from "axios";
import { config } from "../../utils/constants";

const icons = {
  libraryIcon: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Lists"
    >
      <path
        d="M6.44 6.69h0a1.5 1.5 0 0 1 1.06-.44h9c.4 0 .78.16 1.06.44l.35-.35-.35.35c.28.28.44.66.44 1.06v14l-5.7-4.4-.3-.23-.3.23-5.7 4.4v-14c0-.4.16-.78.44-1.06z"
        stroke="currentColor"
      ></path>
      <path
        d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
    </svg>
  ),
  writeIcon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-7 h-7"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  ),
  notificationIcon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-7 h-7"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  ),
  userIcon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  ),
  storyIcon: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Stories"
    >
      <path
        d="M4.75 21.5h14.5c.14 0 .25-.11.25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .14.11.25.25.25z"
        stroke="currentColor"
      ></path>
      <path
        d="M8 8.5h8M8 15.5h5M8 12h8"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
    </svg>
  ),
};

const HomeStyle = styled.header`
  padding: 10px 20px;
  background-color: white;
  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    display: block;
    max-width: 50px;
  }
`;

const DashboardHeader = () => {
  const { userInfo, setUserInfo } = useAuth();
  const { data } = userInfo;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (data?.role === "user") navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSignOut = useCallback(async () => {
    try {
      const response = await axios.delete(`${config.SERVER_HOST}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("response:", response);
      if (response.data) {
        setUserInfo({});
        localStorage.removeItem("token");
        navigate("/sign-in");
      }
    } catch (error) {
      console.log("error:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = useCallback(function (username, fullname) {
    return (
      <div className="w-[250px] block">
        <h2 className="pb-2 text-sm font-semibold border-b border-gray-300">
          {fullname && fullname?.length > 8
            ? fullname.slice(0, 8) + "..."
            : fullname}
        </h2>
        <NavLink to={`/profile/${username}`}>
          <div className="flex items-center justify-start my-4">
            {icons.userIcon} <p className="ml-3">Profile</p>
          </div>
        </NavLink>

        <div className="w-full btn-sign-out text-start">
          <button
            onClick={handleSignOut}
            className="block px-2 py-2 text-gray-400 hover:text-gray-600"
          >
            Sign out
          </button>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HomeStyle>
        <div className="flex items-center justify-between ">
          <div className="flex items-center justify-center header-right">
            <NavLink to="/">
              <img srcSet={logo} alt="monkey-blogging" className="logo" />
            </NavLink>
          </div>
          <div className="flex items-center justify-center header-left">
            <p className="flex items-center gap-2">
              {data?.username}{" "}
              <span className="text-sm font-semibold text-red-400">
                {data?.role?.toUpperCase()}
              </span>{" "}
            </p>
            <Space direction="vertical" wrap size={16} className="p-1 ml-5">
              <Popover
                placement="bottomRight"
                content={() => content(data?.username, data?.fullname)}
                trigger="click"
              >
                <Avatar
                  className="cursor-pointer"
                  size="large"
                  src={<img src={data?.avatar} alt="avatar" />}
                />
              </Popover>
            </Space>
          </div>
        </div>
      </HomeStyle>
    </>
  );
};

export default DashboardHeader;
