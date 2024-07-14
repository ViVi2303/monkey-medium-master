/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { apiDeleteArticle, apiGetUserBlogs } from "../../api/api";
import ProfileBlogs from "./ProfileBlogs";
import { NavbarHome } from "../../components/navbar";

const ProfileHome = () => {
  const [blogs, setBlogs] = useState([]);
  // console.log("blogs:", blogs);
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
  async function fetchUserBlog() {
    const dataBlogs = await apiGetUserBlogs(username);
    // console.log(dataBlogs);
    setBlogs([...dataBlogs]);
  }

  async function fetchDeleteArticle(slug) {
    const delArticle = await apiDeleteArticle(slug);
    if (delArticle) {
      fetchUserBlog();
    }
  }
  useEffect(() => {
    fetchUserBlog();
  }, [username]);
  return (
    <>
      <NavbarHome
        data={user?.isMyProfile ? navMyProfile : navProfile}
        className="flex-1"
      />
      <ProfileBlogs
        blogs={blogs}
        user={user}
        fetchDeleteArticle={fetchDeleteArticle}
      />
    </>
  );
};

export default ProfileHome;
