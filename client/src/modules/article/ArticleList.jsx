/* eslint-disable react/prop-types */
import BlogGird from "../blog/BlogGird";

const ArticleList = ({ blogs = [], className = "" }) => {
  return (
    <>
      <div className={`grid grid-cols-1 ${className}`}>
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => <BlogGird key={blog.id} blog={blog}></BlogGird>)}
      </div>
    </>
  );
};

export default ArticleList;
