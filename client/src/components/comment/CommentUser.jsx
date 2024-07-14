/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Avatar from "../../modules/user/Avatar";
import InputComment from "../input/InputComment";
import { Link } from "react-router-dom";
import { apiGetCommentReplies } from "../../api/api";
import useTimeAgo from "../../hooks/useTimeAgo";
import { icons } from "../../utils/constants";
import { Popover } from "antd";
import { debounce } from "lodash";
import { apiDeleteMyComment } from "../../api/apisHung";

const CommentUser = ({
  data,
  type = "parent",
  blogId,
  commentValue: commentValueParent,
}) => {
  const { id, content, author, createdAt, depth, isMyComment, repliesCount } =
    data;
  const token = localStorage.getItem("token");
  const [commentBlog, setCommentBlog] = useState([]);
  console.log("commentBlog:", commentBlog);
  const {
    commentBlog: commentBlogParent,
    setCommentBlog: setCommentBlogParent,
  } = commentValueParent;
  const [replyCount, setReplyCount] = useState(repliesCount || 0);
  console.log("replyCount:", replyCount, repliesCount);

  const commentValue = { commentBlog, setCommentBlog };
  const [showMore, setShowMore] = useState(false);
  const [hideReplies, setHideReplies] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      commentBlog &&
      commentBlog.length > 0 &&
      commentBlog.length > repliesCount
    ) {
      setReplyCount(commentBlog.length);
    } else if (
      commentBlog &&
      commentBlog.length > 0 &&
      commentBlog.length < repliesCount
    ) {
      setReplyCount(replyCount + 1);
    }
  }, [commentBlog, commentBlog.length, repliesCount, replyCount]);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const getTimeAgo = useTimeAgo;

  function getCountRespond(count) {
    if (count === 1 || count === 0) return `${count}`;
    return `${count} replies`;
  }

  const handleShowComment = debounce(async () => {
    setHideReplies(!hideReplies);
    if (!hideReplies) {
      const response = await apiGetCommentReplies(token, id);
      if (response) setCommentBlog(response.data);
    }
  }, []);

  const handleDeleteMyComment = async () => {
    const response = await apiDeleteMyComment(token, id);
    if (response?.success) {
      const deleteItem = commentBlogParent.filter((item) => item.id != id);
      setCommentBlogParent([...deleteItem]);
    }
  };

  if (data.length === 0) return;
  return (
    <div
      className={`pt-6 ${type === "parent" && "border-b border-gray-200 pb-6"}`}
    >
      <div className="flex items-center justify-between">
        <Link to={`/profile/${author.username}`}>
          <div className="flex items-center gap-3 info">
            <Avatar url={author.avatar} size="small"></Avatar>
            <div className="content-info">
              <h3 className="font-medium">
                {author.username}
                {author.isAuthor && " . author"}
              </h3>
              <div className="text-gray-400 time">{getTimeAgo(createdAt)}</div>
            </div>
          </div>
        </Link>
        {isMyComment && (
          <Popover
            content={
              <div>
                <button
                  className="text-gray-400 transition-all cursor-pointer hover:text-gray-600"
                  onClick={handleDeleteMyComment}
                >
                  Delete comment
                </button>
              </div>
            }
            placement="bottomRight"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <button className="cursor-pointer">{icons.moreIcon}</button>
          </Popover>
        )}
      </div>

      <div className={`mt-3 content ml-1 ${!showMore && "line-clamp-3"}`}>
        {content}
      </div>
      {!showMore && content.length > 300 && (
        <button
          onClick={() => setShowMore(true)}
          className="text-green-400 transition-all hover:text-green-600"
        >
          Show more
        </button>
      )}
      {depth < 3 && (
        <div className="flex items-center justify-between py-5 text-gray-500 action">
          <button
            className="flex items-center gap-2 p-1 transition-all hover:text-black"
            onClick={handleShowComment}
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
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
              />
            </svg>
            {!hideReplies ? getCountRespond(replyCount) : "hide replies"}
          </button>
          <button
            className="flex items-center gap-2 p-1 transition-all hover:text-black"
            onClick={() => setShowReply(!showReply)}
          >
            {showReply ? "Hide reply" : "Show reply"}
          </button>
        </div>
      )}
      <div className="flex gap-3 ml-3">
        <div className="w-[2px]  bg-gray-300 rounded-lg "></div>
        <div className="flex-1 ">
          {showReply && depth < 3 && (
            <InputComment
              parentCommentId={id}
              blogId={blogId}
              commentValue={commentValue}
            ></InputComment>
          )}

          {hideReplies &&
            commentBlog &&
            commentBlog.length > 0 &&
            commentBlog.map((comment) => (
              <CommentUser
                type="child"
                data={comment}
                blogId={blogId}
                key={comment.id}
                commentValue={commentValue}
                repliesCount={comment.repliesCount}
              ></CommentUser>
            ))}
        </div>
      </div>
      <div className="comment-children"></div>
    </div>
  );
};

export default CommentUser;
