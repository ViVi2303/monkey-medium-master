import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import User from "./User.js";

const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    fullname: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    followingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    followersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    notificationsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },

  {
    tableName: "profiles",
    timestamps: true,
  }
);

export default Profile;
