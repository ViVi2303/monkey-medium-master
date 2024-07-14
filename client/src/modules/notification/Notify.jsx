/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import timeSince from "../modulesJs/timeAgo";
import logo from "../../assets/logo.png";
import Avatar from "../user/Avatar";
// eslint-disable-next-line react/display-name
const Notify = React.forwardRef((props, ref) => {
  const { notifications, handleReadNotify } = props;
  const isMounted = useRef(false);
  const limitNotifications = 10;
  useEffect(() => {
    return () => {
      if (isMounted.current) {
        handleReadNotify();
      }
      isMounted.current = true;
    };
  }, []);
  return (
    <div ref={ref} id="notify">
      <div className="absolute top-full right-2 z-auto bg-white">
        <div className="w-96 max-h-[800px]  shadow-lg rounded-lg overflow-y-auto ">
          <div className="m-2 flex items-center justify-between">
            <h1 className="text-lg font-bold mx-2">Notification</h1>
            <Link to={"/me/notifications"}>
              <button className="font-medium text-blue-500 hover:text-blue-400 ">
                See all
              </button>
            </Link>
          </div>
          <div className="mt-3">
            {notifications &&
              notifications.length > 0 &&
              notifications?.slice(0, limitNotifications)?.map((val, idx) => (
                <Link
                  key={idx}
                  to={val?.article?.slug ? `/blog/${val?.article?.slug}` : `/`}
                  onClick={(e) => {
                    if (!val?.article?.slug) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div
                    className={`flex items-center py-2 hover:bg-stone-100  cursor-pointer ${
                      !val?.isRead && "bg-stone-100"
                    }`}
                  >
                    <div className="m-2">
                      <Avatar
                        size="medium"
                        url={val?.sender?.avatar || logo}
                      ></Avatar>
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-2 text-sm font-semibold  ">
                        {val?.content}{" "}
                      </p>
                      <div className="text-xs text-gray-400">
                        {timeSince(val?.createdAt) || "now"}
                      </div>
                    </div>
                    {/* <div className="relative bg-lime-400 w-3 h-3 rounded-1/2"></div> */}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Notify;
