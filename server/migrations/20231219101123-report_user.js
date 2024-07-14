"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("report_users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      reportedId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: User,
        //   key: "id",
        // },
      },

      reporterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: User,
        //   key: "id",
        // },
      },

      reason: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      resolvedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: User,
        //   key: "id",
        // },
      },

      status: {
        type: Sequelize.ENUM("pending", "resolved"),
        allowNull: false,
        defaultValue: "pending",
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
    await queryInterface.dropTable("report_users");
  },
};
