import express from "express";
import optionalAuth from "../middlewares/optionalAuth.js";
import profileController from "../controllers/profileController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import validator from "../middlewares/validator.js";
import profileSchema from "../validations/profileSchema.js";
import fetchMe from "../middlewares/fetchMe.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockedByUser from "../middlewares/checBlockedByUser.js";
import mongoUpload from "../middlewares/mongoUpload.js";
import checkAvatar from "../middlewares/checkAvatar.js";

const router = express.Router();

// -------------------- get login profile information -------------------- //

router.get(
  "/logged-in-profile-information",
  requiredAuth,
  fetchMe,
  profileController.getLoggedInProfile
);

// -------------------- setup profile -------------------- //

router.post(
  "/setup-profile",
  requiredAuth,
  mongoUpload.single("avatar"),
  checkAvatar,
  validator(profileSchema.setupProfileSchema),
  profileController.setupProfile
);

// -------------------- update profile -------------------- //

router.patch(
  "/me/update",
  requiredAuth,
  fetchMe,
  mongoUpload.single("avatar"),
  checkAvatar,
  validator(profileSchema.updateProfileSchema, "body"),
  profileController.updateMyProfile
);

// -------------------- get profile -------------------- //

router.get(
  "/:username",
  optionalAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockedByUser,
  profileController.getProfile
);

export default router;
