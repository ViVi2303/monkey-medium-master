import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import FollowingUserHandle from "../../components/following/FollowingUserHandle";
import { apiGetUserFollow } from "../../api/apiNew";
import { NavbarHome } from "../../components/navbar";

const ProfileFollowing = () => {
  const [followings, setFollowings] = useState([]);
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

  async function fetchUserFollow() {
    const dataFollow = await apiGetUserFollow(username, "following");
    if (!dataFollow?.success) {
      console.log("error api:", dataFollow?.message);
    }
    setFollowings(dataFollow?.data);
  }
  useEffect(() => {
    fetchUserFollow();
  }, []);
  return (
    <>
      <NavbarHome
        data={user?.isMyProfile ? navMyProfile : navProfile}
        className="flex-1"
      />
      {followings?.length == 0 ? (
        <h1></h1>
      ) : (
        followings?.map((val, idx) => (
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

export default ProfileFollowing;
