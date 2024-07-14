"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("articles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: Profile,
        //   key: "id",
        // },
      },

      banner: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      preview: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      likesCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      commentsCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      reportsCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      rejectsCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      approvedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: User,
        //   key: "id",
        // },
      },

      deletedById: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: User,
        //   key: "id",
        // },
      },

      status: {
        type: Sequelize.ENUM("draft", "pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "draft",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("articles");
  },
};
