import { Popover } from "antd";
import { icons } from "../../utils/constants";
import { apiAddReadingList, apiDeleteReadingList } from "../../api/apisHung";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const ButtonSaveBlog = ({ BlogId, checkMyProfile }) => {
  const [isSaveList, setIsSaveList] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (typeof checkMyProfile === "boolean") setIsSaveList(checkMyProfile);
  }, [checkMyProfile]);

  const handleSaveList = async () => {
    let response;
    if (!isSaveList) {
      response = await apiAddReadingList(token, BlogId);
    } else {
      response = await apiDeleteReadingList(token, BlogId);
    }
    if (response?.success) setIsSaveList(!isSaveList);
  };

  return (
    <>
      <Popover placement="leftTop" content={<p>Save to List</p>}>
        <button
          className="flex items-center text-gray-400 hover:text-gray-600"
          onClick={handleSaveList}
        >
          {isSaveList ? icons.savedIcon : icons.saveIcon}
        </button>
      </Popover>
    </>
  );
};

export default ButtonSaveBlog;
