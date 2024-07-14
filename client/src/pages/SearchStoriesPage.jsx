/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Blog from "../modules/blog/Blog";
import { useSearchParams } from "react-router-dom";
import { apiBlogSearch } from "../api/apisHung";
import { debounce } from "lodash";

const SearchStoriesPageStyle = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px 20px;
`;

const SearchStoriesPage = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const [searchParams] = useSearchParams();
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);
  const skip = useRef("");
  const search = searchParams.get("q");
  const [muteId, setMuteId] = useState("");
  const mute = { muteId, setMuteId };

  useEffect(() => {
    if (!muteId) return;
    const filterBlogs = blogs.filter((blog) => blog.author.id !== muteId);
    setBlogs(filterBlogs);
  }, [muteId, token]);

  useEffect(() => {
    async function fetchBlog() {
      const response = await apiBlogSearch(token, search, 5);
      console.log("response:", response);
      if (response?.success) {
        setBlogs(response.data);
        skip.current = response.newSkip;
      }
    }
    fetchBlog();
  }, [search, token]);

  useEffect(() => {
    const handleScroll = async () => {
      windowHeight.current = window.innerHeight;
      scrollY.current = window.scrollY;
      documentHeight.current = document.documentElement.scrollHeight;
      if (
        windowHeight.current + scrollY.current + 10 >= documentHeight.current &&
        skip.current
      ) {
        const response = await apiBlogSearch(token, search, 5, skip.current);
        console.log("response:", response);
        if (response?.success) {
          const blogsClone = [...blogs, ...response.data];
          setBlogs([...blogsClone]);
          skip.current = response.newSkip;
        }
      }
    };
    const debouncedScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedScroll);

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [blogs]);

  return (
    <SearchStoriesPageStyle>
      <div>
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => (
            <Blog key={blog.id} mute={mute} blog={blog}></Blog>
          ))}
      </div>
    </SearchStoriesPageStyle>
  );
};

export default SearchStoriesPage;
