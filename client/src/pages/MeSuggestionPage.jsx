/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import FollowingUserHandle from "../components/following/FollowingUserHandle";
import TopicUserHandle from "../components/topic/TopicUserHandle";
import { apiSuggestionTopics, apiSuggestionUsers } from "../api/api";
import { Modal } from "antd";

const MeSuggestionPage = () => {
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showFullModal = useRef({ title: "", data: [], modalType: "" });

  useEffect(() => {
    async function fetchTopic() {
      const response = await apiSuggestionTopics(token, 50);
      if (response) setTopics(response.data);
    }
    fetchTopic();
  }, [token]);

  useEffect(() => {
    async function fetchTopic() {
      const response = await apiSuggestionUsers(token, 50);
      if (response) setUsers(response.data);
    }
    fetchTopic();
  }, [token]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModalWhoToFollow = async () => {
    if (users.length) {
      showFullModal.current.title = "Who to follow";
      showFullModal.current.data = [...users];
      showFullModal.current.modalType = "users";
      setIsModalOpen(true);
    }
  };

  const showModalTopicsToFollow = async () => {
    if (topics.length) {
      showFullModal.current.title = "Topics to follow";
      showFullModal.current.data = [...topics];
      showFullModal.current.modalType = "topics";
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      <Modal
        title={showFullModal.current.title}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <div className="flex justify-center">
            <button
              className="px-2 py-1 mt-5 font-semibold border border-black cursor-pointer rounded-2xl"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        }
      >
        {showFullModal.current.modalType === "users"
          ? users.map((user) => (
              <FollowingUserHandle
                key={user.id}
                data={user}
              ></FollowingUserHandle>
            ))
          : topics.map((topic) => (
              <TopicUserHandle key={topic.id} data={topic}></TopicUserHandle>
            ))}
      </Modal>
      <div className="user-following max-w-[700px] w-full mx-auto">
        <div className="mt-6">
          <h3 className="mb-3 text-base font-bold">Who to follow</h3>
          {users &&
            users.length > 0 &&
            users
              .slice(0, 10)
              .map((user) => (
                <FollowingUserHandle
                  key={user.id}
                  data={user}
                ></FollowingUserHandle>
              ))}
          <button
            className="mt-3 text-blue-400 hover:text-blue-500 "
            onClick={showModalWhoToFollow}
          >
            See more suggestions
          </button>
        </div>
        <div className="mt-6 ">
          <h3 className="mb-3 text-base font-bold">Topics to follow</h3>
          {topics &&
            topics.length > 0 &&
            topics
              .slice(0, 10)
              .map((topic) => (
                <TopicUserHandle key={topic.id} data={topic}></TopicUserHandle>
              ))}
          <button
            className="mt-3 text-blue-400 hover:text-blue-500 "
            onClick={showModalTopicsToFollow}
          >
            See more Suggestions
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeSuggestionPage;
