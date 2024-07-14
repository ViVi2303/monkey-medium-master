import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { apiTopicsSearch } from "../../api/apisHung";

/* eslint-disable react/prop-types */
const SearchAddTopics = ({
  topics = [],
  setTopics,
  placeholder = "",
  setTopicsInput,
  topicInput = "",
  setTopicInput,
}) => {
  const [addTopics, setAddTopics] = useState([]);
  const input = useRef(null);
  const token = localStorage.getItem("token");
  const handleDeleteTopic = (slug) => {
    const topicsClone = [...topics];
    const topicFilters = topicsClone.filter((topic) => topic.slug !== slug);
    setTopics(topicFilters);
  };
  useEffect(() => {
    async function fetchTopics() {
      const response = await apiTopicsSearch(token, topicInput);
      if (response?.data) setAddTopics(response?.data);
    }
    fetchTopics();
  }, [setAddTopics, topicInput]);

  const handleAddTopic = (value) => {
    const addTopicClone = [];
    const check = topics.filter((topic) => topic.slug === value.slug);
    if (check.length === 0) {
      addTopicClone.push(...topics, value);
      setTopics(addTopicClone);
    }
    input.current.value = "";
    setAddTopics([]);
    setTopicInput("");
  };

  const handleOnchange = debounce((e) => {
    setTopicInput(e.target.value);
    if (e.target.value === "") {
      const splitTopic = topicInput.trim().split(/[,\s]+/);
      setTopicsInput(splitTopic);
      setAddTopics([]);
    }
  }, 500);
  return (
    <div className="relative flex flex-wrap items-center w-full p-1 mt-5 bg-gray-200 border border-gray-700">
      {topics &&
        topics?.length > 0 &&
        topics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center justify-center m-1 text-sm bg-white rounded-sm h-7"
          >
            <span className="p-1">{topic?.name}</span>{" "}
            <button
              type="button"
              onClick={() => handleDeleteTopic(topic?.slug)}
              className="px-1 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      {topics && topics.length < 5 && (
        <div>
          <input
            ref={input}
            type="text"
            className="w-full p-2 text-sm bg-gray-200 max-w-[200px] placeholder:text-sm"
            placeholder={placeholder}
            onChange={handleOnchange}
          />
        </div>
      )}
      {addTopics && addTopics?.length > 0 && (
        <div className="absolute left-0 dropdown top-[calc(100%+10px)] border border-black bg-gray-200  w-auto p-1 max-h-44 overflow-auto">
          <ul>
            {addTopics.map((topic) => (
              <li
                key={topic.id}
                className="p-1 text-sm text-black transition-all cursor-pointer hover:bg-black hover:text-white "
                onClick={() => handleAddTopic(topic)}
              >
                {topic?.name} ({topic.articlesCount})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchAddTopics;
