import getError from "../utils/getError.js";
import User from "../models/mysql/User.js";
import Profile from "../models/mysql/Profile.js";
import Role from "../models/mysql/Role.js";
import addUrlToImg from "../utils/addUrlToImg.js";

const fetchMe = async (req, res, next) => {
  try {
    const myUserId =
      req.jwtPayLoad && req.jwtPayLoad.id ? req.jwtPayLoad.id : null;

    if (!myUserId) {
      next();
      return;
    }

    const me = await User.findByPk(myUserId, {
      attributes: ["status", "bannedUntil", "id", "username", "password"],
      include: [
        {
          model: Profile,
          as: "profileInfo",
          attributes: ["id", "fullname", "avatar", "notificationsCount"],
        },
        { model: Role, as: "role", attributes: ["id", "name", "slug"] },
      ],
    });

    if (!me) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (me.status === "banned") {
      if (me.bannedUntil === null) {
        return res.status(403).json({
          success: false,
          message: `You have been permanently banned`,
        });
      }

      return res.status(403).json({
        success: false,
        message: `You have been banned until ${me.bannedUntil}`,
      });
    }

    me.profileInfo.avatar = addUrlToImg(me.profileInfo.avatar);

    req.me = me;

    next();
  } catch (error) {
    const err = getError(error);
    return res.status(err.code).json({
      success: true,
      message: err.message,
    });
  }
};

export default fetchMe;
