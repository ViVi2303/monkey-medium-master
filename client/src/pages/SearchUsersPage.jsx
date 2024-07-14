import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FollowingUserHandle from "../components/following/FollowingUserHandle";
import { apiUserSearch } from "../api/apisHung";
import { debounce } from "lodash";

const SearchUsersPage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q");
  const [users, setUsers] = useState([]);
  console.log("users:", users);
  const token = localStorage.getItem("token");
  const windowHeight = useRef(window.innerHeight);
  const scrollY = useRef(window.scrollY);
  const documentHeight = useRef(document.documentElement.scrollHeight);
  const skip = useRef("");
  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await apiUserSearch(token, search, 15);
        console.log("response:", response);
        if (response?.success) {
          skip.current = response.newSkip;
          setUsers(response.data);
        }
      } catch (error) {
        console.log("error:", error);
      }
    }
    fetchTopics();
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
        const response = await apiUserSearch(token, search, 15, skip.current);
        if (response?.success) {
          const usersClone = [...users, ...response.data];
          setUsers([...usersClone]);
          skip.current = response.newSkip;
        }
      }
    };
    const debouncedScrollUsers = debounce(handleScroll, 200);

    window.addEventListener("scroll", debouncedScrollUsers);

    return () => {
      window.removeEventListener("scroll", debouncedScrollUsers);
    };
  }, [users]);

  return (
    <div className="user-following max-w-[700px] w-full mx-auto my-5 ">
      {users &&
        users.length > 0 &&
        users.map((user) => (
          <FollowingUserHandle
            key={user.id}
            data={user}
            initialFollowing={user.isFollowed}
          ></FollowingUserHandle>
        ))}
    </div>
  );
};

export default SearchUsersPage;
