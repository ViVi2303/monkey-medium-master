import { Op } from "sequelize";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import Follow_Profile from "../models/mysql/Follow_Profile.js";
import Profile from "../models/mysql/Profile.js";
import User from "../models/mysql/User.js";
import ErrorResponse from "../responses/ErrorResponse.js";
import addUrlToImg from "../utils/addUrlToImg.js";
import Block from "../models/mysql/Block.js";
import Role from "../models/mysql/Role.js";
import sequelize from "../databases/mysql/connect.js";

// ==================== follow a profile ==================== //

const followAProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Cannot follow yourself");
  }

  const followProfile = await Follow_Profile.findOne({
    where: { followedId: user.profileInfo.id, followerId: me.profileInfo.id },
  });

  if (!followProfile) {
    await Follow_Profile.create(
      {
        followedId: user.profileInfo.id,
        followerId: me.profileInfo.id,
      },
      { me: me, user: user }
    );
  }

  res.status(201).json({
    success: true,
    message: `Successfully followed ${user.profileInfo.fullname}.`,
  });
});

// ==================== unfollow a profile ==================== //

const unFollowAProfile = asyncMiddleware(async (req, res, next) => {
  const me = req.me;
  const user = req.user;

  if (user.profileInfo.id === me.profileInfo.id) {
    throw ErrorResponse(400, "Bad Request: Cannot unfollow yourself");
  }

  const followProfile = await Follow_Profile.findOne({
    where: { followedId: user.profileInfo.id, followerId: me.profileInfo.id },
  });

  if (followProfile) {
    await followProfile.destroy({ me: me, user: user });
  }

  res.json({
    success: true,
    message: `Successfully unfollowed ${user.profileInfo.fullname}.`,
  });
});

// ==================== get list of followed profiles ==================== //

