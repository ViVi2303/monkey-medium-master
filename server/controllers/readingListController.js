import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Article from "../models/mysql/Article.js";
import Reading_List from "../models/mysql/Reading_List.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Profile from "../models/mysql/Profile.js";
import Topic from "../models/mysql/Topic.js";
import User from "../models/mysql/User.js";
import Article_Topic from "../models/mysql/Article_Topic.js";
import Role from "../models/mysql/Role.js";

// ==================== add an article to reading list ==================== //

const addToReadingList = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findByPk(id);

  if (!article) throw ErrorResponse(404, "Article not found");

  if (article.authorId === me.profileInfo.id) {
    throw ErrorResponse(400, "Cannot add you own article");
  }

  const readingList = await Reading_List.findOne({
    where: { articleId: article.id, profileId: me.profileInfo.id },
  });

  if (!readingList) {
    await Reading_List.create({
      articleId: article.id,
      profileId: me.profileInfo.id,
    });
  }

  res.json({
    success: true,
    message: "Article added to your reading list successfully",
  });
});

// ==================== remove an article from reading list ==================== //

const removeFromReadingList = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  await Reading_List.destroy({
    where: { articleId: id, profileId: me.profileInfo.id },
  });

  res.json({
    success: true,
    message: "Article removed from reading list successfully",
  });
});

// ==================== get my reading list ==================== //

const getMyReadingList = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { profileId: me.profileInfo.id };

  if (skip) whereQuery.updatedAt = { [Op.lt]: skip };

  const readingList = await Reading_List.findAll({
    where: whereQuery,
    attributes: ["id"],
    include: {
      model: Article,
      as: "readArticle",
      attributes: {
        exclude: [
          "authorId",
          "content",
          "likesCount",
          "commentsCount",
          "approvedById",
          "status",
          "reportsCount",
        ],
      },
      include: {
        model: Profile,
        as: "author",
        attributes: ["id", "fullname", "avatar"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
    },
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const articles = await Promise.all(
    readingList.map(async (readingList) => {
      const article = {
        id: readingList.readArticle.id,
        banner: readingList.readArticle.banner
          ? addUrlToImg(readingList.readArticle.banner)
          : null,
        title: readingList.readArticle.title,
        preview: readingList.readArticle.preview,
        slug: readingList.readArticle.slug,
        author: {
          id: readingList.readArticle.author.id,
          fullname: readingList.readArticle.author.fullname,
          avatar: addUrlToImg(readingList.readArticle.author.avatar),
          userInfo: readingList.readArticle.author.userInfo,
        },
        createdAt: readingList.readArticle.createdAt,
        updatedAt: readingList.readArticle.createdAt,
      };
      const topic = await Article_Topic.findOne({
        attributes: [],
        where: { articleId: readingList.readArticle.id },
        include: {
          model: Topic,
          as: "topic",
          attributes: ["id", "name", "slug"],
          where: { status: "approved" },
        },
        order: [["id", "ASC"]],
      });
      if (topic) {
        return {
          ...article,
          topic: {
            id: topic.topic.id,
            name: topic.topic.name,
            slug: topic.topic.slug,
          },
        };
      }
      return { ...article, topic: null };
    })
  );

  const newSkip =
    readingList.length > 0 ? readingList[readingList.length - 1].id : null;

  res.json({ success: true, data: articles, newSkip });
});

// ==================== get my recently saved ==================== //

const getMyRecentlySaved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  const readingList = await Reading_List.findAll({
    where: { profileId: me.profileInfo.id },
    attributes: ["id"],
    include: {
      model: Article,
      as: "readArticle",
      attributes: ["id", "title", "slug", "createdAt", "updatedAt"],
      include: {
        model: Profile,
        as: "author",
        attributes: ["id", "fullname", "avatar"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
    },
    order: [["id", "DESC"]],
    limit: 4,
  });

  const articles = await Promise.all(
    readingList.map(async (readingList) => {
      return {
        id: readingList.readArticle.id,
        title: readingList.readArticle.title,
        slug: readingList.readArticle.slug,
        author: {
          id: readingList.readArticle.author.id,
          fullname: readingList.readArticle.author.fullname,
          avatar: addUrlToImg(readingList.readArticle.author.avatar),
          userInfo: readingList.readArticle.author.userInfo,
        },
        createdAt: readingList.readArticle.createdAt,
        updatedAt: readingList.readArticle.createdAt,
      };
    })
  );

  res.json({ success: true, data: articles });
});

export default {
  addToReadingList,
  removeFromReadingList,
  getMyReadingList,
  getMyRecentlySaved,
};
