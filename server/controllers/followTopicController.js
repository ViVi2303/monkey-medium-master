import Follow_Topic from "../models/mysql/Follow_Topic.js";
import Topic from "../models/mysql/Topic.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import { Op } from "sequelize";

// ==================== follow a topic ==================== //

const followATopic = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const topic = await Topic.findOne({ where: { id, status: "approved" } });

  if (!topic) throw ErrorResponse(404, "Topic not found");

  const followTopic = await Follow_Topic.findOne({
    where: { topicId: topic.id, profileId: me.profileInfo.id },
  });

  if (!followTopic) {
    await Follow_Topic.create(
      { topicId: topic.id, profileId: me.profileInfo.id },
      { me: me, topic: topic }
    );
  }

  res.status(201).json({
    success: true,
    message: `Successfully followed topic ${topic.name}`,
  });
});

// ==================== unfollow a topic ==================== //

const unFollowATopic = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const topic = await Topic.findOne({ where: { id, status: "approved" } });

  if (!topic) throw ErrorResponse(404, "Topic not found");

  const followTopic = await Follow_Topic.findOne({
    where: { topicId: topic.id, profileId: me.profileInfo.id },
  });

  if (followTopic) {
    await followTopic.destroy({ me: me, topic: topic });
  }

  res.json({
    success: true,
    message: `Successfully unfollowed topic ${topic.name}`,
  });
});

// ==================== get my followed topics ==================== //

const getMyFollowedTopics = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip = 0, limit = 15 } = req.query;

  const followTopics = await Follow_Topic.findAll({
    where: { profileId: me.profileInfo.id, id: { [Op.gt]: skip } },
    attributes: ["id"],
    include: {
      model: Topic,
      as: "topicFollower",
      attributes: { exclude: ["status", "createdAt", "updatedAt"] },
    },
    limit: Number(limit) ? Number(limit) : 15,
  });

  const followedTopics = followTopics.map((followTopic) => {
    return {
      id: followTopic.topicFollower.id,
      name: followTopic.topicFollower.name,
      followersCount: followTopic.topicFollower.followersCount,
      articlesCount: followTopic.topicFollower.articlesCount,
      slug: followTopic.topicFollower.slug,
    };
  });

  const newSkip =
    followTopics.length > 0 ? followTopics[followTopics.length - 1].id : null;

  res.json({ success: true, data: followedTopics, newSkip });
});

export default { followATopic, unFollowATopic, getMyFollowedTopics };
