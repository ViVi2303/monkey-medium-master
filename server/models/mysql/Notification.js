import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";
import Article from "../mysql/Article.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    senderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Profile,
        key: "id",
      },
    },

    reciverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "id",
      },
    },

    articleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Article,
        key: "id",
      },
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },

  {
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;
