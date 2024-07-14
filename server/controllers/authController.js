import ErrorResponse from "../responses/ErrorResponse.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import User from "../models/mysql/User.js";
import hashPassword from "../utils/hashPassword.js";
import emailService from "../services/nodeMailer.js";
import randomBytes from "../utils/randomBytes.js";
import env from "../config/env.js";
import VerifyToken from "../models/mongodb/VerifyToken.js";
import SetupPasswordToken from "../models/mongodb/SetupPasswordToken.js";
import Profile from "../models/mysql/Profile.js";
import bcrypt from "bcryptjs";
import generateJwt from "../utils/generateJwt.js";
import JsonWebToken from "../models/mongodb/JsonWebToken.js";
import generateUserName from "../utils/generateUserName.js";

// ==================== register ==================== //

const register = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ where: { email } });

  if (user && user.password) throw ErrorResponse(409, "Email already exists");

  const token = randomBytes(32);

  const hashedPassword = hashPassword(password);

  if (user && user.email.includes("@gmail.com") && !user.password) {
    const link = `${env.CLIENT_HOST}:${env.CLIENT_PORT}/verify-setup-password?token=${token}`;

    const setupToken = await SetupPasswordToken.findOne({ email });

    const operation = setupToken
      ? setupToken.updateOne({ token })
      : SetupPasswordToken.create({ email, token, password: hashedPassword });

    await Promise.all([
      operation,
      emailService({
        to: email,
        subject: "Setup password",
        html: `<h3>Click <a href="${link}">here</a> to verify your password setup request.</h3>`,
      }),
    ]);

    return res.json({
      success: true,
      message: "Please check your email to verify your password setup request",
    });
  }

  const link = `${env.CLIENT_HOST}:${env.CLIENT_PORT}/verify-email?token=${token}`;

  user = await User.create({
    username: generateUserName(email),
    email,
    password: hashedPassword,
  });

  await Promise.all([
    emailService({
      to: email,
      subject: "Verify email",
      html: `<h3>Click <a href="${link}">here</a> to verify your email.</h3>`,
    }),
    Profile.create({ userId: user.id }),
    VerifyToken.create({ email, token }),
  ]);

  res.status(201).json({
    success: true,
    message: "Check your email to verify your account",
  });
});

// ==================== forgot password ==================== //

const forgotPassword = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) throw ErrorResponse(404, "User not found");

  const token = randomBytes(32);

  const verifyToken = await VerifyToken.findOne({ email });

  const operation = verifyToken
    ? verifyToken.updateOne({ token })
    : VerifyToken.create({ email, token });

  const link = `${env.CLIENT_HOST}:${env.CLIENT_PORT}/verify-forgot-password?token=${token}`;

  await Promise.all([
    emailService({
      to: email,
      subject: "Forgot password",
      html: `<h3>Click <a href="${link}">here</a> to reset your password.</h3>`,
    }),
    operation,
  ]);

  res.json({
    success: true,
    message: "Check your email to reset your password",
  });
});

// ==================== verify email ==================== //

const verifyEmail = asyncMiddleware(async (req, res, next) => {
  const { token } = req.body;

  const tokenToVerify = await VerifyToken.findOne({ token });

  if (!tokenToVerify) throw ErrorResponse(404, "Invalid or expired link");

  await Promise.all([
    tokenToVerify.deleteOne(),
    User.update(
      { isVerified: true },
      { where: { email: tokenToVerify.email } }
    ),
  ]);

  res.json({ success: true, message: "Email verified successfully" });
});

// ==================== verify setup password ==================== //

const verifySetUpPassword = asyncMiddleware(async (req, res, next) => {
  const { token } = req.body;

  const tokenToVerify = await SetupPasswordToken.findOne({ token });

  if (!tokenToVerify) throw ErrorResponse(404, "Invalid or expired link");

  await Promise.all([
    User.update(
      { password: tokenToVerify.password },
      { where: { email: tokenToVerify.email } }
    ),
    tokenToVerify.deleteOne(),
  ]);

  res.json({ success: true, message: "Setup password successfully" });
});

// ==================== reset password ==================== //

const resetPassword = asyncMiddleware(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  const tokenToVerify = await VerifyToken.findOne({ token });

  if (!tokenToVerify) throw ErrorResponse(404, "Invalid or expired link");

  if (newPassword !== confirmPassword) {
    throw ErrorResponse(400, "Confirm password do not match");
  }

  const hashedPassword = hashPassword(newPassword);

  await Promise.all([
    User.update(
      { password: hashedPassword },
      { where: { email: tokenToVerify.email } }
    ),
    tokenToVerify.deleteOne(),
  ]);

  res.json({ success: true, message: "Password reset successfully" });
});

// ==================== login with email and password ==================== //

const loginEmail = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
    include: { model: Profile, as: "profileInfo" },
  });

  if (!user || !user.password) {
    throw ErrorResponse(401, "Email or password is wrong");
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) throw ErrorResponse(401, "Email or password is wrong");

  if (!user.isVerified) {
    const token = randomBytes(32);

    const link = `${env.CLIENT_HOST}:${env.CLIENT_PORT}/verify-email?token=${token}`;

    const verifyToken = await VerifyToken.findOne({ email });

    const operation = verifyToken
      ? verifyToken.updateOne({ token })
      : VerifyToken.create({ email, token });

    await Promise.all([
      operation,
      emailService({
        to: email,
        subject: "Verify email",
        html: `<h3>Click <a href="${link}">here</a> to verify your email</h3>`,
      }),
    ]);

    return res.json({
      success: true,
      message: "Check your email to verify your account",
    });
  }

  const jsonWebToken = await generateJwt({ id: user.id });

  res.json({
    success: true,
    hasProfile: Boolean(user.profileInfo.fullname && user.profileInfo.avatar),
    token: jsonWebToken,
  });
});

// ==================== login with google ==================== //

const loginGoogle = asyncMiddleware(async (req, res, next) => {
  const { avatar, fullname, email } = req.user;

  let user = await User.findOne({
    where: { email },
    include: {
      model: Profile,
      as: "profileInfo",
    },
  });

  let operation;

  if (!user) {
    const username = generateUserName(email);
    user = await User.create({ email, username, isVerified: true });
  }

  if (!user.isVerified) {
    operation = user.update({ isVerified: true });
  }

  if (!user.profileInfo) {
    operation = Profile.create({ avatar, fullname, userId: user.id });
  }

  if (
    user.profileInfo &&
    (!user.profileInfo.avatar || !user.profileInfo.fullname)
  ) {
    operation = user.profileInfo.update({ avatar, fullname, userId: user.id });
  }

  await operation;

  const jsonWebToken = await generateJwt({ id: user.id });

  res.redirect(`${env.CLIENT_HOST}:${env.CLIENT_PORT}?token=${jsonWebToken}`);
});

// ==================== logout ==================== //

const logout = asyncMiddleware(async (req, res, next) => {
  const { id: myUserId, iat, exp } = req.jwtPayLoad;

  await JsonWebToken.deleteOne({ userId: myUserId, iat, exp });

  res.json({ success: true, message: "Successfully logout" });
});

export default {
  register,
  forgotPassword,
  verifyEmail,
  verifySetUpPassword,
  resetPassword,
  loginGoogle,
  loginEmail,
  logout,
};
