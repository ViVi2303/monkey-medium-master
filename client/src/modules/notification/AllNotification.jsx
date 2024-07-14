import { Link } from "react-router-dom";
import timeSince from "../modulesJs/timeAgo";
import Avatar from "../user/Avatar";
import { useSocket } from "../../contexts/SocketContext";
import logo from "../../assets/logo.png";
import ClearAll from "../../components/modalClear/ClearAll";
import Swal from "sweetalert2";

const AllNotification = () => {
  const { notifications, handleClearNotifications } = useSocket();
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
        handleClearNotifications();
        Swal.fire("Deleted!", "Your history has been clear.", "success");
      }
    });
  };
  return (
    <>
      <div className="">
        <ClearAll
          title={"You can clear your notifications."}
          titlebtn={"Clear notification"}
          handleDelete={handleDelete}
        />
        {notifications &&
          notifications.length > 0 &&
          notifications?.map((val, idx) => (
            <Link
              key={idx}
              to={val?.article?.slug ? `/blog/${val?.article?.slug}` : `/`}
              onClick={(e) => {
                if (!val?.article?.slug) {
                  e.preventDefault();
                }
              }}
            >
              <div
                className={`flex items-center py-3 hover:bg-stone-100  cursor-pointer ${
                  !val?.isRead && "bg-stone-100"
                }`}
              >
                <div className="m-2">
                  <Avatar
                    size="medium"
                    url={val?.sender?.avatar || logo}
                  ></Avatar>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold  ">{val?.content} </p>
                  <div className="text-xs text-gray-400">
                    {timeSince(val?.createdAt) || "now"}
                  </div>
                </div>
                {/* <div className="relative bg-lime-400 w-3 h-3 rounded-1/2"></div> */}
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default AllNotification;
