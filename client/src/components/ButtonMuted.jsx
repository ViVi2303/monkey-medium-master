/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { apiMuteUser } from "../api/api";

const ButtonMuted = ({ userId, initialMuted = false }) => {
  const [isMuted, setIsMuted] = useState(initialMuted);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (typeof initialMuted === "boolean") {
      setIsMuted(initialMuted);
    }
  }, [initialMuted]);

  const handleMute = async () => {
    const res = isMuted
      ? await apiMuteUser("delete", token, userId)
      : await apiMuteUser("post", token, userId);
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
          Mute
        </button>
      ) : (
        <button
          className="px-4 py-1 text-white bg-blue-400 cursor-pointer rounded-2xl"
          onClick={() => handleMute()}
        >
          Unmute
        </button>
      )}
    </>
  );
};

export default ButtonMuted;
