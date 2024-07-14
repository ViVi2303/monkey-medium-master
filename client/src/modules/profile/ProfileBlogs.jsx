/* eslint-disable react/prop-types */
import { Link, NavLink } from "react-router-dom";
import { Popover } from "antd";
import TopicList from "../topic/TopicList";
import Swal from "sweetalert2";
import BlogImage from "../blog/BlogImage";
import timeAgo from "../modulesJs/timeAgo";
import Avatar from "../user/Avatar";
import ButtonActionBlogsAuthor from "../../components/button/ButtonActionBlogsAuthor";

const ProfileBlogs = ({ blogs, user, fetchDeleteArticle }) => {
  // console.log("blogs:", blogs);
  const handleDelete = (slug) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        fetchDeleteArticle(slug);
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    });
  };
  const MoreUser = ({ slug }) => {
    return (
      <div>
        <NavLink to={`/edit-blog/${slug}`}>
          <div className="my-2 ">Edit story</div>
        </NavLink>
        <div
          onClick={() => handleDelete(slug)}
          className="my-2 text-red-500 cursor-pointer"
        >
          Delete story
        </div>
      </div>
    );
  };
  const save = (
    <div>
      <div className="my-2 ">Reading list</div>
      <div className="my-2 ">List 1</div>
      <div className="my-2 bg-stone-400 h-[1px]"></div>
      <div className="my-2 ">Create new list</div>
    </div>
  );
  if (blogs.length == 0) {
    return (
      <div className="flex overflow-hidden border rounded-lg bg-neutral-50 mt-11 border-neutral-50">
        <div className="w-2/4 p-4">
          <div className="flex">
            <Avatar url={user?.avatar} size="small"></Avatar>
            <div className="flex items-center justify-between px-2">
              {user?.fullname}
            </div>
          </div>
          <h1 className="py-5 text-xl font-bold">Reading Story</h1>
          <div className="flex justify-between">
            <p className="">No Story</p>
            <button className="text-lg">...</button>
          </div>
        </div>
        <div className="flex w-2/4 bg-white">
          <div className="w-1/2 h-full bg-neutral-200"></div>
          <div className="bg-neutral-200 h-full w-1/3 mx-[2px]"></div>
          <div className="flex-1 h-full bg-neutral-200"></div>
        </div>
      </div>
    );
  }
  return (
    <>
      {blogs.map((val) => (
        <div key={val.id} className="mt-5 border-b ">
          <div className="">
            <p className="text-sm">{timeAgo(val?.createdAt)}</p>
          </div>
          <div className="flex mt-3">
            <div className="flex-1  max-w-[80%]">
              <Link to={`/blog/${val.slug}`}>
                <h2 className="pb-1 text-xl font-bold">{val.title}</h2>
                <p className="text-base text-gray-400 line-clamp-2">
                  {val.preview}
                </p>
              </Link>
              <div className="flex items-center justify-between py-4">
                <TopicList data={[val?.topic]}></TopicList>
                <div className="flex items-center">
                  <Popover placement="bottom" content={save} trigger={"click"}>
                    <button className="mx-5">
                      <svg
                        className=""
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
                          fill="#000"
                        ></path>
                      </svg>
                    </button>
                  </Popover>
                  {user?.isMyProfile ? (
                    <Popover
                      placement="bottom"
                      content={<MoreUser slug={val.id} />}
                      trigger={"click"}
                    >
                      <button>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </button>
                    </Popover>
                  ) : (
                    <ButtonActionBlogsAuthor
                      blog={val}
                    ></ButtonActionBlogsAuthor>
                  )}
                </div>
              </div>
            </div>
            {val.banner && (
              <div className="ml-14">
                <BlogImage
                  className="flex-shrink-0"
                  url={val.banner}
                  alt=""
                  to={`/blog/${val.slug}`}
                ></BlogImage>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ProfileBlogs;
