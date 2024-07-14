import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Article from "./Article.js";
import Profile from "./Profile.js";
import SocketUser from "../mongodb/SocketUser.js";
import socket from "../../socket.js";
import Notification from "./Notification.js";
import addUrlToImg from "../../utils/addUrlToImg.js";
import env from "../../config/env.js";

const Like = sequelize.define(
  "Like",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Article,
        key: "id",
      },
    },

    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "id",
      },
    },
  },

  {
    tableName: "likes",
    timestamps: true,
    hooks: {
      afterCreate: async (Like, options) => {
        const me = options.me;
        const article = options.article;

        const [recivers, notification] = await Promise.all([
          SocketUser.find({ userId: article.authorId }),
          Notification.create({
            senderId: me.profileInfo.id,
            reciverId: article.authorId,
            articleId: article.id,
            content: `${me.profileInfo.fullname} liked your article ${article.title}`,
          }),
          Profile.increment(
            { notificationsCount: 1 },
            { where: { id: article.authorId } }
          ),
          article.increment({ likesCount: 1 }),
        ]);

        if (recivers && recivers.length > 0) {
          const message = {
            id: notification.id,
            sender: {
              id: me.profileInfo.id,
              fullname: me.profileInfo.fullname,
              avatar: addUrlToImg(me.profileInfo.avatar),
              username: me.username,
            },
            article: {
              id: article.id,
              title: article.title,
              slug: article.slug,
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

      afterDestroy: async (Like, options) => {
        const article = options.article;
        await article.increment({ likesCount: -1 });
      },
    },
  }
);

export default Like;
