import express from "express";
import passport from "passport";
import requiredAuth from "../middlewares/requiredAuth.js";
import authController from "../controllers/authController.js";
import validator from "../middlewares/validator.js";
import authSchema from "../validations/authSchema.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// -------------------- login with google -------------------- //

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.loginGoogle
);

// -------------------- register -------------------- //

router.post(
  "/register",
  validator(authSchema.registerSchema),
  authController.register
);

// -------------------- verify email -------------------- //

router.patch(
  "/verify-email",
  validator(authSchema.verifyTokenSchema),
  authController.verifyEmail
);

// -------------------- verify setup password -------------------- //

router.patch(
  "/verify-setup-password",
  validator(authSchema.verifyTokenSchema),
  authController.verifySetUpPassword
);

// -------------------- forgot password -------------------- //

router.post(
  "/forgot-password",
  validator(authSchema.forgotPasswordSchema),
  authController.forgotPassword
);

// -------------------- reset password -------------------- //

router.patch(
  "/reset-password/:token",
  validator(authSchema.resetPasswordSchema),
  authController.resetPassword
);

// -------------------- login with email and password -------------------- //

router.post(
  "/login-email",
  validator(authSchema.loginSchema),
  authController.loginEmail
);

// -------------------- logout -------------------- //

router.delete("/logout", requiredAuth, authController.logout);

export default router;
