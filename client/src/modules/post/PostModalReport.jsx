import { useCallback, useEffect, useState } from "react";
import {
  apiGetPendingReasonsReportsArticles,
  apiMarkReportBlog,
} from "../../api/apisHung";
import useTimeAgo from "../../hooks/useTimeAgo";
import { Popover, Tag } from "antd";
import { icons } from "../../utils/constants";

// eslint-disable-next-line react/prop-types
const PostModalReport = ({ blogId, token }) => {
  const [reasons, setReasons] = useState([]);
  const getTimeAgo = useTimeAgo;

  const fetchReasonBlog = useCallback(async () => {
    const response = await apiGetPendingReasonsReportsArticles(token, blogId);
    if (response.success) {
      setReasons(response.data);
    }
  }, [blogId, token]);

  useEffect(() => {
    fetchReasonBlog();
  }, [fetchReasonBlog]);

  const handleMarkReport = useCallback(
    async (id) => {
      const response = await apiMarkReportBlog(token, id);
      if (response) {
        const reasonsFilter = reasons.filter((reason) => reason.id != id);
        if (reasonsFilter.length === 0) {
          setReasons(reasonsFilter);
        }
      }
    },
    [reasons, token]
  );

  return (
    <>
      {reasons &&
        reasons.length > 0 &&
        reasons.map((reason) => (
          <div
            key={reason.id}
            className="bg-gray-800 p-2 font-semibold flex rounded-md mb-5 justify-between items-center"
          >
            <div className="flex flex-col gap-2">
              <p className="text-gray-200">
                {reason.user.username} -{" "}
                <span>{getTimeAgo(reason.createdAt)}</span>
              </p>
              <p className="text-gray-200">{reason.user.email}</p>
              <h2 className="text-white">
                Reason: <span className="text-red-300">{reason.reason}</span>{" "}
                <Tag color="yellow">{reason.status}</Tag>
              </h2>
            </div>
            <Popover placement="left" content={<p>Mark this report</p>}>
              <button
                className="text-black bg-white h-6 w-6 flex items-center justify-center rounded-md mr-5"
                onClick={() => handleMarkReport(reason.id)}
              >
                {icons.checkIcon}
              </button>
            </Popover>
          </div>
        ))}
    </>
  );
};

export default PostModalReport;
