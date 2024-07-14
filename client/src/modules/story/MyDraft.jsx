/* eslint-disable react/prop-types */
import { Popover } from "antd";
import { useEffect, useState } from "react";
import { apiGetMyDraft } from "../../api/apiNew";
import timeAgo from "../modulesJs/timeAgo";
import { Link } from "react-router-dom";
import { apiDeleteDraft } from "../../api/api";
const PopoverContent = ({ id, handleDeleteDraft }) => {
  return (
    <div className="">
      <button className="block mb-3 hover:text-black">
        <Link to={`/edit-blog/${id}`}>Edit Draft</Link>
      </button>
      <button
        onClick={() => handleDeleteDraft(id)}
        className="text-red-400 hover:text-red-600"
      >
        Delete Draft
      </button>
    </div>
  );
};
const MyDraft = () => {
  const [draft, setDrafts] = useState([]);
  async function fetchDrafts() {
    const response = await apiGetMyDraft(localStorage.getItem("token"));
    if (response?.success) setDrafts(response?.data);
  }
  const handleDeleteDraft = async (id) => {
    const response = await apiDeleteDraft(id);
    if (response?.success) {
      fetchDrafts();
    }
  };
  useEffect(() => {
    fetchDrafts();
  }, []);
  return (
    <>
      {draft?.map((val) => (
        <div
          key={val?.id}
          className="text-base py-3 border-b w-full overflow-hidden"
        >
          <Link className="font-bold line-clamp-1" to={`/edit-blog/${val?.id}`}>
            {val?.title || "Untitled story"}
          </Link>
          <p className="">{val?.preview || ""}</p>
          <div className="flex items-center py-1 justify-between w-full">
            <span>Created {timeAgo(val?.createdAt)}</span>
            <Popover
              className="ml-1 cursor-pointer"
              trigger={"click"}
              content={
                <PopoverContent
                  handleDeleteDraft={handleDeleteDraft}
                  id={val?.id}
                />
              }
              placement="bottom"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.39 12c0 .55.2 1.02.59 1.41.39.4.86.59 1.4.59.56 0 1.03-.2 1.42-.59.4-.39.59-.86.59-1.41 0-.55-.2-1.02-.6-1.41A1.93 1.93 0 0 0 6.4 10c-.55 0-1.02.2-1.41.59-.4.39-.6.86-.6 1.41zM10 12c0 .55.2 1.02.58 1.41.4.4.87.59 1.42.59.54 0 1.02-.2 1.4-.59.4-.39.6-.86.6-1.41 0-.55-.2-1.02-.6-1.41a1.93 1.93 0 0 0-1.4-.59c-.55 0-1.04.2-1.42.59-.4.39-.58.86-.58 1.41zm5.6 0c0 .55.2 1.02.57 1.41.4.4.88.59 1.43.59.57 0 1.04-.2 1.43-.59.39-.39.57-.86.57-1.41 0-.55-.2-1.02-.57-1.41A1.93 1.93 0 0 0 17.6 10c-.55 0-1.04.2-1.43.59-.38.39-.57.86-.57 1.41z"
                  fill="currentColor"
                ></path>
              </svg>
            </Popover>
          </div>
        </div>
      ))}
    </>
  );
};

export default MyDraft;
