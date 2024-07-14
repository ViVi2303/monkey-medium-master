import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { apiGetReadingList } from "../../api/apisHung";
import styled from "styled-components";
import Blog from "../blog/Blog";
import { NavbarHome } from "../../components/navbar";

const ReadingListStyle = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto 50px;
  overflow-y: auto;
  flex: 1;
  height: 100%;
`;

const ProfileReadingList = () => {
  const [blogs, setBlogs] = useState([]);
  const data = useOutletContext();
  const token = localStorage.getItem("token");
  const user = data?.user;
  const { username } = useParams();
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
    async function fetchUserBlog() {
      const dataBlogs = await apiGetReadingList(token, 10);
      if (dataBlogs?.success) setBlogs(dataBlogs.data);
    }
    fetchUserBlog();
  }, [token]);

  if (!user?.isMyProfile) return null;

  return (
    <>
      <NavbarHome
        data={user?.isMyProfile ? navMyProfile : navProfile}
        className="flex-1"
      />
      <ReadingListStyle>
        <div>
          {blogs &&
            blogs.length > 0 &&
            blogs.map((blog) => (
              <Blog key={blog.id} isMyProfile={true} blog={blog}></Blog>
            ))}
        </div>
      </ReadingListStyle>
    </>
  );
};

export default ProfileReadingList;
