import express from "express";
import articleController from "../controllers/articleController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import authorize from "../middlewares/authorize.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import articleSchema from "../validations/articleSchema.js";
import validator from "../middlewares/validator.js";

const router = express.Router();

// -------------------- create draft -------------------- //

router.post(
  "/draft/create-draft",
  requiredAuth,
  fetchMe,
  validator(articleSchema.createDraftSchema, "body"),
  articleController.createADraft
);

// -------------------- get my drafts -------------------- //

router.get("/draft/me", requiredAuth, fetchMe, articleController.getMyDrafts);

// -------------------- get followed profiles articles -------------------- //

router.get(
  "/following",
  requiredAuth,
  fetchMe,
  articleController.getFollowedProfilesArticles
);

// -------------------- explore new articles -------------------- //

router.get(
  "/explore-new-articles",
  requiredAuth,
  fetchMe,
  articleController.exploreNewArticles
);

// -------------------- admin pick -------------------- //

router.get("/admin-pick", requiredAuth, fetchMe, articleController.adminPick);

// -------------------- admin pick full list -------------------- //

router.get(
  "/admin-pick-full-list",
  requiredAuth,
  fetchMe,
  articleController.adminPickFullList
);

// -------------------- get all articles -------------------- //

router.get(
  "/",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.getAllArticles
);

// -------------------- get profile articles -------------------- //

router.get(
  "/:username/all",
  optionalAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  articleController.getProfileArticles
);

// -------------------- update draft -------------------- //

router.patch(
  "/draft/update-draft/:id",
  requiredAuth,
  fetchMe,
  validator(articleSchema.updateDraftSchema, "body"),
  articleController.updateADraft
);

// -------------------- delete draft -------------------- //

router.delete(
  "/draft/delete-draft/:id",
  requiredAuth,
  fetchMe,
  articleController.deleteADraft
);

// -------------------- get removed articles -------------------- //

router.get(
  "/removed-articles",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  articleController.getRemovedArticles
);

// -------------------- get an article or a draft to edit -------------------- //

router.get(
  "/get/:id",
  requiredAuth,
  fetchMe,
  articleController.getAnArticleOrADraftToEdit
);

// -------------------- create article -------------------- //

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  validator(articleSchema.createArticleSchema, "body"),
  articleController.createArticle
);

// -------------------- update article -------------------- //

router.patch(
  "/update/:id",
  requiredAuth,
  fetchMe,
  validator(articleSchema.updateArticleSchema, "body"),
  articleController.updateArticle
);

// -------------------- delete article -------------------- //

router.delete("/:id", requiredAuth, fetchMe, articleController.deleteArticle);

// -------------------- get an article -------------------- //

router.get("/:slug", optionalAuth, fetchMe, articleController.getAnArticle);

// -------------------- get followed topic articles -------------------- //

router.get(
  "/followed/topic/:slug",
  requiredAuth,
  fetchMe,
  articleController.getFollowedTopicArticles
);

// -------------------- get topic articles -------------------- //

router.get(
  "/topic/:slug",
  optionalAuth,
  fetchMe,
  articleController.getTopicArticles
);

// -------------------- set article back to draft -------------------- //

router.patch(
  "/set-article-back-to-draft/:id",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.setArticleBackToDraft
);

// -------------------- approve article -------------------- //

router.patch(
  "/approve/:id",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.approveArticle
);

// -------------------- remove article -------------------- //

router.delete(
  "/remove/:id",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.removeArticle
);

// -------------------- restore article -------------------- //

router.patch(
  "/restore/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  articleController.restoreArticle
);

// -------------------- get article detail -------------------- //

router.get(
  "/detail/:id",
  requiredAuth,
  fetchMe,
  authorize("admin", "staff"),
  articleController.getArticleDetail
);

// -------------------- get more articles from profile -------------------- //

router.get(
  "/more-articles-from-profile/:id",
  optionalAuth,
  fetchMe,
  articleController.getMoreArticleFromProifle
);

export default router;
