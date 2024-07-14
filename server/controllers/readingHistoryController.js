import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Article from "../models/mysql/Article.js";
import Reading_History from "../models/mysql/Reading_History.js";
import addUrlToImg from "../utils/addUrlToImg.js";

// ==================== delete an article in reading history ==================== //

const deleteAnArticleInHistory = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  await Reading_History.destroy({
    where: { articleId: id, profileId: me.profileInfo.id },
  });

  res.json({
    success: true,
    message: "Article deleted successfully from reading history.",
  });
});

// ==================== clear my history reading ==================== //

const clearMyReadingHistory = asyncMiddleware(async (req, res, next) => {
  const me = req.me;

  await Reading_History.destroy({ where: { profileId: me.profileInfo.id } });

  res.json({
    success: true,
    message: "Reading history cleared successfully.",
  });
});

// ==================== get history reading ==================== //

const getMyReadingHistory = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { skip, limit = 15 } = req.query;

  let whereQuery = { profileId: me.profileInfo.id };

  if (skip) whereQuery.updatedAt = { [Op.lt]: skip };

  const readingHistory = await Reading_History.findAll({
    where: whereQuery,
    attributes: ["id", "updatedAt"],
    include: {
      model: Article,
      as: "readArticle",
      attributes: [
        "id",
        "banner",
        "title",
        "preview",
        "slug",
        "createdAt",
        "updatedAt",
      ],
    },
    order: [["updatedAt", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const articles = readingHistory.map((readingHistory) => {
    return {
      id: readingHistory.readArticle.id,
      banner: readingHistory.readArticle.banner
        ? addUrlToImg(readingHistory.readArticle.banner)
        : null,
      title: readingHistory.readArticle.title,
      preview: readingHistory.readArticle.preview,
      slug: readingHistory.readArticle.slug,
      createdAt: readingHistory.readArticle.createdAt,
      updatedAt: readingHistory.readArticle.updatedAt,
    };
  });

  const newSkip =
    readingHistory.length > 0
      ? readingHistory[readingHistory.length - 1].updatedAt
      : null;

  res.json({ success: true, data: articles, newSkip });
});

export default {
  deleteAnArticleInHistory,
  clearMyReadingHistory,
  getMyReadingHistory,
};
