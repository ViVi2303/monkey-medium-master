import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import readingListController from "../controllers/readingListController.js";

const router = express.Router();

// -------------------- get my reading list -------------------- //

router.get(
  "/me",
  requiredAuth,
  fetchMe,
  readingListController.getMyReadingList
);

// -------------------- get my recently saved -------------------- //

router.get(
  "/me/recently-saved",
  requiredAuth,
  fetchMe,
  readingListController.getMyRecentlySaved
);

// -------------------- add an article to reading list -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  readingListController.addToReadingList
);

// -------------------- remove an article from reading list -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  readingListController.removeFromReadingList
);

export default router;
