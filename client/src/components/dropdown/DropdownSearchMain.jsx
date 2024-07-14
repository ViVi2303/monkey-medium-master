/* eslint-disable react/prop-types */
import React from "react";
import { NavLink } from "react-router-dom";
import Avatar from "../../modules/user/Avatar";

const DropdownSearchMain = React.forwardRef((props, ref) => {
  const { users = [], topics = [] } = props;

  if (topics.length === 0 && users.length === 0) return null;
  return (
    <div
      ref={ref}
      className="p-5 mt-3 bg-white md:shadow-xl w-full md:w-[300px] relative  md:absolute top-full left-0 md:left-7"
    >
      <div>
        {users.length > 0 && (
          <>
            <h3 className="py-3 text-sm font-medium text-gray-400 border-b border-gray-100">
              PEOPLE
            </h3>
            <div className="py-3">
              {users.map((user) => (
                <NavLink
                  to={`/profile/${user.username}`}
                  key={user.id}
                  className="flex items-center gap-3 mb-2"
                >
                  <Avatar size="xs" url={user.avatar}></Avatar>
                  <p className="text-sm ">{user.fullname}</p>
                </NavLink>
              ))}
            </div>
          </>
        )}
      </div>
      <div>
        {topics.length > 0 && (
          <>
            <h3 className="py-3 text-sm font-medium text-gray-400 border-b border-gray-100">
              TOPICS
            </h3>
            <div className="py-3">
              {topics.map((topic) => (
                <NavLink
                  to={`/topic/${topic.slug}`}
                  key={topic.id}
                  className="flex items-center gap-3 mb-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5 21V3h14v18H5zM4.75 2a.75.75 0 0 0-.75.75v18.5c0 .41.34.75.75.75h14.5c.41 0 .75-.34.75-.75V2.75a.75.75 0 0 0-.75-.75H4.75zM8 13a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1H8zm-.5 3.5c0-.28.22-.5.5-.5h8a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5zM8.75 10h6.5c.14 0 .25-.11.25-.25v-2.5a.25.25 0 0 0-.25-.25h-6.5a.25.25 0 0 0-.25.25v2.5c0 .14.11.25.25.25z"
                    ></path>
                  </svg>
                  <p className="text-sm ">{topic.name}</p>
                </NavLink>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

DropdownSearchMain.displayName = "DropdownSearchMain";

export default DropdownSearchMain;
