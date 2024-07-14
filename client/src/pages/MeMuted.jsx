import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { apiGetMyMuted } from "../api/apisHung";
import ButtonMuted from "../components/buttonMuted";
import { Link } from "react-router-dom";
import Avatar from "../modules/user/Avatar";

const MeMuted = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { userInfo } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      const response = await apiGetMyMuted(token);
      console.log("response:", response);
      if (response?.data) setUsers(response.data);
    }
    fetchUser();
  }, [token]);

  if (!userInfo) return;
  return (
    <div>
      <div className="user-following max-w-[700px] w-full mx-auto">
        <div className="pb-4 mt-6 ">
          <h3 className="mb-3 text-base font-bold">Users Muted</h3>
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center ">
                  <Link to={`/profile/${user.username}`}>
                    <Avatar
                      className="cursor-pointer"
                      size="small"
                      url={user.avatar}
                    />
                  </Link>
                  <div className="py-3 pr-5 ml-2 ">
                    <Link to={`/profile/${user.username}`}>
                      <h3 className="text-base font-semibold text-gray-400 transition-all hover:text-gray-600">
                        {user.fullname}
                      </h3>
                    </Link>
                    {user.bio && (
                      <p className="max-w-xs text-sm line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>
                <ButtonMuted userId={user.id} initialMuted={true}></ButtonMuted>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MeMuted;
