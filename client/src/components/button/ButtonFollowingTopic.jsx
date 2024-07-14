/* eslint-disable react/prop-types */
import { useState } from "react";
import { apiFollowTopic, apiUnFollowTopic } from "../../api/api";

const ButtonFollowingTopic = ({ initialFollowing = false, topicId = "" }) => {
  const [followed, setFollowed] = useState(initialFollowing);
  const token = localStorage.getItem("token");

  const handleFollow = async () => {
    const res = await apiFollowTopic(token, topicId);
    if (res) {
      setFollowed(!followed);
    }
  };

  const handleUnFollow = async () => {
    const res = await apiUnFollowTopic(token, topicId);
    if (res) {
      setFollowed(!followed);
    }
  };
  if (!topicId) return;
  return (
    <>
      {!followed ? (
        <button
          className="px-4 py-1 text-blue-600 border border-blue-600 cursor-pointer rounded-2xl"
          onClick={handleFollow}
        >
          Follow
        </button>
      ) : (
        <button
          className="px-4 py-1 text-white bg-blue-400 cursor-pointer rounded-2xl"
          onClick={handleUnFollow}
        >
          Following
        </button>
      )}
    </>
  );
};

export default ButtonFollowingTopic;
