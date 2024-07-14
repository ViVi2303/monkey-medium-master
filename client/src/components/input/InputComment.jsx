/* eslint-disable react/prop-types */
import { Input } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { apiAddComment } from "../../api/api";

const { TextArea } = Input;
const InputComment = ({ blogId = "", parentCommentId, commentValue }) => {
  const { commentBlog, setCommentBlog } = commentValue;
  const [content, setContent] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const token = localStorage.getItem("token");
  if (!parentCommentId) parentCommentId = null;
  const handleCancel = () => {
    setContent("");
  };

  const HandleRespond = () => {
    setIsSubmit(true);
    async function postRespond() {
      const response = await apiAddComment(
        blogId,
        parentCommentId,
        content,
        token
      );

      if (response.data) {
        setIsSubmit(false);
        setContent("");
        const data = response.data;
        const commentClone = [...commentBlog];
        commentClone.unshift(data);
        setCommentBlog(commentClone);
      }
    }

    postRespond();
  };

  useEffect(() => {
    if (content == "") {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [content]);

  if (!blogId && !commentValue) return;
  return (
    <>
      <TextArea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        placeholder="What are your thoughts"
        autoSize={{ minRows: 3, maxRows: 3 }}
      />
      <div className="my-4 text-right action">
        <button className="px-3 py-1 rounded-2xl" onClick={handleCancel}>
          Cancel
        </button>

        <button
          className={`px-3 py-1 text-white  rounded-2xl ${
            isSubmit ? "bg-green-300" : "bg-green-600"
          }`}
          disabled={isSubmit}
          onClick={HandleRespond}
        >
          Respond
        </button>
      </div>
    </>
  );
};

export default InputComment;
