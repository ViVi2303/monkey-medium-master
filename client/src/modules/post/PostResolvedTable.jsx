/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { apiGetReportsBlogSolved } from "../../api/apisHung";
import { Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import { NavLink } from "react-router-dom";
import { Button } from "../../components/button";
// import { Button } from "../../components/button";

const PostResolvedTable = () => {
  const [blogReports, setBlogReports] = useState([]);
  console.log("blogReports:", blogReports);
  const token = localStorage.getItem("token");
  const skip = useRef(0);
  const [isReload, setIsReload] = useState(false);

  // const [searchBlogs, setSearchBlogs] = useState("");
  // const [status, setStatus] = useState("");

  // const handleChangeSearch = debounce((e) => {
  //   setSearchBlogs(e.target.value);
  // }, 200);

  useEffect(() => {
    async function fetchReports() {
      const response = await apiGetReportsBlogSolved(token);
      if (response.success) {
        skip.current = response.newSkip;
        const mapBlogs = response.data.map((blog) => {
          return {
            ...blog,
            key: blog.id,
          };
        });
        setBlogReports(mapBlogs);
      }
    }
    fetchReports();
  }, [token, isReload]);

  // const handleLoadMore = async () => {
  //   const newSkip = skip.current;
  //   const response = await apiGetAllArticlesAdmin(
  //     token,
  //     10,
  //     searchBlogs,
  //     status,
  //     newSkip
  //   );
  //   if (response) {
  //     const mapBlogs = response.data.map((user) => {
  //       return {
  //         ...user,
  //         key: user.id,
  //       };
  //     });
  //     skip.current = response.newSkip;
  //     setBlogReports([...blogReports, ...mapBlogs]);
  //   }
  //   return [];
  // };

  // const ShowAuthor = ({ author }) => {
  //   return (
  //     <Popover
  //       content={
  //         <div>
  //           <Link
  //             className="flex items-center gap-2"
  //             to={`/profile/${author?.userInfo?.username}`}
  //           >
  //             <p>
  //               {author?.userInfo?.username} . {author?.userInfo?.role?.slug}
  //             </p>
  //           </Link>
  //         </div>
  //       }
  //       placement="bottom"
  //     >
  //       <p className="flex items-end gap-1 font-semibold text-gray-400 hover:text-gray-600">
  //         {author.fullname}
  //       </p>
  //     </Popover>
  //   );
  // };

  // const handleChange = (value) => {
  //   setStatus(value);
  // };

  return (
    <>
      {/* <div className="flex items-center gap-5">
        <div className="my-3 border-gray-300 hover:border-blue-400 text-gray-300 hover:text-blue-400 transition-all border rounded-lg w-full max-w-[320px] pl-4 flex py-1">
          <input
            className="flex-1 text-sm text-gray-500 placeholder:text-sm "
            type="text"
            placeholder="Search slug"
            onChange={handleChangeSearch}
          />
          <div className="flex items-center mr-3 ">{icons.searchIcon}</div>
        </div>
        <Select
          defaultValue="Status"
          style={{ width: "120px" }}
          onChange={handleChange}
          options={[
            { value: "approved", label: "Approved" },
            { value: "pending", label: "Pending" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
      </div> */}
      <div className="flex justify-end mb-5">
        <Button
          type="button"
          height="30px"
          onClick={() => setIsReload(!isReload)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>{" "}
          <p className="ml-1 text-sm">Reload</p>
        </Button>
      </div>
      <Table
        dataSource={blogReports}
        pagination={false}
        className="overflow-y-auto"
      >
        <Column title="Id" key="id" dataIndex="id" />

        <Column
          title="Author"
          key="author"
          render={(blog) => (
            <>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-500">
                  {blog?.article?.author?.userInfo?.username}
                </p>
                <Tag color="red">
                  {blog?.article?.author.userInfo.role.name}
                </Tag>
              </div>
            </>
          )}
        />

        <Column
          title="Title"
          key="title"
          render={(blog) => (
            <NavLink to={`/blog-detail/${blog.article.id}`} target="_blank">
              <p className="w-40 font-medium">{blog.article.title}</p>
            </NavLink>
          )}
        />

        <Column title="Reason" key="reason" dataIndex="reason" />

        <Column
          title="Status"
          key="status"
          render={(blog) => <Tag color="green">{blog?.status}</Tag>}
        />
        <Column
          title="Resolved by"
          key="resolvedBy"
          render={(blog) => (
            <div className="flex gap-2">
              <p className="font-semibold text-gray-500">
                {blog.resolvedBy.username}
              </p>
              <Tag color="red">{blog?.resolvedBy.role.name}</Tag>
            </div>
          )}
        />
      </Table>
      {/* {blogReports && blogReports.length >= 5 && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button type="button" kind="primary" height="40px">
            Load more
          </Button>
        </div>
      )} */}
    </>
  );
};

export default PostResolvedTable;
