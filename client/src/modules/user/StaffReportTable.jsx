/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { icons } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import { Tag, Table, Popover, Drawer } from "antd";
import Column from "antd/es/table/Column";
import { apiBanUser, apiLiftTheBan, apiUpdateBan } from "../../api/api";
import { toast } from "react-toastify";
import {
  apiGetPendingReportStaff,
  apiResolveReportedAllUsers,
} from "../../api/apisHung";
import UserModelReportReason from "./UserModelReportReason";
import { Button } from "../../components/button";

const StaffReportTable = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [statusRender, setStatusRender] = useState(false);
  const banTypes = ["1week", "1month", "1year", "permanent"];
  const skip = useRef("");
  const skipCount = useRef("");
  const [open, setOpen] = useState(false);
  const [userReportedId, setUserReportedId] = useState("");
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const response = await apiGetPendingReportStaff(token, 10);
      if (response) {
        skip.current = response.newSkipId;
        skipCount.current = response.newSkipCount;
        const mapUsers = response.data.map((user) => {
          return {
            ...user,
            key: user.id,
          };
        });
        setUsers(mapUsers);
      }
      return [];
    }

    fetchUsers();
  }, [statusRender, token, isReload]);

  const handleLoadMore = useCallback(async () => {
    const newSkip = skip.current;
    const newSkipCount = skipCount.current;
    const response = await apiGetPendingReportStaff(
      token,
      10,
      newSkip,
      newSkipCount
    );
    console.log("response:", response);
    if (response) {
      const mapUsers = response.data.map((user) => {
        return {
          ...user,
          key: user.id,
        };
      });
      setUsers([...users, ...mapUsers]);
      skip.current = response.newSkipId;
      skipCount.current = response.newSkipCount;
    }
    return [];
  }, [token, users]);

  const handleLiftTheBan = async (userId) => {
    const response = await apiLiftTheBan(token, userId);
    if (response?.success) {
      toast.success(response.message, {
        pauseOnHover: true,
        delay: 200,
      });
      setStatusRender(!statusRender);
    }
  };

  const handleUpdateBan = async (type, userId) => {
    const response = await apiUpdateBan(token, userId, type);
    if (response?.success) {
      toast.success(response.message, {
        pauseOnHover: true,
        delay: 200,
      });
      setStatusRender(!statusRender);
    }
  };

  const handleBanUser = async (type, userId) => {
    const response = await apiBanUser(token, userId, type);
    if (response?.success) {
      toast.success(response.message, {
        pauseOnHover: true,
        delay: 200,
      });
      setStatusRender(!statusRender);
    }
  };

  const handleResolveReports = async (id) => {
    const response = await apiResolveReportedAllUsers(token, id);

    if (response?.success) {
      const filterUsers = users.filter((user) => user.id != id);
      setUsers(filterUsers);
    }
  };

  const handleShowDrawer = (id) => {
    setUserReportedId(id);
    setOpen(true);
  };

  const ButtonBaned = ({ bannedBy, bannedUntil, banType }) => (
    <Popover
      content={
        <div>
          <p>
            <span>Banned by</span> {bannedBy.username}
          </p>
          {bannedUntil && (
            <p>
              <span>Ban until</span> {bannedUntil}
            </p>
          )}
          <p>
            <span>Banned type</span> {banType}
          </p>
        </div>
      }
      placement="bottom"
    >
      <Tag className="cursor-pointer" color="red">
        BANNED
      </Tag>
    </Popover>
  );

  const ButtonMore = (user) => (
    <Popover
      placement="bottomRight"
      title={
        <>
          <p>{user.username}</p>
        </>
      }
      content={
        <>
          <div className="w-full">
            <NavLink
              className="block w-full py-2"
              to={`/profile/${user.username}`}
            >
              <span className="font-medium">Profile</span>
            </NavLink>
            {user.status === "normal" && (
              <Popover
                placement="left"
                content={
                  <>
                    {banTypes.map((type, index) => (
                      <button
                        key={index}
                        className="block w-full p-1 text-left hover:text-blue-400"
                        onClick={() => handleBanUser(type, user.id)}
                      >
                        {type}
                      </button>
                    ))}
                  </>
                }
              >
                <button className="block w-full py-2 text-left hover:text-blue-400">
                  Ban user
                </button>
              </Popover>
            )}

            {user.status === "banned" && (
              <>
                <Popover
                  placement="left"
                  content={
                    <>
                      {banTypes.map((type, index) => (
                        <button
                          key={index}
                          className="block w-full p-1 text-left hover:text-blue-400"
                          onClick={() => handleUpdateBan(type, user.id)}
                        >
                          {type}
                        </button>
                      ))}
                    </>
                  }
                >
                  <button className="block w-full py-2 text-left hover:text-blue-400">
                    Edit ban
                  </button>
                </Popover>
                <button
                  className="block w-full py-2 text-left hover:text-blue-400"
                  onClick={() => handleLiftTheBan(user.id)}
                >
                  Lift the ban
                </button>
              </>
            )}
            <div>
              <button
                className="block w-full py-2 text-left hover:text-blue-400"
                onClick={() => handleResolveReports(user.id)}
              >
                Resolve all reports
              </button>
            </div>
            <div>
              <button
                className="block w-full py-2 text-left hover:text-blue-400"
                onClick={() => handleShowDrawer(user.id)}
              >
                Show Reasons
              </button>
            </div>
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
      <Table dataSource={users} pagination={false} className="overflow-y-auto">
        <Column
          title="Username"
          key="username"
          render={(user) => (
            <NavLink to={`/profile/${user.username}`} target="_blank">
              <p className="w-40 font-medium whitespace-nowrap">
                {user.username}
              </p>
            </NavLink>
          )}
        />
        <Column
          title="Email"
          key="email"
          render={(user) => (
            <p className="font-medium whitespace-nowrap">{user.email}</p>
          )}
        />
        <Column
          title="Status"
          key="status"
          render={(user) =>
            user.status === "normal" ? (
              <Tag>NORMAL</Tag>
            ) : (
              <ButtonBaned
                bannedBy={user.bannedBy}
                bannedUntil={user.bannedUntil}
                banType={user.banType}
              ></ButtonBaned>
            )
          }
        />
        <Column title="Reports" dataIndex="reportsCount" key="reportsCount" />

        <Column title="More" key="More" render={(user) => ButtonMore(user)} />
      </Table>
      {userReportedId && (
        <Drawer
          title="Reports"
          placement="right"
          width={450}
          onClose={() => setOpen(false)}
          open={open}
        >
          <UserModelReportReason
            id={userReportedId}
            token={token}
          ></UserModelReportReason>
        </Drawer>
      )}

      {users && users.length > 0 && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button type="button" kind="primary" height="40px">
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default StaffReportTable;
