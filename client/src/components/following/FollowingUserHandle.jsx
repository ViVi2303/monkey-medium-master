/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Avatar from "../../modules/user/Avatar";
import ButtonFollowingUser from "../button/ButtonFollowingUser";

const FollowingUserHandle = ({ data = {}, initialFollowing = false }) => {
  const { id, username, avatar, fullname, bio } = data;
  if (!data) return;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center ">
        <Link to={`/profile/${username}`}>
          <Avatar size="small" url={avatar} />
        </Link>
        <div className="py-3 pr-5 ml-2 ">
          <Link to={`/profile/${username}`}>
            <h3 className="text-base font-semibold text-gray-400 transition-all hover:text-gray-600">
              {fullname}
            </h3>
          </Link>
          {bio && <p className="max-w-xs text-sm line-clamp-2">{bio}</p>}
        </div>
      </div>
      <ButtonFollowingUser
        userId={id}
        initialFollowing={initialFollowing}
      ></ButtonFollowingUser>
    </div>
  );
};

export default FollowingUserHandle;
