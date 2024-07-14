"use strict";
const { faker } = require("@faker-js/faker");

const toSlug = (string) => {
  if (!string) {
    return "";
  }

  const regex = /[\/\s]+/;
  let slug = string.split(regex);
  slug = slug.join("-").toLowerCase();
  return slug;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const articles = [];

    for (let i = 0; i < 1000; i++) {
      const title = faker.lorem.sentence();
      const content =
        faker.lorem.paragraphs(4) +
        `<img src="${faker.image.url()}" alt="${faker.image.url()}" />` +
        faker.lorem.paragraphs(4) +
        `<img src="${faker.image.url()}" alt="${faker.image.url()}" />` +
        faker.lorem.paragraphs(4);
      const article = {
        authorId: faker.number.int({ min: 1, max: 100 }),
        title: title,
        slug: toSlug(title),
        preview: faker.lorem.sentences(2),
        content: content,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        status: "approved",
        banner: faker.image.url(),
      };
      articles.push(article);
    }

    await queryInterface.bulkInsert("articles", articles);

    const data = [];

    for (let i = 20; i < 1000; i++) {
      data.push({
        articleId: i,
        topicId: faker.number.int({ min: 1, max: 30 }),
      });
    }

    await queryInterface.bulkInsert("articles_topics", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("articles_topics", null, {});
    await queryInterface.bulkDelete("articles", null, {});
  },
};
