import { useCallback, useEffect, useState } from "react";
import {
  apiDeleteArticleHistory,
  apiDeleteReadingHistory,
  apiGetReadingHistory,
} from "../../api/apiNew";
import timeAgo from "../modulesJs/timeAgo";
import { Link } from "react-router-dom";
import TopicList from "../topic/TopicList";
import Swal from "sweetalert2";
import BlogImage from "../blog/BlogImage";
import ClearAll from "../../components/modalClear/ClearAll";

const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  console.log("history:", history);
  const fetchApiClearHistory = async () => {
    const response = await apiDeleteReadingHistory();
    if (response?.success) {
      setHistory([]);
    }
  };
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        fetchApiClearHistory();
        Swal.fire("Deleted!", "Your history has been clear.", "success");
      }
    });
  };
  const getHistory = useCallback(async () => {
    const response = await apiGetReadingHistory();
    if (response?.success) {
      setHistory(response.data);
    }
  }, []);
  const handleDeleteAnArticle = useCallback(
    async (id) => {
      const response = await apiDeleteArticleHistory(id);
      if (response?.success) {
        getHistory();
      }
    },
    [getHistory]
  );
  useEffect(() => {
    getHistory();
  }, [getHistory]);
  return (
    <div>
      <ClearAll
        title={"You can clear your reading history for a fresh start."}
        titlebtn={"Clear history"}
        handleDelete={handleDelete}
      />
      {history.map((val) => (
        <div key={val.id} className=" pt-6 border-b">
          <div className="">
            <p className="text-sm">{timeAgo(val?.createdAt)}</p>
          </div>
          <div className="flex mt-3">
            <div className="flex-1  max-w-[80%]">
              <Link to={`/blog/${val.slug}`}>
                <h2 className="pb-1 text-xl font-bold">{val.title}</h2>
                <p className="text-sm line-clamp-3">{val.preview} </p>
              </Link>
              <div className="flex items-center justify-between py-7">
                <TopicList data={[val?.topic]}></TopicList>
                <div className="flex items-center">
                  <button
                    onClick={() => handleDeleteAnArticle(val?.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            {val?.banner && (
              <div className="ml-14">
                <BlogImage
                  className="flex-shrink-0"
                  url={val?.banner}
                  alt=""
                  to={`/blog/${val.slug}`}
                ></BlogImage>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadingHistory;
