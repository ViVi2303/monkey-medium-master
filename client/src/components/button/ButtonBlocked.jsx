/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { apiBlockUser } from "../../api/api";

const ButtonBlocked = ({ userId, initialBlock = false }) => {
  const [isMuted, setIsMuted] = useState(initialBlock);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (typeof initialBlock === "boolean") {
      setIsMuted(initialBlock);
    }
  }, [initialBlock]);

  const handleMute = async () => {
    const res = isMuted
      ? await apiBlockUser("delete", token, userId)
      : await apiBlockUser("post", token, userId);
    if (res) {
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      {!isMuted ? (
        <button
          className="px-4 py-1 text-blue-600 border border-blue-600 cursor-pointer rounded-2xl"
          onClick={() => handleMute()}
        >
          Block
        </button>
      ) : (
        <button
          className="px-4 py-1 text-white bg-blue-400 cursor-pointer rounded-2xl"
          onClick={() => handleMute()}
        >
          UnBlock
        </button>
      )}
    </>
  );
};

export default ButtonBlocked;
