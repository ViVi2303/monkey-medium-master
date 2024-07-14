import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import followTopicController from "../controllers/followTopicController.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

// -------------------- get my followed topics -------------------- //

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  followTopicController.getMyFollowedTopics
);

// -------------------- follow a topic -------------------- //

router.post("/:id", requiredAuth, fetchMe, followTopicController.followATopic);

// -------------------- unfollow a topic -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  followTopicController.unFollowATopic
);

export default router;
