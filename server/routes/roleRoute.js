import express from "express";
import requiredAuth from "../middlewares/requiredAuth.js";
import roleController from "../controllers/roleController.js";
import fetchMe from "../middlewares/fetchMe.js";
import fetchUser from "../middlewares/fetchUser.js";
import authorize from "../middlewares/authorize.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";

const router = express.Router();

// -------------------- get all staffs -------------------- //

router.get(
  "/staffs",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  roleController.getAllStaffs
);

// -------------------- make user staff -------------------- //

router.patch(
  "/make-staff/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  fetchUser,
  checkUserBanned,
  roleController.makeUserStaff
);

// -------------------- make user user -------------------- //

router.patch(
  "/make-user/:id",
  requiredAuth,
  fetchMe,
  authorize("admin"),
  fetchUser,
  checkUserBanned,
  roleController.makeUserUser
);

export default router;
