import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import readingHistoryController from "../controllers/readingHistoryController.js";

const router = express.Router();

// -------------------- delete article from reading history -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  readingHistoryController.deleteAnArticleInHistory
);

// -------------------- clear my reading history -------------------- //

router.delete(
  "/me/clear",
  requiredAuth,
  fetchMe,
  readingHistoryController.clearMyReadingHistory
);

// -------------------- get my reading history -------------------- //

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  readingHistoryController.getMyReadingHistory
);

export default router;
