/* eslint-disable react/prop-types */
import { Avatar, Skeleton } from "antd";
import BlogImage from "./BlogImage";
import { Link, NavLink } from "react-router-dom";
import BlogMeta from "./BlogMeta";
import BlogTitle from "./BlogTitle";
import ButtonActionBlogsAuthor from "../../components/button/ButtonActionBlogsAuthor";
import ButtonSaveBlog from "../../components/button/ButtonSaveBlog";
import ActionLike from "../../action/ActionLike";

const BlogGird = ({ blog }) => {
  const { title, preview, banner, slug, author, createdAt } = blog;

  return (
    <div className="flex flex-col justify-between">
      {banner ? (
        <BlogImage
          kind="gird"
          url={banner}
          alt=""
          to={`/blog/${slug}`}
        ></BlogImage>
      ) : (
        <div>
          <Skeleton.Image
            active={true}
            style={{ maxWidth: "360px", width: "360px", height: "180px" }}
          />
        </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex-1 w-full my-4">
          <div className="flex py-2">
            <Link to={`/profile/${author?.username}`}>
              <Avatar
                className="cursor-pointer"
                size="small"
                src={<img src={author?.avatar} alt="avatar" />}
              />
            </Link>
            <div className="flex ml-2">
              <BlogMeta
                authorName={author?.fullname}
                date={createdAt}
                to={author?.userInfo?.username}
              ></BlogMeta>
            </div>
          </div>
          <BlogTitle to={`/blog/${slug}`} size="normal">
            {title}
          </BlogTitle>
          <NavLink to={`/blog/${slug}`}>
            <p className="mt-2 text-base text-gray-400 line-clamp-2">
              {preview}
            </p>
          </NavLink>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 communicate">
            <ActionLike
              likesCount={blog.likesCount}
              username={blog?.author?.userInfo?.username}
              liked={blog.isLiked}
              blogId={blog.id}
            ></ActionLike>
            <NavLink to={`/blog/${blog?.slug}`}>
              <button className="flex items-center gap-1 text-gray-400 transition-all hover:text-black">
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

                <span className="inline-block pt-1 text-sm font-medium ">
                  {blog.commentsCount}
                </span>
              </button>
            </NavLink>
          </div>
          <div className="flex items-center gap-2 ">
            <ButtonSaveBlog
              BlogId={blog.id}
              checkMyProfile={blog.isSaved}
            ></ButtonSaveBlog>
            <ButtonActionBlogsAuthor
              setMuteId={() => {}}
              blog={blog}
            ></ButtonActionBlogsAuthor>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogGird;
