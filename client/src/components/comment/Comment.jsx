/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import Avatar from "../../modules/user/Avatar";
import CommentUser from "./CommentUser";
import InputComment from "../input/InputComment";
import { useAuth } from "../../contexts/auth-context";

const Comment = ({ blogId = "", commentValue }) => {
  const { userInfo } = useAuth();
  const { data } = userInfo;
  const { commentBlog, setCommentBlog } = commentValue;

  if (!blogId) return;

  return (
    <>
      <div className="p-3 mb-5 shadow-lg ">
        <div className="flex items-center gap-4 mb-4 info">
          <Avatar url={data.avatar} size="small"></Avatar>
          <p>{data.username}</p>
        </div>
        <InputComment
          setCommentBlog={setCommentBlog}
          blogId={blogId}
          commentValue={commentValue}
        ></InputComment>
      </div>
      {commentBlog &&
        commentBlog.length > 0 &&
        commentBlog.map((comment) => (
          <CommentUser
            key={comment.id}
            type="parent"
            data={comment}
            blogId={blogId}
            commentValue={commentValue}
            repliesCount={comment.repliesCount}
          ></CommentUser>
        ))}
    </>
  );
};

export default Comment;
