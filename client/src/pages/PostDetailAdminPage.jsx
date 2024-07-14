import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import PostImage from "../modules/post/PostImage";
import Avatar from "../modules/user/Avatar";
import TopicList from "../modules/topic/TopicList";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import ActionComment from "../action/ActionComment";
import ActionLike from "../action/ActionLike";
import { apiGetArticleAdminDetail } from "../api/api";
import useTimeAgo from "../hooks/useTimeAgo";
import { Tag } from "antd";

const PostDetailAdminPagePageStyle = styled.div`
  padding: 50px 0;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  .post {
    &-header {
      width: 100%;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
    }

    &-content {
      max-width: 700px;
      margin: 40px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailAdminPage = () => {
  const { id } = useParams("id");
  const [blog, setBlog] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const getTimeAgo = useTimeAgo;

  const fetchBlog = useCallback(async () => {
    try {
      const response = await apiGetArticleAdminDetail(token, id);
      if (!response) navigate("/*");

      setBlog(response.data);
    } catch (error) {
      console.log("error:", error);
      navigate("/*");
    }
  }, [id, navigate, token]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (!id) return <PageNotFound></PageNotFound>;

  return (
    <PostDetailAdminPagePageStyle>
      {blog && (
        <div className="post-header">
          {blog.banner && (
            <PostImage
              url={`${blog.banner}`}
              className="post-feature"
            ></PostImage>
          )}
          <div className="post-info">
            <h1 className="py-10 post-heading">{blog?.title}</h1>
            <div className="flex items-center gap-5 mb-5">
              <Link to={`/profile/${blog.author?.userInfo?.username}`}>
                <Avatar url={blog.author?.avatar} size="medium"></Avatar>
              </Link>
              <Link to={`/profile/${blog.author.userInfo.username}`}>
                <div className="font-medium ">
                  <p className="post-author">{blog.author.fullname}</p>
                  <p className="post-author">{blog.author.userInfo.username}</p>
                </div>
              </Link>
              <div>
                {blog.author.userInfo.role.slug === "user" ? (
                  <Tag color="green">{blog.author.userInfo.role.name}</Tag>
                ) : (
                  <Tag color="red">{blog.author.userInfo.role.name}</Tag>
                )}
                <p className="mt-1 text-xs font-medium text-gray-400">
                  {getTimeAgo(blog.updatedAt)}
                </p>
              </div>
            </div>
            <div className="">
              <TopicList data={blog.articleTopics}></TopicList>
            </div>
            <div className="flex items-center justify-between py-2 mt-5 border-gray-200 action border-y">
              <div className="flex items-center gap-5 communicate">
                <ActionLike
                  likesCount={blog.likesCount}
                  liked={blog.articleLiked}
                  blogId={blog.id}
                  title={blog.title}
                ></ActionLike>
                <ActionComment blogId={blog.id}></ActionComment>
              </div>
            </div>
          </div>
          <div className="post-content">
            <div
              className="entry-content"
              // Prevent XSS Attack recommen from React Docs
              dangerouslySetInnerHTML={{
                __html: blog.content || "",
              }}
            ></div>
          </div>
        </div>
      )}
    </PostDetailAdminPagePageStyle>
  );
};

export default PostDetailAdminPage;
