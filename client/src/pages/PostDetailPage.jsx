import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import PostImage from "../modules/post/PostImage";
import PostMeta from "../modules/post/PostMeta";
import Avatar from "../modules/user/Avatar";
import TopicList from "../modules/topic/TopicList";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import ActionComment from "../action/ActionComment";
import ActionLike from "../action/ActionLike";
import { apiGetArticle } from "../api/api";
import ButtonSaveBlog from "../components/button/ButtonSaveBlog";
import ButtonActionBlogsAuthor from "../components/button/ButtonActionBlogsAuthor";
import { apiGetMoreArticleInDetailPage } from "../api/apiNew";
import ArticleList from "../modules/article/ArticleList";
import { Button } from "../components/button";

const PostDetailPagePageStyle = styled.div`
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

const PostDetailPage = () => {
  const { slug } = useParams("slug");
  const [blog, setBlog] = useState(null);
  const [moreArticle, setMoreArticle] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fetchBlog = useCallback(async () => {
    try {
      const response = await apiGetArticle(token, slug);
      if (!response) navigate("/*");

      setBlog(response.data);
    } catch (error) {
      console.log("error:", error);
      navigate("/*");
    }
  }, [navigate, slug, token]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);
  useEffect(() => {
    const fetchMoreArticles = async () => {
      if (!blog) return;
      const moreArticlesRes = await apiGetMoreArticleInDetailPage(blog?.id);
      if (!moreArticlesRes) {
        return;
      }
      setMoreArticle(moreArticlesRes?.data);
    };
    fetchMoreArticles();
  }, [blog, slug]);
  if (!slug) return <PageNotFound></PageNotFound>;
  console.log(blog);
  return (
    <PostDetailPagePageStyle>
      {blog && !blog?.authorBlocked && (
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
              <PostMeta blog={blog}></PostMeta>
            </div>
            <TopicList data={blog.articleTopics}></TopicList>
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
              {!blog.isMyArticle && (
                <div className="flex items-center gap-3 ">
                  <ButtonSaveBlog
                    BlogId={blog.id}
                    checkMyProfile={blog.isSaved}
                  ></ButtonSaveBlog>
                  <ButtonActionBlogsAuthor
                    setMuteId={() => {}}
                    blog={blog}
                  ></ButtonActionBlogsAuthor>
                </div>
              )}
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
          <div className="h-[1px] w-full bg-gray-200 my-2"></div>
          <div className="pt-3 pb-7 text-xl font-bold">
            More from {blog?.author?.fullname}
          </div>
          <ArticleList
            blogs={moreArticle}
            className="gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2"
          />
          <div className="h-[1px] w-full bg-gray-200 my-6"></div>
          <Button
            to={`/profile/${blog?.author?.userInfo?.username}`}
            className="!m-0"
            height="30px"
          >
            See all {blog?.author?.fullname}{" "}
          </Button>
        </div>
      )}
      {blog?.authorBlocked ? (
        <div className="text-4xl font-bold">
          You has been blocked this user, you need unblock fist
        </div>
      ) : (
        ""
      )}
    </PostDetailPagePageStyle>
  );
};

export default PostDetailPage;
