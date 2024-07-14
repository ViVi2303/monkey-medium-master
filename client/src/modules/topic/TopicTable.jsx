/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  apiApproveTopic,
  apiDeleteTopic,
  apiGetTopics,
  apiRejectTopic,
} from "../../api/api";
import Column from "antd/es/table/Column";
import Button from "../../components/button/Button";
import { Popover, Select, Table, Tag } from "antd";
import { icons } from "../../utils/constants";
import { debounce } from "lodash";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";

const TopicTable = () => {
  const token = localStorage.getItem("token");
  const { userInfo } = useAuth();
  const [topics, setTopics] = useState([]);
  const skip = useRef("");
  const [searchTopic, setSearchTopic] = useState("");
  const [status, setStatus] = useState("");
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    async function fetchTopics() {
      const response = await apiGetTopics(token, 10, searchTopic, status);
      const mapTopics = response.data.map((topic) => {
        return {
          ...topic,
          key: topic.id,
        };
      });
      setTopics(mapTopics);
      skip.current = response.newSkip;
    }
    fetchTopics();
  }, [token, searchTopic, status, isReload]);

  const handleChangeSearch = debounce((e) => {
    setSearchTopic(e.target.value);
  }, 200);

  const handleChange = (value) => {
    setStatus(value);
  };

  const handleLoadMore = async () => {
    const newSkip = skip.current;
    const response = await apiGetTopics(
      token,
      10,
      searchTopic,
      status,
      newSkip
    );
    console.log("response:", response);
    if (response) {
      const mapTopics = response.data.map((topic) => {
        return {
          ...topic,
          key: topic.id,
        };
      });
      skip.current = response.newSkip;
      setTopics([...topics, ...mapTopics]);
    }
    return [];
  };

  const handleApproved = useCallback(
    async (id) => {
      const response = await apiApproveTopic(token, id);
      if (response) {
        const { data } = userInfo;
        const newTopics = topics.map((topic) => {
          if (topic.id === id) {
            return {
              ...topic,
              key: topic.id,
              status: "approved",
              approvedBy: {
                id: data.id,
                email: data.email,
                username: data.username,
                role: {
                  name: data.role,
                  slug: data.role,
                },
              },
            };
          }
          return topic;
        });

        setTopics(newTopics);
      }
    },
    [token, topics, userInfo]
  );
  const handleRejected = useCallback(
    async (id) => {
      const response = await apiRejectTopic(token, id);
      if (response) {
        const { data } = userInfo;
        const newTopics = topics.map((topic) => {
          if (topic.id === id) {
            return {
              ...topic,
              key: topic.id,
              status: "rejected",
              rejectedBy: {
                id: data.id,
                email: data.email,
                username: data.username,
                role: {
                  name: data.role,
                  slug: data.role,
                },
              },
            };
          }
          return topic;
        });

        setTopics(newTopics);
      }
    },
    [token, topics, userInfo]
  );

  const handleDeleteTopic = useCallback(
    async (id) => {
      const response = await apiDeleteTopic(token, id);
      const filterTopics = topics.filter((topic) => topic.id != id);
      if (response) setTopics([...filterTopics]);
    },
    [token, topics]
  );

  const ButtonMore = (topic) => (
    <Popover
      placement="leftTop"
      content={
        <>
          <div>
            <div>
              <NavLink
                to={`/manage/update-topic/?id=${topic.id}&name=${topic.name}`}
              >
                <button className="block w-full py-1 text-left hover:text-blue-400">
                  Edit
                </button>
              </NavLink>
            </div>
            <div>
              <button
                className="block w-full py-1 text-left hover:text-blue-400"
                onClick={() => handleDeleteTopic(topic.id)}
              >
                Remove this Topic
              </button>
            </div>
            {topic && topic.status === "approved" && (
              <div>
                <button
                  className="block w-full py-1 text-left hover:text-blue-400"
                  onClick={() => handleRejected(topic.id)}
                >
                  Set reject
                </button>
              </div>
            )}
            {topic && topic.status === "rejected" && (
              <div>
                <button
                  className="block w-full py-1 text-left hover:text-blue-400"
                  onClick={() => handleApproved(topic.id)}
                >
                  Set approve
                </button>
              </div>
            )}
            {topic && topic.status === "pending" && (
              <>
                <div>
                  <button
                    className="block w-full py-1 text-left hover:text-blue-400"
                    onClick={() => handleApproved(topic.id)}
                  >
                    Set approve
                  </button>
                </div>
                <div>
                  <button
                    className="block w-full py-1 text-left hover:text-blue-400"
                    onClick={() => handleRejected(topic.id)}
                  >
                    Set reject
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      }
    >
      <button className="flex items-center justify-center text-blue-400 rounded-md cursor-pointer w-7 h-7">
        {icons.moreIcon}
      </button>
      <div></div>
    </Popover>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="my-3 border-gray-300 hover:border-blue-400 text-gray-300 hover:text-blue-400 transition-all border rounded-lg w-full max-w-[320px] pl-4 flex py-1">
            <input
              className="flex-1 text-sm text-gray-500 placeholder:text-sm "
              type="text"
              placeholder="Search"
              onChange={handleChangeSearch}
            />
            <div className="flex items-center mr-3 ">{icons.searchIcon}</div>
          </div>
          <Select
            defaultValue="All"
            style={{ width: "200px" }}
            onChange={handleChange}
            options={[
              { value: "", label: "All" },
              { value: "approved", label: "Approved" },
              { value: "pending", label: "Pending" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
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
          <Button kind="primary" height="30px" to="/manage/add-topic">
            Create topic
          </Button>
        </div>
      </div>
      <Table
        dataSource={topics}
        key="id"
        pagination={false}
        className="overflow-y-auto"
      >
        <Column
          title="Name"
          key="name"
          render={(topic) => (
            <p className="font-medium whitespace-nowrap">{topic.name}</p>
          )}
        />

        <Column
          title="Articles"
          dataIndex="articlesCount"
          key="articlesCount"
        />
        <Column
          title="Followers"
          dataIndex="followersCount"
          key="followersCount"
        />
        <Column
          title="Status"
          key="status"
          render={(topic) => {
            if (topic.status === "approved")
              return <Tag color="green">APPROVED</Tag>;

            if (topic.status === "rejected")
              return <Tag color="red">REJECTED</Tag>;

            return <Tag color="warning">PENDING</Tag>;
          }}
        />

        <Column
          title="Approved by"
          key="approvedBy"
          render={(topic) => {
            if (topic.approvedBy) {
              return (
                <div className="flex justify-center gap-2">
                  <p className="font-semibold text-gray-500">
                    {topic.approvedBy.username}
                  </p>
                  <Tag color="red">{topic?.approvedBy.role.name}</Tag>
                </div>
              );
            }
          }}
        />

        <Column
          title="Rejected by"
          key="RejectedBy"
          render={(topic) => {
            if (topic.rejectedBy) {
              return (
                <div className="flex justify-center gap-2">
                  <p className="font-semibold text-gray-500">
                    {topic.rejectedBy.username}
                  </p>
                  <Tag color="red">{topic?.rejectedBy.role.name}</Tag>
                </div>
              );
            }
          }}
        />

        <Column
          title="Action"
          key="action"
          render={(blog) => ButtonMore(blog)}
        />
      </Table>
      <div className="flex justify-center mt-5" onClick={handleLoadMore}>
        <Button type="button" kind="primary" height="40px">
          Load more
        </Button>
      </div>
    </div>
  );
};

export default TopicTable;
