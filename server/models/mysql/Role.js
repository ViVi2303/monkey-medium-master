import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },

  {
    tableName: "roles",
    timestamps: false,
  }
);

export default Role;
