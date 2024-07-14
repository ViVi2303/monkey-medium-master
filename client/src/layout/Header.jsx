import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Space, Popover } from "antd";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { SearchMain } from "../components/search";
import { Button } from "../components/button";
import Headroom from "react-headroom";
import { useAuth } from "../contexts/auth-context";
import { debounce } from "lodash";
import DropdownSearchMain from "../components/dropdown/DropdownSearchMain";
import useClickOutSide from "../hooks/useClickOutSide";
import { config, icons } from "../utils/constants";
import Notify from "../modules/notification/Notify";
import axios from "axios";
import { apiTopicsSearch, apiUserSearch } from "../api/apisHung";
import { useSocket } from "../contexts/SocketContext";

const HomeStyle = styled.header`
  .wrapper {
    .logo {
      display: block;
      max-width: 35px;
    }
    .headroom {
      z-index: 9999 !important;
    }
  }
`;

// eslint-disable-next-line react/display-name
const Header = () => {
  const { userInfo, setUserInfo } = useAuth();
  const [role, setRole] = useState("user");
  console.log("role:", role);
  const navigate = useNavigate();
  const [inputSearch, setInputSearch] = useState();
  const navigation = useNavigate();
  const [users, setUsers] = useState([]);
  const [topics, setTopics] = useState([]);
  const { show, setShow, nodeRef } = useClickOutSide("searchMain");
  const token = localStorage.getItem("token");
  const [showSearch, setShowSearch] = useState(false);
  const { notifications, countUnRead, handleReadNotify } = useSocket();
  const {
    show: showNotification,
    setShow: setShowNotification,
    nodeRef: nodeRefNotification,
  } = useClickOutSide("notify");

  useEffect(() => {
    if (userInfo && userInfo?.data?.role !== "user") {
      setRole(userInfo?.data?.role);
    }
  }, [userInfo]);

  const handleSignOut = useCallback(async () => {
    try {
      const response = await axios.delete(`${config.SERVER_HOST}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
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

  const content = useCallback(
    function (username, fullname) {
      return (
        <div className="w-[250px] block">
          <h2 className="pb-2 text-sm font-semibold border-b border-gray-300">
            {fullname && fullname?.length > 15
              ? fullname.slice(0, 15) + "..."
              : fullname}
          </h2>
          <NavLink to={`/write`} className="md:hidden">
            <div className="flex items-center justify-start my-4">
              <span className="w-6 h-6">{icons.writeIcon}</span>{" "}
              <p className="ml-3">Write</p>
            </div>
          </NavLink>
          <NavLink to={`/profile/${username}`}>
            <div className="flex items-center justify-start my-4">
              {icons.userIcon} <p className="ml-3">Profile</p>
            </div>
          </NavLink>
          <NavLink to={`/me/library/reading-history`}>
            <div className="flex items-center justify-start my-4">
              {icons.libraryIcon} <p className="ml-3">Library</p>
            </div>
          </NavLink>
          <NavLink to={`me/stories/drafts`}>
            <div className="flex items-center justify-start my-4">
              {icons.storyIcon} <p className="ml-3">Stories</p>
            </div>
          </NavLink>
          {role && role !== "user" && (
            <NavLink to={`/dashboard`}>
              <div className="flex items-center justify-start my-4">
                {icons.dashboardIcon} <p className="ml-3">Dashboard</p>
              </div>
            </NavLink>
          )}
          <div className="w-full border-t border-gray-300 btn-sign-out text-start">
            <NavLink to={`/me/settings`}>
              <button className="block px-2 py-2 text-gray-400 hover:text-black">
                Settings
              </button>
            </NavLink>
          </div>
          <div className="w-full border-t border-gray-300 btn-sign-out text-start">
            <button
              onClick={handleSignOut}
              className="block px-2 py-2 text-gray-400 hover:text-gray-600"
            >
              Sign out
            </button>
          </div>
        </div>
      );
    },
    [handleSignOut, role]
  );

  useEffect(() => {
    async function fetchUsers() {
      const response = await apiUserSearch(token, inputSearch, 3);
      if (response?.data) setUsers(response?.data);
    }
    async function fetchTopics() {
      const response = await apiTopicsSearch(token, inputSearch, 3);
      if (response?.data) setTopics(response?.data);
    }
    fetchTopics();
    fetchUsers();
  }, [inputSearch, token]);

  const handleSearch = debounce((e) => {
    setInputSearch(e.target.value);
    setShow(true);
  }, 200);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (inputSearch) navigation(`/search/?q=${inputSearch}`);
    },
    [inputSearch, navigation]
  );

  return (
    <>
      <HomeStyle>
        <div className="wrapper">
          <Headroom>
            <div className="flex items-center justify-between bg-white  px-5 py-[10px]">
              <div className="flex items-center justify-between ">
                <NavLink to="/">
                  <img srcSet={logo} alt="monkey-blogging" className="logo" />
                </NavLink>
                <form
                  autoComplete="off"
                  onSubmit={handleSearchSubmit}
                  className="relative"
                >
                  <div className="hidden ml-4 md:block">
                    <SearchMain
                      id="search"
                      onChange={handleSearch}
                    ></SearchMain>
                  </div>
                </form>
              </div>
              <div className="flex items-center justify-center header-left">
                <NavLink to={`/write`} className="hidden md:block">
                  <Button kind="secondary" height="40px" className="">
                    {icons.writeIcon}
                    <p className="ml-2 text-lg font-medium">Write</p>
                  </Button>
                </NavLink>
                <div className="md:hidden">
                  <Button
                    kind="secondary"
                    height="40px"
                    onClick={() => setShowSearch(!showSearch)}
                  >
                    {icons.searchIcon}
                  </Button>
                </div>
                <Button
                  kind="secondary"
                  height="40px"
                  notification={countUnRead + ""}
                  className=""
                  id="notify"
                  onClick={() => setShowNotification(!showNotification)}
                >
                  {icons.notificationIcon}
                </Button>
                <Space direction="vertical" wrap size={16} className="p-1 ml-5">
                  <Popover
                    placement="bottomRight"
                    content={() =>
                      content(
                        userInfo?.data?.username,
                        userInfo?.data?.fullname
                      )
                    }
                    trigger="click"
                  >
                    <Avatar
                      className="cursor-pointer"
                      size="large"
                      src={<img src={userInfo?.data?.avatar} alt="avatar" />}
                    />
                  </Popover>
                </Space>
                {showNotification && (
                  <Notify
                    ref={nodeRefNotification}
                    notifications={notifications}
                    handleReadNotify={handleReadNotify}
                  ></Notify>
                )}
              </div>
            </div>
            {showSearch && (
              <div className="py-5 pr-6 md:hidden">
                <SearchMain
                  id="search"
                  className="ml-4"
                  onChange={handleSearch}
                ></SearchMain>
              </div>
            )}
            {show && (
              <DropdownSearchMain
                ref={nodeRef}
                users={users}
                topics={topics}
              ></DropdownSearchMain>
            )}
          </Headroom>
        </div>
      </HomeStyle>
    </>
  );
};

export default Header;
