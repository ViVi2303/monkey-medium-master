import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import User from "./User.js";

const Report_User = sequelize.define(
  "Report_User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    reportedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },

    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },

    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
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
    tableName: "report_users",
    timestamps: true,
  }
);

export default Report_User;
