import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import Report_Article from "../models/mysql/Report_Article.js";
import { Op } from "sequelize";
import Role from "../models/mysql/Role.js";
import Article from "../models/mysql/Article.js";
import Profile from "../models/mysql/Profile.js";

// ==================== report an article ==================== //

const reportAnArticle = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;
  const { reason } = req.body;

  const article = await Article.findOne({
    where: { id, status: "approved" },
    attributes: ["id", "authorid"],
    include: {
      model: Profile,
      as: "author",
      include: { model: User, as: "userInfo" },
    },
  });

  if (!article) throw ErrorResponse(404, "Article not found");

  if (article.authorId === me.profileInfo.id) {
    throw ErrorResponse(400, "You can not report your own article");
  }

  if (article.author.userInfo.roleId === 3) {
    throw ErrorResponse(400, "Can't report admin article");
  }

  const reportAnArticle = await Report_Article.findOne({
    where: {
      articleId: article.id,
      userId: me.id,
      status: "pending",
    },
    attributes: ["id", "status"],
  });

  if (reportAnArticle) {
    throw ErrorResponse(
      400,
      `You have already reported this article, and the report is still pending`
    );
  }

  await Promise.all([
    Report_Article.create({
      articleId: article.id,
      userId: me.id,
      reason,
    }),
    article.increment({ reportsCount: 1 }),
  ]);

  res.status(201).json({ success: true, message: `Article has been reported` });
});

// ==================== get list of peding reported articles ==================== //

const getPendingReportedArticles = asyncMiddleware(async (req, res, next) => {
  const { skipId, skipCount, limit = 15 } = req.query;
  const me = req.me;

  let whereQuery = {};

  if (skipId && skipCount) {
    whereQuery[Op.or] = [
      { reportsCount: { [Op.lt]: skipCount } },
      { [Op.and]: [{ reportsCount: skipCount }, { id: { [Op.gt]: skipId } }] },
    ];
  }

  let reportedArticles = await Report_Article.findAll({
    where: { status: "pending" },
    attributes: ["articleId"],
    include: [
      {
        model: Article,
        as: "article",
        attributes: [
          "id",
          "title",
          "slug",
          "reportsCount",
          "rejectsCount",
          "status",
        ],
        where: { authorId: { [Op.ne]: me.profileInfo.id } },
        include: [
          {
            model: Profile,
            as: "author",
            attributes: ["id", "fullname"],
            include: {
              model: User,
              as: "userInfo",
              attributes: ["username"],
              include: {
                model: Role,
                as: "role",
                attributes: ["name", "slug"],
              },
            },
          },
          {
            model: User,
            as: "approvedBy",
            attributes: ["id", "username", "email"],
            include: {
              model: Role,
              as: "role",
              attributes: ["id", "name", "slug"],
            },
          },
        ],
        where: whereQuery,
      },
    ],
    order: [
      [{ model: Article, as: "article" }, "reportsCount", "DESC"],
      [{ model: Article, as: "article" }, "id", "DESC"],
    ],
    group: ["articleId"],
    limit: Number(limit) ? Number(limit) : 15,
  });

  reportedArticles = reportedArticles.map((report) => {
    return { ...report.article.toJSON() };
  });

  const newSkipId =
    reportedArticles.length > 0
      ? reportedArticles[reportedArticles.length - 1].id
      : null;

  const newSkipCount =
    reportedArticles.length > 0
      ? reportedArticles[reportedArticles.length - 1].reportsCount
      : null;

  res.json({ success: true, data: reportedArticles, newSkipId, newSkipCount });
});

// ==================== Get pending reports of article ==================== //

const getPendingReportsOfArticle = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;
  const { id } = req.params;

  let whereQuery = { status: "pending" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  const reports = await Report_Article.findAll({
    where: whereQuery,
    attributes: { exclude: ["articleId", "userId", "resolvedById"] },
    include: [
      { model: Article, as: "article", where: { id }, attributes: [] },
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
      {
        model: User,
        as: "resolvedBy",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = reports.length > 0 ? reports[reports.length - 1].id : null;

  res.json({ success: true, data: reports, newSkip });
});

// ==================== Mark a report of the article as resolved ==================== //

const markAReportAsResolved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const report = await Report_Article.findByPk(id);

  if (!report) throw ErrorResponse(404, "Report not found");

  await Promise.all([
    report.update({ status: "resolved", resolvedById: me.id }),
    Article.increment(
      { reportsCount: -1 },
      { where: { id: report.articleId } }
    ),
  ]);

  res.json({
    success: true,
    message: "Report marked as resolved successfully",
  });
});

// ==================== Mark all reports of the article as resolved ==================== //

const markAllResolved = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const { id } = req.params;

  const article = await Article.findByPk(id);

  if (!article) throw ErrorResponse(404, "Article not found");

  await Promise.all([
    Report_Article.update(
      { status: "resolved", resolvedById: me.id },
      { where: { status: "pending", articleId: article.id } }
    ),
    article.update({ reportsCount: 0 }, { hooks: false }),
  ]);

  res.json({
    success: true,
    message: "All reports marked as resolved successfully",
  });
});

// ==================== Get resolved reports ==================== //

const getResolvedReports = asyncMiddleware(async (req, res, next) => {
  const { skip, limit = 15 } = req.query;

  let whereQuery = { status: "resolved" };

  if (skip) whereQuery.id = { [Op.lt]: skip };

  let reports = await Report_Article.findAll({
    where: whereQuery,
    attributes: { exclude: ["articleId", "userId", "resolvedById"] },
    include: [
      {
        model: Article,
        as: "article",
        attributes: [
          "id",
          "title",
          "slug",
          "reportsCount",
          "rejectsCount",
          "status",
        ],
        include: {
          model: Profile,
          as: "author",
          attributes: ["id", "fullname"],
          include: {
            model: User,
            as: "userInfo",
            attributes: ["username"],
            include: {
              model: Role,
              as: "role",
              attributes: ["id", "name", "slug"],
            },
          },
        },
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
      {
        model: User,
        as: "resolvedBy",
        attributes: ["id", "username", "email"],
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name", "slug"],
        },
      },
    ],
    order: [["id", "DESC"]],
    limit: Number(limit) ? Number(limit) : 15,
  });

  const newSkip = reports.length > 0 ? reports[reports.length - 1].id : null;

  res.json({ success: true, data: reports, newSkip });
});

export default {
  reportAnArticle,
  getPendingReportedArticles,
  getPendingReportsOfArticle,
  getResolvedReports,
  markAReportAsResolved,
  markAllResolved,
};
