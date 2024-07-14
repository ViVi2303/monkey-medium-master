import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Topic from "./Topic.js";
import Article from "./Article.js";

const Article_Topic = sequelize.define(
  "Article_Topic",
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

    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Topic,
        key: "id",
      },
    },
  },

  {
    tableName: "articles_topics",
    timestamps: false,
    hooks: {
      afterBulkCreate: async (newTopics, options) => {
        const operation = newTopics.map((newTopic) => {
          return Topic.increment(
            { articlesCount: 1 },
            { where: { id: newTopic.topicId } }
          );
        });

        await Promise.all([operation]);
      },

      afterBulkDestroy: async (options) => {
        const oldTopics = options.oldTopics;

        const operation = oldTopics.map((oldTopic) => {
          return oldTopic.increment({ articlesCount: -1 });
        });

        await Promise.all([operation]);
      },
    },
  }
);

export default Article_Topic;
