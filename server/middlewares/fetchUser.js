import getError from "../utils/getError.js";
import User from "../models/mysql/User.js";
import Profile from "../models/mysql/Profile.js";
import Role from "../models/mysql/Role.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import { Op } from "sequelize";

const fetchUser = async (req, res, next) => {
  try {
    const userId = req.params && req.params.id ? req.params.id : null;
    const username =
      req.params && req.params.username ? req.params.username : null;

    if (!userId && !username) {
      return res.status(400).json({
        success: false,
        message: "Invalid params imput",
      });
    }

    const user = await User.findOne({
      where: { isVerified: true, [Op.or]: [{ id: userId }, { username }] },
      attributes: ["status", "bannedUntil", "id", "username"],
      include: [
        {
          model: Profile,
          as: "profileInfo",
          attributes: { exclude: ["userId", "notificationsCount"] },
        },
        { model: Role, as: "role", attributes: ["id", "name", "slug"] },
      ],
    });

    if (!user || !user.profileInfo.avatar || !user.profileInfo.fullname) {
      return res.status(404).json({
        success: false,
        message: "User not found or has not set up a profile",
      });
    }

    user.profileInfo.avatar = addUrlToImg(user.profileInfo.avatar);

    req.user = user;
    next();
  } catch (error) {
    const err = getError(error);
    return res.status(err.code).json({
      success: false,
      message: err.message,
    });
  }
};

export default fetchUser;
