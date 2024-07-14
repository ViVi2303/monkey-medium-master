import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Article from "./Article.js";
import Profile from "./Profile.js";
import addUrlToImg from "../../utils/addUrlToImg.js";
import Notification from "./Notification.js";
import SocketUser from "../mongodb/SocketUser.js";
import socket from "../../socket.js";
import env from "../../config/env.js";

const Comment = sequelize.define(
  "Comment",
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

    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "id",
      },
    },

    parentCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    repliesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    depth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    tableName: "comments",
    timestamps: true,
    hooks: {
      afterCreate: async (Comment, options) => {
        const me = options.me;
        const article = options.article;
        const isAuthor = options.isAuthor;
        const parentComment = options.parentComment;

        await article.increment({ commentsCount: 1 });

        let notificationData = {};

        if (
          (isAuthor && !parentComment) ||
          (parentComment && parentComment.authorId === me.profileInfo.id)
        ) {
          return;
        }

        if (
          (isAuthor &&
            parentComment &&
            parentComment.authorId !== me.profileInfo.id) ||
          (!isAuthor &&
            parentComment &&
            parentComment.authorId !== me.profileInfo.id)
        ) {
          notificationData = {
            senderId: me.profileInfo.id,
            reciverId: parentComment.authorId,
            articleId: article.id,
            content: `${me.profileInfo.fullname} reply to you on ${article.title}`,
          };
        }

        if (!isAuthor && !parentComment) {
          notificationData = {
            senderId: me.profileInfo.id,
            reciverId: article.authorId,
            articleId: article.id,
            content: `${me.profileInfo.fullname} comment on your article ${article.title}`,
          };
        }

        const [notification, recivers] = await Promise.all([
          Notification.create(notificationData),
          SocketUser.find({ userId: notificationData.reciverId }),
          Profile.increment(
            { notificationsCount: 1 },
            { where: { id: notificationData.reciverId } }
          ),
        ]);

        if (recivers && recivers.length > 0) {
          const io = socket.getIO();

          const message = {
            id: notification.id,
            sender: {
              id: me.profileInfo.id,
              fullname: me.profileInfo.fullname,
              avatar: addUrlToImg(me.profileInfo.avatar),
              username: me.username,
              role: me.role.slug,
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

          recivers.forEach((reciver) => {
            io.to(reciver.socketId).emit(env.SOCKET_LISTENING_EVENT, message);
          });
        }
      },
    },
  }
);

export default Comment;
