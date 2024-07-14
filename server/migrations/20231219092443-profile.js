"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("profiles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      avatar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      fullname: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      bio: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      about: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      followingCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      followersCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      notificationsCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: User,
        //   key: "id",
        // },
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
    await queryInterface.dropTable("profiles");
  },
};
