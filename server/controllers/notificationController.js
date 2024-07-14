import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Profile from "../models/mysql/Profile.js";
import Notification from "../models/mysql/Notification.js";
import User from "../models/mysql/User.js";
import Role from "../models/mysql/Role.js";
import { Op } from "sequelize";
import ErrorResponse from "../responses/ErrorResponse.js";
import Article from "../models/mysql/Article.js";

// ==================== get notifications ==================== //

const getNotifications = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { reciverId: me.profileInfo.id };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const [notifications] = await Promise.all([
    Notification.findAll({
      where: whereQuery,
      attributes: { exclude: ["senderId", "reciverId", "articleId"] },
      include: [
        {
          model: Profile,
          as: "sender",
          attributes: ["id", "fullname", "avatar"],
          include: {
            model: User,
            as: "userInfo",
            attributes: ["username"],
            include: { model: Role, as: "role", attributes: ["slug"] },
          },
        },
        {
          model: Article,
          as: "article",
          attributes: ["id", "title", "slug"],
        },
      ],
      order: [["id", "DESC"]],
      limit: Number(limit) ? Number(limit) : 15,
    }),
    me.profileInfo.update({ notificationsCount: 0 }),
  ]);

  const newSkip =
    notifications.length > 0
      ? notifications[notifications.length - 1].id
      : null;

  res.json({
    success: true,
    data: notifications,
    notificationsCount: 0,
    newSkip,
  });
});

// ==================== mark as read ==================== //

const markAsRead = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const notification = await Notification.findOne({
    where: { id, isRead: false },
  });

  if (!notification) throw ErrorResponse(404, "Notification not found");

  await notification.update({ isRead: true });

  res.json({
    success: true,
    message: "Marked notification as readed successfully",
  });
});

// ==================== mark all as read ==================== //

const martAllAsRead = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  await Notification.update(
    { isRead: true },
    { where: { reciverId: me.profileInfo.id, isRead: false } }
  );

  res.json({
    success: true,
    message: "Marked all notifications as readed successfully",
  });
});

// ==================== clear read notifications ==================== //

const clearReadNotifications = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  await Notification.destroy({
    where: { reciverId: me.profileInfo.id, isRead: true },
  });

  res.json({
    success: true,
    message: "Cleared read notifications successfully",
  });
});

export default {
  getNotifications,
  markAsRead,
  martAllAsRead,
  clearReadNotifications,
};
