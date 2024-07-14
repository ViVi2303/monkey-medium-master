"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blocks", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      blockedId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: Profile,
        //   key: "id",
        // },
      },

      blockerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: Profile,
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
    await queryInterface.dropTable("blocks");
  },
};
