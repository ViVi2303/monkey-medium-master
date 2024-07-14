import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Article from "./Article.js";
import Profile from "./Profile.js";

const Reading_History = sequelize.define(
  "Reading_History",
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
    tableName: "reading_historys",
    timestamps: true,
  }
);

export default Reading_History;