const getFolloweds = asyncMiddleware(async (req, res, next) => {
  const me = req.me ? req.me : null;
  const user = req.user;
  const { skip = 0, limit = 15 } = req.query;

  let followProfiles;

  let followeds;

  if (!me) {
    followProfiles = await Follow_Profile.findAll({
      where: { followerId: user.profileInfo.id, id: { [Op.gt]: skip } },
      attributes: ["id"],
      include: {
        model: Profile,
        as: "followed",
        attributes: ["id", "fullname", "avatar", "bio"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
      limit: Number(limit) ? Number(limit) : null,
    });
    followeds = followProfiles.map((followProfile) => {
      return {
        id: followProfile.followed.id,
        fullname: followProfile.followed.fullname,
        avatar: addUrlToImg(followProfile.followed.avatar),
        bio: followProfile.followed.bio,
        username: followProfile.followed.userInfo.username,
        role: followProfile.followed.userInfo.role.slug,
      };
    });
  }

  if (me && me.profileInfo.id === user.profileInfo.id) {
    followProfiles = await Follow_Profile.findAll({
      where: { followerId: user.profileInfo.id, id: { [Op.gt]: skip } },
      attributes: ["id"],
      include: {
        model: Profile,
        as: "followed",
        attributes: ["id", "fullname", "avatar", "bio"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },

      limit: Number(limit) ? Number(limit) : null,
    });
    followeds = followProfiles.map((followProfile) => {
      return {
        id: followProfile.followed.id,
        fullname: followProfile.followed.fullname,
        avatar: addUrlToImg(followProfile.followed.avatar),
        bio: followProfile.followed.bio,
        username: followProfile.followed.userInfo.username,
        role: followProfile.followed.userInfo.role.slug,
        isFollowed: true,
      };
    });
  }

  if (me && me.profileInfo.id !== user.profileInfo.id) {
    followProfiles = await Follow_Profile.findAll({
      where: {
        followerId: user.profileInfo.id,
        id: { [Op.gt]: skip },
        "$followedBlocker.blockerId$": null,
        "$followedBlocked.blockedId$": null,
      },
      attributes: ["id"],
      include: [
        {
          model: Profile,
          as: "followed",
          attributes: ["id", "fullname", "avatar", "bio"],
          include: {
            model: User,
            as: "userInfo",
            attributes: ["username"],
            include: { model: Role, as: "role", attributes: ["slug"] },
          },
          where: { id: { [Op.ne]: me.profileInfo.id } },
        },
        {
          model: Block,
          as: "followedBlocker",
          where: { blockedId: me.profileInfo.id },
          attributes: [],
          required: false,
        },
        {
          model: Block,
          as: "followedBlocked",
          attributes: [],
          where: { blockerId: me.profileInfo.id },
          required: false,
        },
      ],
      limit: Number(limit) ? Number(limit) : null,
    });
    followeds = await Promise.all(
      followProfiles.map(async (followProfile) => {
        return {
          id: followProfile.followed.id,
          fullname: followProfile.followed.fullname,
          avatar: addUrlToImg(followProfile.followed.avatar),
          bio: followProfile.followed.bio,
          username: followProfile.followed.userInfo.username,
          role: followProfile.followed.userInfo.role.slug,
          isFollowed: !!(await Follow_Profile.findOne({
            where: {
              followedId: followProfile.followed.id,
              followerId: me.profileInfo.id,
            },
          })),
        };
      })
    );
  }

  const newSkip =
    followProfiles.length > 0
      ? followProfiles[followProfiles.length - 1].id
      : null;

  res.json({ success: true, data: followeds, newSkip });
});

// ==================== get list of follower profiles ==================== //

const getFollowers = asyncMiddleware(async (req, res, next) => {
  const me = req.me ? req.me : null;
  const user = req.user;
  const { skip = 0, limit = 15 } = req.query;

  let followerProfiles;

  let followers;

  if (!me) {
    followerProfiles = await Follow_Profile.findAll({
      where: { followedId: user.profileInfo.id, id: { [Op.gt]: skip } },
      attributes: ["id"],
      include: {
        model: Profile,
        as: "follower",
        attributes: ["id", "fullname", "avatar", "bio"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
      limit: Number(limit) ? Number(limit) : null,
    });
    followers = followerProfiles.map((followerProfile) => {
      return {
        id: followerProfile.follower.id,
        fullname: followerProfile.follower.fullname,
        avatar: addUrlToImg(followerProfile.follower.avatar),
        bio: followerProfile.follower.bio,
        username: followerProfile.follower.userInfo.username,
        role: followerProfile.follower.userInfo.role.slug,
      };
    });
  }

  if (me && me.profileInfo.id === user.profileInfo.id) {
    followerProfiles = await Follow_Profile.findAll({
      where: { followedId: user.profileInfo.id, id: { [Op.gt]: skip } },
      attributes: ["id"],
      include: {
        model: Profile,
        as: "follower",
        attributes: ["id", "fullname", "avatar", "bio"],
        include: {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      },
      limit: Number(limit) ? Number(limit) : null,
    });
    followers = await Promise.all(
      followerProfiles.map(async (followerProfile) => {
        return {
          id: followerProfile.follower.id,
          fullname: followerProfile.follower.fullname,
          avatar: addUrlToImg(followerProfile.follower.avatar),
          bio: followerProfile.follower.bio,
          username: followerProfile.follower.userInfo.username,
          role: followerProfile.follower.userInfo.role.slug,
          isFollowed: !!(await Follow_Profile.findOne({
            where: {
              followedId: followerProfile.follower.id,
              followerId: me.profileInfo.id,
            },
          })),
        };
      })
    );
  }

  if (me && me.profileInfo.id !== user.profileInfo.id) {
    followerProfiles = await Follow_Profile.findAll({
      where: {
        followedId: user.profileInfo.id,
        id: { [Op.gt]: skip },
        "$followerBlocker.blockerId$": null,
        "$followerBlocked.blockedId$": null,
      },
      attributes: ["id"],
      include: [
        {
          model: Profile,
          as: "follower",
          attributes: ["id", "fullname", "avatar", "bio"],
          include: {
            model: User,
            as: "userInfo",
            attributes: ["username"],
            include: { model: Role, as: "role", attributes: ["slug"] },
          },
          where: { id: { [Op.ne]: me.profileInfo.id } },
        },
        {
          model: Block,
          as: "followerBlocker",
          where: { blockedId: me.profileInfo.id },
          attributes: [],
          required: false,
        },
        {
          model: Block,
          as: "followerBlocked",
          attributes: [],
          where: { blockerId: me.profileInfo.id },
          required: false,
        },
      ],
      limit: Number(limit) ? Number(limit) : null,
    });
    followers = await Promise.all(
      followerProfiles.map(async (followerProfile) => {
        return {
          id: followerProfile.follower.id,
          fullname: followerProfile.follower.fullname,
          avatar: addUrlToImg(followerProfile.follower.avatar),
          bio: followerProfile.follower.bio,
          username: followerProfile.follower.userInfo.username,
          role: followerProfile.follower.userInfo.role.slug,
          isFollowed: !!(await Follow_Profile.findOne({
            where: {
              followedId: followerProfile.follower.id,
              followerId: me.profileInfo.id,
            },
          })),
        };
      })
    );
  }

  const newSkip =
    followerProfiles.length > 0
      ? followerProfiles[followerProfiles.length - 1].id
      : null;

  res.json({ success: true, data: followers, newSkip });
});

// ==================== who to follow ==================== //

const whoToFollow = asyncMiddleware(async (req, res, next) => {
  const { max = 5 } = req.query;
  const me = req.me;

  let whoToFollow = await sequelize.query(
    `
    SELECT p.id, p.avatar, p.fullname, u.username, r.slug AS role
    FROM articles a
    JOIN profiles p ON a.authorId = p.id and p.avatar is not null and p.fullname is not null
    JOIN users u ON p.userId = u.id and u.isVerified = true and u.status = "normal"
    JOIN roles r ON u.roleId = r.id
    LEFT JOIN reading_historys rh ON rh.articleId = a.id AND rh.profileId = ${me.profileInfo.id}
    LEFT JOIN reading_lists rl ON rl.articleId = a.id AND rl.profileId = ${me.profileInfo.id}
    LEFT JOIN likes l ON l.articleId = a.id AND l.profileId = ${me.profileInfo.id}
    LEFT JOIN articles_topics at ON a.id = at.articleId
    LEFT JOIN topics t ON at.topicId = t.id
    LEFT JOIN follow_topics ft ON ft.topicId = t.id AND ft.profileId = ${me.profileInfo.id}
    where (
	    rh.profileId is not null
	    or rl.profileId is not null
	    or l.profileId is not null
	    or ft.profileId is not null 
    )
    AND p.id NOT IN (
	    SELECT followedId
	    FROM follow_profiles
	    WHERE followerId = ${me.profileInfo.id}
    )
    GROUP BY p.id, p.avatar, p.fullname, u.username, r.slug
    ORDER BY COUNT(DISTINCT a.id) DESC
    limit ${max}
    `,
    { type: sequelize.QueryTypes.SELECT }
  );

  if (whoToFollow.length < max) {
    const whoToFollowIds = whoToFollow.map((whoToFollow) => whoToFollow.id);

    let random = await Profile.findAll({
      where: {
        id: {
          [Op.and]: [
            { [Op.notIn]: whoToFollowIds },
            { [Op.ne]: me.profileInfo.id },
          ],
        },
        avatar: { [Op.ne]: null },
        fullname: { [Op.ne]: null },
        "$blocksBlockedBy.blockerId$": null,
        "$blocksBlocked.blockedId$": null,
        "$followeds.followedId$": null,
      },
      attributes: ["id", "fullname", "avatar"],
      include: [
        {
          model: Block,
          as: "blocksBlockedBy",
          where: { blockedId: me.profileInfo.id },
          attributes: [],
          required: false,
        },
        {
          model: Block,
          as: "blocksBlocked",
          attributes: [],
          where: { blockerId: me.profileInfo.id },
          required: false,
        },
        {
          model: Follow_Profile,
          as: "followeds",
          where: { followerId: me.profileInfo.id },
          attributes: [],
          required: false,
        },
        {
          model: User,
          as: "userInfo",
          attributes: ["username"],
          where: { status: "normal", isVerified: true },
          include: { model: Role, as: "role", attributes: ["slug"] },
        },
      ],
      order: sequelize.literal("RAND()"),
      limit: max - whoToFollow.length,
    });

    random = random.map((random) => {
      return {
        id: random.id,
        fullname: random.fullname,
        avatar: random.avatar,
        username: random.userInfo.username,
        role: random.userInfo.role.slug,
      };
    });

    whoToFollow.push(...random);
  }

  whoToFollow.forEach((whoToFollow) => addUrlToImg(whoToFollow.avatar));

  res.json({ success: true, data: whoToFollow });
});

export default {
  followAProfile,
  unFollowAProfile,
  getFolloweds,
  getFollowers,
  whoToFollow,
};
