import express from "express";
import userController from "../controllers/userController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import fetchMe from "../middlewares/fetchMe.js";
import validator from "../middlewares/validator.js";
import userSchema from "../validations/userSchema.js";
import fetchUser from "../middlewares/fetchUser.js";

const router = express.Router();

// -------------------- change password -------------------- //

router.patch(
  "/me/change-password",
  requiredAuth,
  fetchMe,
  validator(userSchema.changePasswordSchema),
  userController.changePassword
);

// -------------------- get all users -------------------- //

router.get(
  "/",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  userController.getAllUsers
);

// -------------------- ban a user -------------------- //

router.patch(
  "/ban/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  fetchUser,
  validator(userSchema.banAUserSchema),
  userController.banAUser
);

// -------------------- unban a user -------------------- //

router.patch(
  "/unban/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  fetchUser,
  userController.unBanAUser
);

// -------------------- update user ban -------------------- //

router.patch(
  "/update-ban/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  fetchUser,
  userController.updateUserBan
);

export default router;
