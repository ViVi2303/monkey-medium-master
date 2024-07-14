/* eslint-disable react/prop-types */
import { Popover } from "antd";
import { useState } from "react";
import ButtonFollowingUser from "../button/ButtonFollowingUser.jsx";
import { apiGetProfile } from "../../api/api.jsx";
import { Link } from "react-router-dom";

const Following = ({ data = [], token, user }) => {
  const [userFollow, setUserFollow] = useState({});
  async function fetchUserInf(username) {
    const data = await apiGetProfile(token, username);
    setUserFollow({ ...data });
  }
  const SmallInf = () => {
    return (
      <>
        <div className="w-72">
          <div className="">
            <Link
              className="flex items-center"
              to={`/profile/${userFollow?.username}`}
            >
              <div className="w-8 h-8 overflow-hidden rounded-1/2 ">
                <img
                  className="w-full h-full"
                  src={userFollow?.avatar}
                  alt=""
                />
              </div>
              <p className="ml-2 text-base font-bold">{userFollow?.fullname}</p>
            </Link>
          </div>
          <p className="py-2">{userFollow?.bio ? userFollow.bio : ""} </p>
          <div className="h-[1px] my-3 bg-stone-400"></div>
          <div className="flex items-center justify-between">
            <div className="">
              <p>{userFollow?.followingCount} Followers</p>
            </div>
            <ButtonFollowingUser
              userId={userFollow?.id}
              initialFollowing={userFollow.isFollowed}
            />
          </div>
        </div>
      </>
    );
  };
  const handleChange = (username) => {
    fetchUserInf(username);
  };
  if (data?.length === 0) return null;
  return (
    <>
      <div className="w-full">
        <h2 className="my-3 text-lg font-bold text-black ">Following</h2>
        <div className="w-full max-h-[200px] overflow-hidden">
          {data.map((val, idx) => (
            <div
              key={idx}
              className="flex content-center justify-between py-2 "
            >
              <div className="flex max-w-[90%]">
                <div className="w-6 h-6 overflow-hidden rounded-1/2 ">
                  <Link to={`/profile/${val.username}`}>
                    <img
                      className="object-cover w-full h-full"
                      src={val.avatar}
                      alt=""
                    />
                  </Link>
                </div>
                <div className="max-w-[80%] ">
                  <Link to={`/profile/${val.username}`}>
                    <p className="py-1 text-[12px] ml-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {val.fullname}
                    </p>
                  </Link>
                </div>
              </div>
              <Popover
                content={<SmallInf username={val.username} />}
                trigger={"click"}
                onOpenChange={() => handleChange(val.username)}
              >
                <button className="">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </Popover>
            </div>
          ))}
        </div>
        <div className="py-2 my-3">
          <button>
            <Link to={`/profile/following/${user?.username}`}>
              See all <span>({user?.followingCount})</span>
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default Following;
