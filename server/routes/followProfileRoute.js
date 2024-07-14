import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import followProfileController from "../controllers/followProfileController.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockedByUser from "../middlewares/checBlockedByUser.js";

const router = express.Router();

// -------------------- who to follow -------------------- //

router.get(
  "/who-to-follow",
  requiredAuth,
  fetchMe,
  followProfileController.whoToFollow
);

// -------------------- follow a profile -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  followProfileController.followAProfile
);

// -------------------- unfollow a profile -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  followProfileController.unFollowAProfile
);

// -------------------- get list of followed profiles -------------------- //

router.get(
  "/:username/following",
  optionalAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  followProfileController.getFolloweds
);

// -------------------- get list of follower profiles -------------------- //

router.get(
  "/:username/followers",
  optionalAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  followProfileController.getFollowers
);

export default router;
