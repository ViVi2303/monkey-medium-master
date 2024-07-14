// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Blog from "../modules/blog/Blog";
import { apiMyArticleFollowing } from "../api/api";
import { debounce } from "lodash";

const FollowingPageStyled = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
`;

const FollowingPage = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const [muteId, setMuteId] = useState("");
  const mute = { muteId, setMuteId };
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);
  const skip = useRef("");

  useEffect(() => {
    if (!muteId) return;
    const filterBlogs = blogs.filter((blog) => blog.author.id !== muteId);
    setBlogs(filterBlogs);
  }, [blogs, muteId]);

  useEffect(() => {
    const handleScroll = async () => {
      console.log("Scroll");
      windowHeight.current = window.innerHeight;
      scrollY.current = window.scrollY;
      documentHeight.current = document.documentElement.scrollHeight;
      if (
        windowHeight.current + scrollY.current + 10 >= documentHeight.current &&
        skip.current
      ) {
        const response = await apiMyArticleFollowing(token, 10, skip.current);
        if (response?.success) {
          const blogsClone = [...blogs, ...response.data];
          setBlogs(blogsClone);
          skip.current = response.newSkip;
        }
      }
    };
    const debouncedScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedScroll);

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs]);

  useEffect(() => {
    async function fetchBlog() {
      const response = await apiMyArticleFollowing(token, 10);
      if (response) {
        setBlogs(response.data);
        skip.current = response.newSkip;
      }
    }
    fetchBlog();
  }, [token]);

  return (
    <FollowingPageStyled>
      <div>
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => (
            <Blog key={blog.id} mute={mute} blog={blog}></Blog>
          ))}
      </div>
    </FollowingPageStyled>
  );
};

export default FollowingPage;
