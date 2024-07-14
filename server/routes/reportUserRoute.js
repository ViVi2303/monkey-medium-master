import express from "express";
import reportUserController from "../controllers/reportUserController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import authorize from "../middlewares/authorize.js";
import fetchMe from "../middlewares/fetchMe.js";
import reportProfileSchema from "../validations/reportProfileSchema.js";
import validator from "../middlewares/validator.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";

const router = express.Router();

// -------------------- get pending reported users -------------------- //

router.get(
  "/user/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.getPendingReportedUsers
);

// -------------------- get pending reported staffs -------------------- //

router.get(
  "/staff/pending",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  reportUserController.getPendingReportedStaffs
);

// -------------------- get resolved reports -------------------- //

router.get(
  "/resolved",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  reportUserController.getResolvedReports
);

// -------------------- report a user -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("user"),
  fetchUser,
  checkUserBanned,
  validator(reportProfileSchema.reportAProfileSchema),
  reportUserController.reportAUser
);

// -------------------- get pending reports of user -------------------- //

router.get(
  "/:id/pending",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.getPendingReportsOfUser
);

// -------------------- mark all resolved -------------------- //

router.patch(
  "/:id",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  fetchUser,
  reportUserController.markAllResolved
);

// -------------------- mark a report as resolved -------------------- //

router.patch(
  "/report/:id/resolve",
  requiredAuth,
  fetchMe,
  authorize("staff", "admin"),
  reportUserController.markAReportAsResolved
);

export default router;
