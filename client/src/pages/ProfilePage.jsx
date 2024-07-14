import { useEffect, useState } from "react";
import UpdateProfile from "../components/form/UpdateProfile";
import ProfileInfor from "../modules/profile/ProfileInfor";
import ProfileContext from "../modules/profile/ProfileContext";
import { Outlet, useParams } from "react-router-dom";
import Following from "../components/follow/Following";
import { apiGetProfile, apiGetUserFollowings } from "../api/api";
import StickyBox from "react-sticky-box";

const ProfilePage = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [following, setFollowing] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const { username } = useParams();
  const token = localStorage.getItem("token");
  //fetch information user

  //fetch list user following

  useEffect(() => {
    async function fetchUserInf() {
      const profileUser = await apiGetProfile(token, username);
      setUser({ ...profileUser });
      setIsBlocked(profileUser?.isBlocked);
    }
    fetchUserInf();
  }, [show, token, username]);
  useEffect(() => {
    async function fetchUserFollowing() {
      const dataFollowings = await apiGetUserFollowings(username);
      setFollowing([...dataFollowings]);
    }
    fetchUserFollowing();
  }, [username]);
  return (
    <>
      <div className="w-full border-t border-gray-300"></div>
      {user.isMyProfile && (
        <UpdateProfile user={user} show={show} setShow={setShow} />
      )}
      <div className="container max-w-[1336px] mx-auto flex">
        <div className="w-full md:px-14 md:max-w-[70%] ">
          <ProfileContext
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
            token={token}
            user={user}
          />
          {!isBlocked && <Outlet context={{ user }}></Outlet>}
        </div>
        <div className=" flex-1 max-w-[30%] md:block  ">
          <StickyBox>
            <div className="w-full h-screen p-8 text-gray-500 border-l border-l-gray-300 ">
              {user.id && (
                <ProfileInfor
                  show={show}
                  setShow={setShow}
                  user={user}
                  isBlocked={isBlocked}
                />
              )}

              <Following data={following} token={token} user={user} />
              {/* <TopicRcmm /> */}
            </div>
          </StickyBox>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
