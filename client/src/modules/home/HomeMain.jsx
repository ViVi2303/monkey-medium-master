/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Blog from "../blog/Blog";
import { debounce } from "lodash";
import { apiGetExploreBlogs, apiGetFollowedArticles } from "../../api/apisHung";
import TopicSlider from "../topic/TopicSlider";
import { apiGetMyFollowingTopics } from "../../api/api";
import { useSearchParams } from "react-router-dom";

const HomeMainStyled = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto 50px;
  overflow-y: auto;
  flex: 1;
  height: 100%;
  padding: 0 20px;
`;

const HomeMain = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const blogRef = useRef();
  const skip = useRef("");
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);
  const [muteId, setMuteId] = useState("");
  const mute = { muteId, setMuteId };
  const [topicFollowings, setTopicFollowings] = useState([]);
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get("topic");
  useEffect(() => {
    if (!muteId) return;
    const filterBlogs = blogs.filter((blog) => blog.author.id !== muteId);
    setBlogs(filterBlogs);
  }, [muteId, token]);

  useEffect(() => {
    async function fetchBlog() {
      let response;
      if (topicParam) {
        response = await apiGetFollowedArticles(token, topicParam, 5);
      } else {
        response = await apiGetExploreBlogs(token, 5);
      }
      if (response?.success) {
        setBlogs([...response.data]);
        skip.current = response.newSkip;
      }
    }
    fetchBlog();
  }, [searchParams]);

  useEffect(() => {
    async function fetTopicFollowings() {
      const response = await apiGetMyFollowingTopics(token);
      if (response) setTopicFollowings(response.data);
    }
    fetTopicFollowings();
  }, []);

  useEffect(() => {
    const handleScroll = async () => {
      windowHeight.current = window.innerHeight;
      scrollY.current = window.scrollY;
      documentHeight.current = document.documentElement.scrollHeight;
      if (
        windowHeight.current + scrollY.current + 10 >= documentHeight.current &&
        skip.current
      ) {
        let response;
        if (topicParam) {
          response = await apiGetFollowedArticles(
            token,
            topicParam,
            10,
            skip.current
          );
        } else {
          response = await apiGetExploreBlogs(token, 10, skip.current);
        }
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
    <HomeMainStyled ref={blogRef}>
      <TopicSlider topics={topicFollowings}></TopicSlider>
      <div>
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => (
            <Blog key={blog.id} mute={mute} blog={blog}></Blog>
          ))}
      </div>
    </HomeMainStyled>
  );
};

export default HomeMain;
