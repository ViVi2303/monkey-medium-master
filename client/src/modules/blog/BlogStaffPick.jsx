/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Avatar from "../user/Avatar";

const BlogStaffPick = ({ blog }) => {
  const { title, slug, author } = blog;
  return (
    <div className="mt-5">
      <Link to={`/profile/${author?.username}`}>
        <div className="flex items-center">
          <Avatar className="cursor-pointer" size="xs" url={author?.avatar} />
          <p className="ml-2 font-semibold text-gray-500 hover:text-gray-700">
            {author?.fullname}
          </p>
        </div>
      </Link>
      <p className="mx-1"> </p>
      <Link to={`/blog/${slug}`}>
        <p className="mt-2 text-lg font-bold text-gray-500 line-clamp-2 hover:text-gray-700">
          {title}
        </p>
      </Link>
    </div>
  );
};

export default BlogStaffPick;
