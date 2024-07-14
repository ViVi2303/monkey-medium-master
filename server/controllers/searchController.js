import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Profile from "../models/mysql/Profile.js";
import Topic from "../models/mysql/Topic.js";
import Article from "../models/mysql/Article.js";
import Block from "../models/mysql/Block.js";
import Mute from "../models/mysql/Mute.js";
import User from "../models/mysql/User.js";
import { Op } from "sequelize";
import addUrlToImg from "../utils/addUrlToImg.js";
import Article_Topic from "../models/mysql/Article_Topic.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";
import Reading_List from "../models/mysql/Reading_List.js";
import Role from "../models/mysql/Role.js";

// ==================== search ==================== //
const search = asyncMiddleware(async (req, res, next) => {
  const { skip = 0, limit = 15, tag, post, users } = req.query;
  const me = req.me ? req.me : null;

  let result = [];

  if (tag) {
    const topics = await Topic.findAll({
      where: {
        id: { [Op.gt]: skip },
        status: "approved",
        [Op.or]: [
          { slug: { [Op.substring]: tag } },
          { name: { [Op.substring]: tag } },
        ],
      },
      attributes: ["id", "name", "slug"],
      limit: Number(limit) ? Number(limit) : 15,
    });

    result.push(...topics);
  }

  if (post) {
    let articles;

    if (me) {
      articles = await Article.findAll({
        where: {
          id: { [Op.gt]: skip },
          status: "approved",
          [Op.or]: [
            { slug: { [Op.substring]: post } },
            { title: { [Op.substring]: post } },
          ],
          "$authorBlocked.blockedId$": null,
          "$authorBlocker.blockerId$": null,
          "$authorMuted.mutedId$": null,
        },
        attributes: {
          exclude: [
            "authorId",
            "content",
            "likesCount",
            "commentsCount",
            "approvedById",
            "status",
            "reportsCount",
            "deletedById",
            "deletedAt",
          ],
        },
        include: [
          {
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
          {
            model: Mute,
            as: "authorMuted",
            where: { muterId: me.profileInfo.id },
            attributes: [],
            required: false,
          },
          {
            model: Block,
            as: "authorBlocker",
            where: { blockedId: me.profileInfo.id },
            attributes: [],
            required: false,
          },
          {
            model: Block,
            as: "authorBlocked",
            attributes: [],
            where: { blockerId: me.profileInfo.id },
            required: false,
          },
        ],
        limit: Number(limit) ? Number(limit) : 15,
      });

      articles = await Promise.all(
        articles.map(async (article) => {
          article.banner ? addUrlToImg(article.banner) : null;
          article.author.avatar = addUrlToImg(article.author.avatar);
          const topic = await Article_Topic.findOne({
            attributes: [],
            where: { articleId: article.id },
            include: {
              model: Topic,
              as: "topic",
              attributes: ["id", "name", "slug"],
              where: { status: "approved" },
            },
            order: [["id", "ASC"]],
          });
          const isSaved = !!(await Reading_List.findOne({
            where: { profileId: me.profileInfo.id, articleId: article.id },
          }));
          if (topic) {
            return {
              ...article.toJSON(),
              topic: {
                id: topic.topic.id,
                name: topic.topic.name,
                slug: topic.topic.slug,
              },
              isSaved,
            };
          }
          return { ...article.toJSON(), topic: null, isSaved };
        })
      );
    } else {
      articles = await Article.findAll({
        where: {
          id: { [Op.gt]: skip },
          status: "approved",
          [Op.or]: [
            { slug: { [Op.substring]: post } },
            { title: { [Op.substring]: post } },
          ],
        },
        attributes: {
          exclude: [
            "authorId",
            "content",
            "likesCount",
            "commentsCount",
            "approvedById",
            "status",
            "reportsCount",
            "deletedById",
            "deletedAt",
          ],
        },
        include: [
          {
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
        ],
        limit: Number(limit) ? Number(limit) : 15,
      });

      articles = await Promise.all(
        articles.map(async (article) => {
          article.banner ? addUrlToImg(article.banner) : null;
          article.author.avatar = addUrlToImg(article.author.avatar);
          const topic = await Article_Topic.findOne({
            attributes: [],
            where: { articleId: article.id },
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
              ...article.toJSON(),
              topic: {
                id: topic.topic.id,
                name: topic.topic.name,
                slug: topic.topic.slug,
              },
            };
          }
          return { ...article.toJSON(), topic: null };
        })
      );
    }

    result.push(...articles);
  }

  if (users) {
    let profiles;

    if (!me) {
      profiles = await Profile.findAll({
        where: {
          id: { [Op.gt]: skip },
          [Op.or]: [
            {
              [Op.and]: [
                { fullname: { [Op.substring]: users } },
                { avatar: { [Op.ne]: null } },
              ],
            },
            {
              [Op.and]: [
                { "$userInfo.username$": { [Op.substring]: users } },
                { fullname: { [Op.ne]: null } },
                { avatar: { [Op.ne]: null } },
              ],
            },
          ],
        },
        attributes: ["id", "fullname", "avatar", "bio"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          where: { isVerified: true },
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
        limit: Number(limit) ? Number(limit) : 15,
      });

      profiles = profiles.map((profile) => {
        return {
          id: profile.id,
          fullname: profile.fullname,
          avatar: addUrlToImg(profile.avatar),
          bio: profile.bio,
          username: profile.userInfo.username,
          role: profile.userInfo.role.slug,
        };
      });
    } else {
      profiles = await Profile.findAll({
        where: {
          id: {
            [Op.and]: [{ [Op.gt]: skip }, { [Op.ne]: me.profileInfo.id }],
          },
          [Op.or]: [
            {
              [Op.and]: [
                { fullname: { [Op.substring]: users } },
                { avatar: { [Op.ne]: null } },
              ],
            },
            {
              [Op.and]: [
                { "$userInfo.username$": { [Op.substring]: users } },
                { fullname: { [Op.ne]: null } },
                { avatar: { [Op.ne]: null } },
              ],
            },
          ],
          "$profileBlocker.blockerId$": null,
          "$profileBlocked.blockedId$": null,
        },
        attributes: ["id", "fullname", "avatar", "bio"],
        include: [
          {
            model: Block,
            as: "profileBlocker",
            where: { blockedId: me.profileInfo.id },
            attributes: [],
            required: false,
          },
          {
            model: Block,
            as: "profileBlocked",
            attributes: [],
            where: { blockerId: me.profileInfo.id },
            required: false,
          },
          {
            model: User,
            as: "userInfo",
            attributes: ["username"],
            where: { isVerified: true },
            include: { model: Role, as: "role", attributes: ["slug"] },
          },
        ],
        limit: Number(limit) ? Number(limit) : 15,
      });

      profiles = await Promise.all(
        profiles.map(async (profile) => {
          const isFollowed = !!(await Follow_Profile.findOne({
            where: { followedId: profile.id, followerId: me.profileInfo.id },
          }));

          return {
            id: profile.id,
            fullname: profile.fullname,
            avatar: addUrlToImg(profile.avatar),
            bio: profile.bio,
            username: profile.userInfo.username,
            role: profile.userInfo.role.slug,
            isFollowed,
          };
        })
      );
    }

    result.push(...profiles);
  }

  const newSkip = result.length > 0 ? result[result.length - 1].id : null;

  res.json({ success: true, data: result, newSkip });
});

export default { search };
