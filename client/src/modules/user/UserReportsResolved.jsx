/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { apiGetUsersResolved } from "../../api/apisHung";
import { Popover, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import { NavLink } from "react-router-dom";
import { Button } from "../../components/button";

const UserReportsResolved = () => {
  const token = localStorage.getItem("token");
  const [reports, setReports] = useState([]);
  const [isReload, setIsReload] = useState(false);
  const skip = useRef("");
  useEffect(() => {
    async function fetchUserResolved() {
      const response = await apiGetUsersResolved(token);
      if (response?.success) {
        const mapReports = response.data.map((report) => {
          return {
            ...report,
            key: report.id,
          };
        });
        setReports(mapReports);
        skip.current = response.newSkip;
      }
    }

    fetchUserResolved();
  }, [token, isReload]);

  // const handleLoadMore = async () => {
  //   const newSkip = skip.current;
  //   const response = await apiGetUsersResolved(token, 1, newSkip);
  //   if (response) {
  //     console.log("response:", response);
  //     const mapReports = response.data.map((report) => {
  //       return {
  //         ...report,
  //         key: report.id,
  //       };
  //     });
  //     setReports([...reports, ...mapReports]);
  //     skip.current = response.newSkipId;
  //   }
  // };

  const ButtonBaned = ({ resolvedBy, reason, description }) => (
    <div>
      <Popover
        content={
          <div>
            <p>
              <span>Resolved by</span> {resolvedBy.username} (
              {resolvedBy.role.name})
            </p>
            <p>
              <span>Reason: </span> {reason}
            </p>
            {description && (
              <p className="max-w-[500px]">
                <span>Description: </span> {description}
              </p>
            )}
          </div>
        }
        placement="bottom"
      >
        <Tag className="cursor-pointer" color="green">
          RESOLVED
        </Tag>
      </Popover>
    </div>
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
      <Table dataSource={reports} pagination={false}>
        <Column
          title="Reported"
          key="reported"
          render={(report) => (
            <div className="flex items-center gap-2">
              <NavLink to={`profile/${report.reported.username}`}>
                <p className="font-medium whitespace-nowrap">
                  {report.reported.username}
                </p>
              </NavLink>
              <Tag color="red">{report?.reported.role.name}</Tag>
            </div>
          )}
        />
        <Column
          title="Reporter"
          key="Reporter"
          render={(report) => (
            <div className="flex items-center gap-2">
              <NavLink to={`profile/${report.reporter.username}`}>
                <p className="font-medium whitespace-nowrap">
                  {report.reporter.username}
                </p>
              </NavLink>
              <Tag color="red">{report?.reported.role.name}</Tag>
            </div>
          )}
        />
        <Column title="Reason" dataIndex="reason" key="reason" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column
          title="Status"
          key="status"
          render={(report) => (
            <ButtonBaned
              resolvedBy={report.resolvedBy}
              reason={report.reason}
              description={report.description}
            ></ButtonBaned>
          )}
        />
        <Column
          title="Resolved By"
          key="resolvedBy"
          render={(report) => (
            <div className="flex items-center gap-2">
              <NavLink to={`profile/${report.resolvedBy.username}`}>
                <p className="font-medium whitespace-nowrap">
                  {report.resolvedBy.username}
                </p>
              </NavLink>
              <Tag color="red">{report?.resolvedBy.role.name}</Tag>
            </div>
          )}
        />
      </Table>

      {/* {reports && reports.length > 0 && (
        <div className="flex justify-center mt-5" onClick={handleLoadMore}>
          <Button type="button" kind="primary" height="40px">
            Load more
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default UserReportsResolved;
