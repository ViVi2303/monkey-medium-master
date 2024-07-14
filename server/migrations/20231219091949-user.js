"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      reportsCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      bansCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      banType: {
        type: Sequelize.ENUM("1week", "1year", "1month", "permanent"),
        allowNull: true,
      },

      bannedUntil: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      bannedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: Role,
        //   key: "id",
        // },
        defaultValue: 1,
      },

      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      status: {
        type: Sequelize.ENUM("normal", "banned"),
        allowNull: false,
        defaultValue: "normal",
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
    await queryInterface.dropTable("users");
  },
};
