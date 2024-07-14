import { useEffect, useState } from "react";
import { apiGetUserFollow } from "../../api/apiNew";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { useOutletContext, useParams } from "react-router-dom";
import { NavbarHome } from "../../components/navbar";

const ProfileFollower = () => {
  const [followers, setFollower] = useState([]);
  const { username } = useParams();
  const { user } = useOutletContext();

  const navProfile = [
    {
      title: "Home",
      url: `/profile/${username}`,
    },
    {
      title: "Follower",
      url: `/profile/follower/${username}`,
    },
    {
      title: "Following",
      url: `/profile/following/${username}`,
    },
  ];
  const navMyProfile = [
    {
      title: "Home",
      url: `/profile/${username}`,
    },
    {
      title: "Follower",
      url: `/profile/follower/${username}`,
    },
    {
      title: "Following",
      url: `/profile/following/${username}`,
    },
    {
      title: "Reading List",
      url: `/profile/reading-list/${username}`,
    },
  ];

  useEffect(() => {
    async function fetchUserFollow() {
      const dataFollow = await apiGetUserFollow(username, "followers");
      if (!dataFollow?.success) {
        console.log("error api:", dataFollow?.message);
      }
      setFollower(dataFollow?.data);
    }
    fetchUserFollow();
  }, [username]);
  return (
    <>
      <NavbarHome
        data={user?.isMyProfile ? navMyProfile : navProfile}
        className="flex-1"
      />
      {followers?.length == 0 ? (
        <h1></h1>
      ) : (
        followers?.map((val, idx) => (
          <FollowingUserHandle
            key={idx}
            data={val}
            initialFollowing={val?.isFollowed}
          />
        ))
      )}
    </>
  );
};

export default ProfileFollower;
