"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      senderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: Profile,
        //   key: "id",
        // },
      },

      reciverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: Profile,
        //   key: "id",
        // },
      },

      articleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: Article,
        //   key: "id",
        // },
      },

      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      isRead: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable("notifications");
  },
};
