import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import toSlug from "../utils/toSlug.js";
import Topic from "../models/mysql/Topic.js";
import { Op } from "sequelize";
import ErrorResponse from "../responses/ErrorResponse.js";
import Follow_Topic from "../models/mysql/Follow_Topic.js";
import User from "../models/mysql/User.js";
import Role from "../models/mysql/Role.js";
import toUpperCase from "../utils/toUpperCase.js";
import sequelize from "../databases/mysql/connect.js";

// ==================== create topic ==================== //

const createTopic = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body;

  const slug = toSlug(name);

  const existingTopic = await Topic.findOne({
    where: { [Op.or]: [{ name }, { slug }] },
  });

  if (existingTopic) throw ErrorResponse(409, "Topic already exists");

  const upperCaseName = toUpperCase(name);

  await Topic.create({ name: upperCaseName, slug, status: "approved" });

  res.status(201).json({
    success: true,
    message: "Topic created successfully",
  });
});

// ==================== update topic ==================== //

const updateTopic = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const existingTopic = await Topic.findByPk(id);

  if (!existingTopic) throw ErrorResponse(404, "Topic not found");

  if (existingTopic.status !== "approved") {
    throw ErrorResponse(400, "Topic need to be approved before update");
  }

  const updatedSlug = toSlug(name);

  const newNameTopic = await Topic.findOne({
    where: { [Op.or]: [{ name }, { slug: updatedSlug }] },
  });

  if (newNameTopic && newNameTopic.id !== existingTopic.id) {
    throw ErrorResponse(409, "Topic name already exist");
  }

  const upperCaseName = toUpperCase(name);

  await existingTopic.update({ name: upperCaseName, slug: updatedSlug });

  res.json({ success: true, message: "Topic updated successfully" });
});

// ==================== delete topic ==================== //

const deleteTopic = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;

  await Topic.destroy({ where: { id } });

  res.json({ success: true, message: "Topic deleted successfully" });
});

// ==================== get a topic ==================== //

const getATopic = asyncMiddleware(async (req, res, next) => {
  const me = req.me ? req.me : null;
  const { slug } = req.params;

  let topic = await Topic.findOne({
    where: { slug, status: "approved" },
    attributes: ["id", "name", "followersCount", "articlesCount"],
  });

  if (!topic) throw ErrorResponse(404, "Topic not found");

  if (me) {
    topic = {
      ...topic.toJSON(),
      isFollowed: !!(await Follow_Topic.findOne({
        where: { topicId: topic.id, profileId: me.profileInfo.id },
      })),
    };
  }

  res.json({ success: true, data: topic });
});

// ==================== get all topics ==================== //

const getAllTopics = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15, search, option } = req.query;

  let whereQuery = {};

  if (skip) whereQuery.id = { [Op.lt]: skip };

  if (search) whereQuery.slug = { [Op.substring]: search };

  if (option) {
    whereQuery.status = { [Op.eq]: option };
  }

  const topics = await Topic.findAll({
    where: whereQuery,
    include: {
      model: User,
      as: "approvedBy",
      attributes: ["id", "email", "username"],
      include: { model: Role, as: "role", attributes: ["id", "name", "slug"] },
    },
    include: {
      model: User,
      as: "rejectedBy",
      attributes: ["id", "email", "username"],
      include: { model: Role, as: "role", attributes: ["id", "name", "slug"] },
    },
    attributes: { exclude: ["approvedById"] },
    limit: Number(limit) ? Number(limit) : 15,
    order: [["id", "DESC"]],
  });

  const newSkip = topics.length > 0 ? topics[topics.length - 1].id : null;

  res.json({ success: true, data: topics, newSkip });
});

// ==================== mark topic as approved ==================== //

const martTopicAsApproved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const topic = await Topic.findByPk(id);

  if (!topic) throw ErrorResponse(404, "Topic not found ");

  if (topic.status === "approved") {
    throw ErrorResponse(400, "Topic already approved");
  }

  await topic.update({ status: "approved", approvedById: me.id });

  res.json({
    success: true,
    message: `Topic ${topic.name} approved successfully`,
  });
});

// ==================== mark topic as rejected ==================== //

