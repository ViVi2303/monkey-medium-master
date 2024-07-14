/* eslint-disable react/prop-types */
import ButtonFollowingUser from "../../components/button/ButtonFollowingUser";
import Avatar from "../user/Avatar";

// eslint-disable-next-line react/prop-types
const ProfileInfor = ({ isBlocked, setShow, user }) => {
  return (
    <>
      <div className="mb-8">
        <Avatar url={user?.avatar} size="large"></Avatar>
        <p className="my-2">{user?.fullname}</p>
        {user?.followersCount ? (
          <p className="my-2">{user?.followersCount} Follower</p>
        ) : (
          ""
        )}
        <p className="mb-2">{user?.bio ? user.bio : ""} </p>
        <p className="mb-2">{user?.about ? user.about : ""}</p>
        {user.isMyProfile ? (
          <button
            className="text-green-500 duration-300 hover:text-black"
            onClick={() => setShow(true)}
          >
            Edit Profile
          </button>
        ) : !isBlocked ? (
          <div className="flex items-center">
            <ButtonFollowingUser
              userId={user.id}
              initialFollowing={user.isFollowed}
            />
            {/* <button className="ml-2 overflow-hidden bg-green-600 w-9 h-9 rounded-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 m-auto text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </button> */}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default ProfileInfor;
