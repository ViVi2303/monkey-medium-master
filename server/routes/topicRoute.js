import express from "express";
import topicController from "../controllers/topicController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import authorize from "../middlewares/authorize.js";
import validator from "../middlewares/validator.js";
import topicSchema from "../validations/topicSchema.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

// -------------------- create topic -------------------- //

router.post(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  validator(topicSchema.createTopicSchema, "body"),
  topicController.createTopic
);

// -------------------- get all topics -------------------- //

router.get(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  topicController.getAllTopics
);

// -------------------- search for topics during create article -------------------- //

router.get(
  "/create-article",
  requiredAuth,
  fetchMe,
  topicController.searchTopicsCreateArticle
);

// -------------------- explore topics -------------------- //

router.get("/explore-topics", topicController.exploreAllTopics);

// -------------------- recommended topics -------------------- //

router.get(
  "/recommended-topics",
  requiredAuth,
  fetchMe,
  topicController.recommendedTopics
);

// -------------------- update topic -------------------- //

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  validator(topicSchema.updateTopicSchema, "body"),
  topicController.updateTopic
);

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  topicController.deleteTopic
);

// -------------------- mark topic as approved -------------------- //

router.patch(
  "/:id/approve",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  topicController.martTopicAsApproved
);

// -------------------- mark topic as rejected -------------------- //

router.patch(
  "/:id/reject",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  topicController.martTopicAsRejected
);

// -------------------- get a topic -------------------- //

router.get("/:slug", optionalAuth, fetchMe, topicController.getATopic);

export default router;
