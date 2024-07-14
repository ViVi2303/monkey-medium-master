import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Topic from "./Topic.js";
import Profile from "./Profile.js";

const Follow_Topic = sequelize.define(
  "Follow_Topic",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Topic,
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
    tableName: "follow_topics",
    timestamps: true,
    hooks: {
      afterCreate: async (Follow_Topic, options) => {
        const topic = options.topic;

        await topic.increment({ followersCount: 1 });
      },

      afterDestroy: async (Follow_Topic, options) => {
        const topic = options.topic;

        await topic.increment({ followersCount: -1 });
      },
    },
  }
);

export default Follow_Topic;
