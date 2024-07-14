"use strict";
const { faker } = require("@faker-js/faker");

const generateDate = () => new Date();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [];

    for (let i = 0; i < 1000; i++) {
      const email = faker.internet.email();

      const user = {
        username: `@${email.split("@")[0]}`,
        email: email,
        isVerified: 1,
        createdAt: generateDate(),
        updatedAt: generateDate(),
      };

      const profile = {
        fullname: faker.person.fullName(),
        avatar: faker.image.avatar(),
        userId: i + 1,
        createdAt: generateDate(),
        updatedAt: generateDate(),
      };

      data.push({ user, profile });
    }

    const users = data.map((item) => item.user);
    const profiles = data.map((item) => item.profile);

    await Promise.all([
      queryInterface.bulkInsert("users", users),
      queryInterface.bulkInsert("profiles", profiles),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.bulkDelete("profiles", null, {}),
      queryInterface.bulkDelete("users", null, {}),
    ]);
  },
};
