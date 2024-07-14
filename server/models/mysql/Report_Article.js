import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import User from "./User.js";
import Article from "./Article.js";

const Report_Article = sequelize.define(
  "Report_Article",
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

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },

    reason: {
      type: DataTypes.ENUM("Harassment", "Rules Violation", "Spam"),
      allowNull: true,
    },

    resolvedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },

    status: {
      type: DataTypes.ENUM("pending", "resolved"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "report_articles",
    timestamps: true,
  }
);

export default Report_Article;
