import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";
import Notification from "./Notification.js";
import socket from "../../socket.js";
import SocketUser from "../mongodb/SocketUser.js";
import addUrlToImg from "../../utils/addUrlToImg.js";
import env from "../../config/env.js";

const Follow_Profile = sequelize.define(
  "Follow_Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    followedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "id",
      },
    },

    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "id",
      },
    },
  },
  {
    tableName: "follow_profiles",
    timestamps: true,
    hooks: {
      afterCreate: async (follow_profile, options) => {
        const me = options.me;
        const user = options.user;

        const [notification, recivers] = await Promise.all([
          Notification.create({
            senderId: follow_profile.followerId,
            reciverId: follow_profile.followedId,
            content: `${me.profileInfo.fullname} followed you.`,
          }),
          SocketUser.find({ userId: user.profileInfo.id }),
          me.profileInfo.increment({ followingCount: 1 }),
          user.profileInfo.increment({
            followersCount: 1,
            notificationsCount: 1,
          }),
        ]);

        if (recivers && recivers.length > 0) {
          const message = {
            id: notification.id,
            sender: {
              id: me.profileInfo.id,
              fullname: me.profileInfo.fullname,
              avatar: addUrlToImg(me.profileInfo.avatar),
              username: me.username,
              role: me.role.slug,
            },
            content: notification.content,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
          };

          const io = socket.getIO();

          recivers.forEach((reciver) => {
            io.to(reciver.socketId).emit(env.SOCKET_LISTENING_EVENT, message);
          });
        }
      },

      afterDestroy: async (follow_profile, options) => {
        const me = options.me;
        const user = options.user;

        await Promise.all([
          me.profileInfo.increment({ followingCount: -1 }),
          user.profileInfo.increment({ followersCount: -1 }),
        ]);
      },
    },
  }
);

export default Follow_Profile;
