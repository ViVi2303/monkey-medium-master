import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Mute from "../models/mysql/Mute.js";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import Role from "../models/mysql/Role.js";

// ==================== mute a profile ==================== //

const muteAProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Cannot mute your own profile");
  }

  if (user.role.slug === "admin" || user.role.slug === "staff") {
    throw ErrorResponse(400, `Cannot mute ${user.role.name}`);
  }

  const mutes = await Mute.findOne({
    where: { mutedId: user.profileInfo.id, muterId: me.profileInfo.id },
  });

  if (!mutes) {
    await Mute.create({
      mutedId: user.profileInfo.id,
      muterId: me.profileInfo.id,
    });
  }

  res.status(201).json({
    success: true,
    message: `${user.profileInfo.fullname} has been muted`,
  });
});

// ==================== unmute a profile ==================== //

const unMuteAProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Bad Request: Cannot unmute your own profile");
  }

  const mutes = await Mute.findOne({
    where: { mutedId: user.profileInfo.id, muterId: me.profileInfo.id },
  });

  if (mutes) await mutes.destroy();

  res.json({
    success: true,
    message: `${user.profileInfo.fullname} has been unmuted`,
  });
});

// ==================== get list of muted profiles ==================== //
const getMutedProfiles = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip = 0, limit = 15 } = req.query;

  const mutedProfiles = await Mute.findAll({
    where: { muterId: me.profileInfo.id, id: { [Op.gt]: skip } },
    attributes: ["id"],
    include: {
      model: Profile,
      as: "muted",
      attributes: ["id", "fullname", "avatar", "bio"],
      include: {
        model: User,
        as: "userInfo",
        attributes: ["username"],
        include: { model: Role, as: "role", attributes: ["slug"] },
      },
    },
    limit: Number(limit) ? Number(limit) : 15,
  });

  const muteds = mutedProfiles.map((mutedProfile) => {
    return {
      id: mutedProfile.muted.id,
      fullname: mutedProfile.muted.fullname,
      avatar: addUrlToImg(mutedProfile.muted.avatar),
      bio: mutedProfile.muted.bio,
      username: mutedProfile.muted.userInfo.username,
    };
  });

  const newSkip =
    mutedProfiles.length > 0
      ? mutedProfiles[mutedProfiles.length - 1].id
      : null;

  res.json({ success: true, data: muteds, newSkip });
});

export default { muteAProfile, unMuteAProfile, getMutedProfiles };
