import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";
import extractImg from "../../utils/extractImg.js";
import MongoDB from "../../databases/mongodb/connect.js";
import clarifai from "../../services/clarifai.js";
import socket from "../../socket.js";
import SocketUser from "../mongodb/SocketUser.js";
import env from "../../config/env.js";
import Notification from "./Notification.js";
import User from "./User.js";

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "id",
      },
    },

    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    preview: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    likesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    commentsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    reportsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    rejectsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    approvedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },

    deletedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },

    status: {
      type: DataTypes.ENUM("draft", "pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "draft",
    },
  },

  {
    tableName: "articles",
    timestamps: true,
    paranoid: true,
    hooks: {
      afterUpdate: async (article, options) => {
        const me = options.me ? options.me : null;
        const reason = options.reason ? options.reason : null;
        const io = socket.getIO();

        const recivers = await SocketUser.find({ userId: article.authorId });

        if (me) {
          if (article.status === "approved" && article.approvedById === me.id) {
            const [notification] = await Promise.all([
              Notification.create({
                reciverId: article.authorId,
                articleId: article.id,
                content: `Your article ${article.title} has been approved by ${me.role.name}. You can now view it`,
              }),
              Profile.increment(
                { notificationsCount: 1 },
                { where: { id: article.authorId } }
              ),
            ]);

            const message = {
              id: notification.id,
              article: {
                id: article.id,
                title: article.title,
                slug: article.slug,
              },
              content: notification.content,
              createdAt: notification.createdAt,
              updatedAt: notification.updatedAt,
            };
            if (recivers.length > 0) {
              recivers.forEach((reciver) => {
                io.to(reciver.socketId).emit(
                  env.SOCKET_LISTENING_EVENT,
                  message
                );
              });
            }
          }

          if (article.status === "draft") {
            const [notification] = await Promise.all([
              Notification.create({
                reciverId: article.authorId,
                articleId: article.id,
                content: reason
                  ? reason
                  : `Your article ${article.title} has been set back to draft by ${me.role.name}`,
              }),
              Profile.increment(
                { notificationsCount: 1 },
                { where: { id: article.authorId } }
              ),
            ]);

            const message = {
              id: notification.id,
              content: notification.content,
              createdAt: notification.createdAt,
              updatedAt: notification.updatedAt,
            };
            if (recivers.length > 0) {
              recivers.forEach((reciver) => {
                io.to(reciver.socketId).emit(
                  env.SOCKET_LISTENING_EVENT,
                  message
                );
              });
            }
          }
        } else {
          const imgsName = extractImg(article.content);

          imgsName.push(article.banner);

          const gfs = MongoDB.gfs;

          let array = [];

          await Promise.all(
            imgsName.map(async (imgName) => {
              const files = await gfs.find({ filename: imgName }).toArray();

              if (!files || !files.length) {
                return;
              }

              const readStream = gfs.openDownloadStreamByName(imgName);
              const chunks = [];

              await new Promise((resolve, reject) => {
                readStream.on("data", (chunk) => chunks.push(chunk));

                readStream.on("end", () => {
                  const imageData = Buffer.concat(chunks).toString("base64");
                  array.push(imageData);
                  resolve();
                });

                readStream.on("error", (error) => {
                  reject(error);
                });
              });
            })
          );

          if (array.length === 0) {
            const [notification] = await Promise.all([
              Notification.create({
                reciverId: article.authorId,
                articleId: article.id,
                content: `Your article ${article.title} has been approved. You can now view it`,
              }),
              article.update({ status: "approved" }, { hooks: false }),
              Profile.increment(
                { notificationsCount: 1 },
                { where: { id: article.authorId } }
              ),
            ]);

            const message = {
              id: notification.id,
              article: {
                id: article.id,
                title: article.title,
                slug: article.slug,
              },
              content: notification.content,
              createdAt: notification.createdAt,
              updatedAt: notification.updatedAt,
            };

            if (recivers.length > 0) {
              recivers.forEach((reciver) => {
                io.to(reciver.socketId).emit(
                  env.SOCKET_LISTENING_EVENT,
                  message
                );
              });
            }
          } else {
            clarifai(array, async (err, results) => {
              if (err) {
                return;
              }

              const nsfwFound = Boolean(
                results.some((data) =>
                  data.some((val) => "nsfw" in val && val.nsfw > 0.55)
                )
              );

              const [notification] = await Promise.all([
                Notification.create({
                  reciverId: article.authorId,
                  articleId: nsfwFound ? null : article.id,
                  content: nsfwFound
                    ? `Explicit content detected in your article ${article.title}. Investigation underway. Thank you for your patience`
                    : `Your article ${article.title} has been approved. You can now view it`,
                }),
                article.update(
                  {
                    status: nsfwFound ? "rejected" : "approved",
                    rejectsCount: nsfwFound
                      ? article.rejectsCount + 1
                      : article.rejectsCount,
                  },
                  { hooks: false }
                ),
                Profile.increment(
                  { notificationsCount: 1 },
                  { where: { id: article.authorId } }
                ),
              ]);

              const message = nsfwFound
                ? {
                    id: notification.id,
                    content: notification.content,
                    createdAt: notification.createdAt,
                    updatedAt: notification.updatedAt,
                  }
                : {
                    id: notification.id,
                    article: {
                      id: article.id,
                      title: article.title,
                      slug: article.slug,
                    },
                    content: notification.content,
                    createdAt: notification.createdAt,
                    updatedAt: notification.updatedAt,
                  };

              if (recivers.length > 0) {
                recivers.forEach((reciver) => {
                  io.to(reciver.socketId).emit(
                    env.SOCKET_LISTENING_EVENT,
                    message
                  );
                });
              }
            });
          }
        }
      },

      afterDestroy: async (article, options) => {
        const me = options.me;

        const io = socket.getIO();

        const [recivers, notification] = await Promise.all([
          SocketUser.find({ userId: article.authorId }),
          Notification.create({
            reciverId: article.authorId,
            content: `Your article ${article.title} was removed by ${me.role.name} for violation of the rules`,
          }),
          Profile.increment(
            { notificationsCount: 1 },
            { where: { id: article.authorId } }
          ),
        ]);

        if (recivers.length > 0) {
          const message = {
            id: notification.id,
            content: notification.content,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
          };

          recivers.forEach((reciver) => {
            io.to(reciver.socketId).emit(env.SOCKET_LISTENING_EVENT, message);
          });
        }
      },

      afterRestore: async (article, options) => {
        const me = options.me;
        const io = socket.getIO();

        const [recivers, notification] = await Promise.all([
          SocketUser.find({ userId: article.authorId }),
          Notification.create({
            reciverId: article.authorId,
            content: `Your article ${article.title} has been restored by ${me.role.name}`,
          }),
          Profile.increment(
            { notificationsCount: 1 },
            { where: { id: article.authorId } }
          ),
        ]);

        if (recivers.length > 0) {
          const message = {
            id: notification.id,
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

export default Article;
