"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("articles_topics", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: Article,
        //   key: "id",
        // },
      },

      topicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: Topic,
        //   key: "id",
        // },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("articles_topics");
  },
};
