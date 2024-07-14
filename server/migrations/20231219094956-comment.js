"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comments", {
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

      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: Profile,
        //   key: "id",
        // },
      },

      parentCommentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      repliesCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      depth: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("comments");
  },
};
