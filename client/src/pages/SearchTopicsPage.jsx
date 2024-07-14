import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiTopicsSearch } from "../api/apisHung";
import TopicList from "../modules/topic/TopicList";

const SearchTopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q");
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await apiTopicsSearch(token, search, 15);
        if (response?.success) setTopics(response.data);
      } catch (error) {
        console.log("error:", error);
      }
    }
    fetchTopics();
  }, [search, token]);

  return (
    <div className="max-w-[700px] w-full mx-auto px-5 mt-5">
      <TopicList data={topics}></TopicList>
    </div>
  );
};

export default SearchTopicsPage;
