/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  apiGetPendingReportsArticles,
  apiMarkAllReportBlog,
  apiSetBackToDraft,
} from "../../api/apisHung";
import { Drawer, Modal, Popover, Select, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import { icons } from "../../utils/constants";
import PostModalReport from "./PostModalReport";
import Button from "../../components/button/Button";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

const PostReportTable = () => {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [blogId, setBlogId] = useState();
  const skip = useRef(0);
  const [isReload, setIsReload] = useState(false);
  const [blogReports, setBlogReports] = useState([]);
  const [openModalReporter, setOpenModalReporter] = useState(false);
  const [reason, setReason] = useState("");

  const handleOpenModal = (title) => {
    setOpenModalReporter(true);
    setReason(`Your story ${title} was set back to draft for reason`);
  };

  const onReason = (e, title) => {
    const value = e ?? "";
    const text = `Your story ${title} was set back to draft for reason ${value}`;
    setReason(text);
  };

  const handleShowReports = (id) => {
    if (!open) {
      setOpen(true);
      setBlogId(id);
    }
  };

  const fetchReports = useCallback(async () => {
    const response = await apiGetPendingReportsArticles(token);
    if (response.data) {
      skip.current = response.newSkip;
      const mapBlogs = response.data.map((user) => {
        return {
          ...user,
          key: user.id,
        };
      });
      setBlogReports(mapBlogs);
    }
  }, [token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, isReload]);

  const handleMarkAllThisReport = useCallback(
    async (id) => {
      const response = await apiMarkAllReportBlog(token, id);
      if (response) {
        const filterBlogs = blogReports.filter((blog) => blog.id != id);
        setBlogReports(filterBlogs);
      }
    },
    [blogReports, token]
  );

  const handleSetBackToDraft = useCallback(
    async (id) => {
      const response = await apiSetBackToDraft(token, id, reason);
      if (response) {
        setOpenModalReporter(false);
        toast.success("Set to draft successfully!", {
          pauseOnHover: false,
          delay: 200,
        });
      }
    },
    [reason, token]
  );

  const onChangeReason = (e) => {
    setReason(e.target.value);
  };

  const ButtonMore = (blog) => (
    <>
      <Modal
        title="Set to Draft"
        centered
        open={openModalReporter}
        onOk={() => setOpenModalReporter(false)}
        onCancel={() => setOpenModalReporter(false)}
        footer={
          <div className="text-right">
            <button
              className="px-2 py-1 mt-5 text-white bg-blue-300 rounded-md hover:bg-blue-400 "
              onClick={() => handleSetBackToDraft(blog.id)}
            >
              Submit
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <Select
            style={{ width: 120 }}
            onChange={(e) => onReason(e, blog.title)}
            allowClear
            options={[
              { value: "harassment", label: "Harassment" },
              { value: "rules violation", label: "Rules Violation" },
              { value: "spam", label: "Spam" },
            ]}
          />
          <TextArea
            showCount
            value={reason}
            maxLength={250}
            onChange={onChangeReason}
            placeholder="can resize"
          />
        </div>
      </Modal>
      <Popover
        placement="bottomRight"
        content={
          <>
            <div className="w-45">
              <button
                className="block w-full py-2 text-left hover:text-blue-400"
                onClick={() => handleShowReports(blog.id)}
              >
                Show reports ({blog?.reportsCount})
              </button>
              <button
                className="block w-full py-2 text-left hover:text-blue-400"
                onClick={() => handleMarkAllThisReport(blog.id)}
              >
                Mark all reports as solved
              </button>
              <button
                className="block w-full py-2 text-left hover:text-blue-400 whitespace-nowrap"
                onClick={() => handleOpenModal(blog.title)}
              >
                Set back to draft
              </button>
            </div>
          </>
        }
      >
        <button className="flex items-center justify-center text-blue-400 rounded-md cursor-pointer w-7 h-7">
          {icons.moreIcon}
        </button>
        <div></div>
      </Popover>
    </>
  );

  return (
    <>
      <Drawer
        title="Reports"
        placement="right"
        width={450}
        onClose={() => setOpen(false)}
        open={open}
      >
        {open && blogId && (
          <PostModalReport blogId={blogId} token={token}></PostModalReport>
        )}
      </Drawer>
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
        <Column
          title="Author"
          key="author"
          render={(blog) => (
            <>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-500">
                  {blog?.author?.userInfo?.username}
                </p>
                <Tag color="red">{blog?.author.userInfo.role.name}</Tag>
              </div>
            </>
          )}
        />

        <Column
          title="Title"
          key="title"
          render={(blog) => (
            <NavLink to={`/blog-detail/${blog.id}`} target="_blank">
              <p className="w-40 font-medium">{blog.title}</p>
            </NavLink>
          )}
        />

        <Column
          title="Status"
          key="status"
          render={(blog) =>
            blog.status === "approved" ? (
              <Tag color="green">APPROVED</Tag>
            ) : (
              <Tag color="red">REJECTED</Tag>
            )
          }
        />

        <Column
          title="Approved by"
          key="approvedBy"
          render={(blog) => {
            if (blog.approvedBy) {
              return (
                <div className="flex justify-center gap-2">
                  <p className="font-semibold text-gray-500">
                    {blog.approvedBy.username}
                  </p>
                  <Tag color="red">{blog?.approvedBy.role.name}</Tag>
                </div>
              );
            }
          }}
        />

        <Column title="Reports" dataIndex="reportsCount" key="reportsCount" />

        <Column title="Rejects" dataIndex="rejectsCount" key="rejectsCount" />

        <Column title="More" key="More" render={(blog) => ButtonMore(blog)} />
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

export default PostReportTable;
