"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("follow_profiles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      followedId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: Profile,
        //   key: "id",
        // },
      },

      followerId: {
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
    await queryInterface.dropTable("follow_profiles");
  },
};
