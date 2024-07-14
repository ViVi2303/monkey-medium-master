import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";
import Profile from "../models/mysql/Profile.js";

// ==================== make a user staff ==================== //

const makeUserStaff = asyncMiddleware(async (req, res, next) => {
  const user = req.user;

  await user.update({ roleId: 2 });

  res.json({
    success: true,
    message: `Make ${user.profileInfo.fullname} staff successfully`,
  });
});

// ==================== make a user user ==================== //

const makeUserUser = asyncMiddleware(async (req, res, next) => {
  const user = req.user;

  await user.update({ roleId: 1 });

  res.json({
    success: true,
    message: `Make ${user.profileInfo.fullname} user successfully`,
  });
});

// ==================== get all staffs ==================== //

const getAllStaffs = asyncMiddleware(async (req, res, next) => {
  const { skip = 0, limit = 15, search } = req.query;

  let whereQuery = { roleId: 2, id: { [Op.gt]: skip } };

  if (search) {
    whereQuery[Op.or] = [
      {
        username: { [Op.substring]: search },
        email: { [Op.substring]: search },
      },
    ];
  }

  const staffs = await User.findAll({
    where: whereQuery,
    attributes: { exclude: ["roleId", "bannedById", "isVerified", "password"] },
    include: {
      model: Profile,
      as: "profileInfo",
      attributes: [],
      where: { avatar: { [Op.ne]: null }, fullname: { [Op.ne]: null } },
    },
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = staffs.length > 0 ? staffs[staffs.length - 1].id : null;

  res.json({ success: true, data: staffs, newSkip });
});

export default { makeUserStaff, makeUserUser, getAllStaffs };