const martTopicAsRejected = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const topic = await Topic.findByPk(id);

  if (!topic) throw ErrorResponse(404, "Topic not found ");

  if (topic.status === "rejected") {
    throw ErrorResponse(400, "Topic already rejected");
  }

  await topic.update({ status: "rejected", rejectedById: me.id });

  res.json({
    success: true,
    message: `Topic ${topic.name} rejected successfully`,
  });
});

// ==================== search for topics during create article ==================== //

const searchTopicsCreateArticle = asyncMiddleware(async (req, res, next) => {
  const { skip = 0, limit = 15, search } = req.query;

  let topics = [];

  if (search) {
    topics = await Topic.findAll({
      where: {
        id: { [Op.gt]: skip },
        status: "approved",
        [Op.or]: [
          { name: { [Op.substring]: search } },
          { slug: { [Op.substring]: search } },
        ],
      },
      attributes: ["id", "name", "slug", "articlesCount"],
      limit: Number(limit) ? Number(limit) : 15,
    });
  }

  const newSkip = topics.length > 0 ? topics[topics.length - 1].id : null;

  res.json({ success: true, data: topics, newSkip });
});

// ==================== explore all topics ==================== //

const exploreAllTopics = asyncMiddleware(async (req, res, next) => {
  const { skip = 0, limit = 15 } = req.query;

  const topics = await Topic.findAll({
    where: { id: { [Op.gt]: skip }, status: "approved" },
    attributes: ["id", "name", "slug"],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = topics.length > 0 ? topics[topics.length - 1].id : null;

  res.json({ success: true, data: topics, newSkip });
});

// ==================== recommended topics ==================== //

const recommendedTopics = asyncMiddleware(async (req, res, next) => {
  const { max = 8 } = req.query;
  const me = req.me;

  let recommendedTopics = await sequelize.query(
    `
    SELECT t.id, t.name, t.slug, t.followersCount, t.articlesCount
    FROM topics AS t
    LEFT JOIN (
      (
        SELECT at.topicId, COUNT(at.topicId) AS topicCount
        FROM articles_topics AS at
        INNER JOIN reading_historys AS rh ON at.articleId = rh.articleId
        WHERE rh.profileId = ${me.profileInfo.id}
        GROUP BY at.topicId
      )
      UNION ALL
      (
        SELECT at.topicId, COUNT(at.topicId) AS topicCount
        FROM articles_topics AS at
        INNER JOIN reading_lists AS rl ON at.articleId = rl.articleId
        WHERE rl.profileId = ${me.profileInfo.id}
        GROUP BY at.topicId
      )
      UNION ALL
      (
        SELECT at.topicId, COUNT(at.topicId) AS topicCount
        FROM articles_topics AS at
        INNER JOIN likes AS l ON at.articleId = l.articleId
        WHERE l.profileId = ${me.profileInfo.id}
        GROUP BY at.topicId
      )
    ) AS CombinedResults ON t.id = CombinedResults.topicId
    LEFT JOIN follow_topics AS ft ON t.id = ft.topicId AND ft.profileId = ${me.profileInfo.id}
    WHERE ft.id IS NULL AND CombinedResults.topicId IS NOT NULL AND t.status = "approved"
    GROUP BY t.id, t.name, t.slug, t.followersCount
    ORDER BY COALESCE(SUM(topicCount), 0) DESC
    LIMIT ${max};
    `,
    { type: sequelize.QueryTypes.SELECT }
  );

  if (recommendedTopics.length < max) {
    const recommendedTopicsId = recommendedTopics.map((topic) => topic.id);
    const random = await Topic.findAll({
      where: {
        id: { [Op.notIn]: recommendedTopicsId },
        "$followTopic.topicId$": null,
        status: "approved",
      },
      attributes: {
        exclude: ["approvedById", "status", "createdAt", "updatedAt"],
      },
      include: {
        model: Follow_Topic,
        as: "followTopic",
        where: { profileId: me.profileInfo.id },
        attributes: [],
        required: false,
      },
      order: sequelize.literal("RAND()"),
      limit: max - recommendedTopics.length,
    });

    recommendedTopics.push(...random);
  }

  res.json({ success: true, data: recommendedTopics });
});

export default {
  createTopic,
  updateTopic,
  deleteTopic,
  getATopic,
  getAllTopics,
  martTopicAsApproved,
  martTopicAsRejected,
  searchTopicsCreateArticle,
  exploreAllTopics,
  recommendedTopics,
};
