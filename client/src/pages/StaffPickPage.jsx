import { useEffect, useRef, useState } from "react";
import { apiGetStaffPick } from "../api/apisHung";
import { debounce } from "lodash";
import Blog from "../modules/blog/Blog";
import styled from "styled-components";

const StaffPicksStyle = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
`;

const StaffPickPage = () => {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);
  const skip = useRef("");
  const [muteId, setMuteId] = useState("");
  const mute = { muteId, setMuteId };

  useEffect(() => {
    if (!muteId) return;
    const filterBlogs = blogs.filter((blog) => blog.author.id !== muteId);
    setBlogs(filterBlogs);
  }, [muteId, token]);

  useEffect(() => {
    async function fetchBlog() {
      const response = await apiGetStaffPick(token, 5);
      console.log("response:", response);
      if (response?.success) {
        setBlogs(response.data);
        skip.current = response.newSkip;
      }
    }
    fetchBlog();
  }, [token]);

  useEffect(() => {
    const handleScroll = async () => {
      windowHeight.current = window.innerHeight;
      scrollY.current = window.scrollY;
      documentHeight.current = document.documentElement.scrollHeight;
      if (
        windowHeight.current + scrollY.current + 10 >= documentHeight.current &&
        skip.current
      ) {
        const response = await apiGetStaffPick(token, 5, skip.current);
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
    <>
      <div className="mb-7 pb-7 ">
        <h1 className="text-4xl font-bold">Admin Picks</h1>
        <p className="text-lg font-semibold text-gray-500 mt-3">
          Stories from across Medium, hand-selected by admin team.
        </p>
      </div>
      <StaffPicksStyle>
        <div>
          {blogs &&
            blogs.length > 0 &&
            blogs.map((blog) => (
              <Blog key={blog.id} mute={mute} blog={blog}></Blog>
            ))}
        </div>
      </StaffPicksStyle>
    </>
  );
};

export default StaffPickPage;
