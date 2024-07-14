import express from "express";
import blockController from "../controllers/blockController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import checkUserBanned from "../middlewares/checkUserBanned.js";
import fetchMe from "../middlewares/fetchMe.js";
import fetchUser from "../middlewares/fetchUser.js";
import checkBlockByUser from "../middlewares/checBlockedByUser.js";

const router = express.Router();

// -------------------- get blocked profiles -------------------- //

router.get("/me", requiredAuth, fetchMe, blockController.getBlockedProfiles);

// -------------------- block a profile -------------------- //

router.post(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  checkUserBanned,
  checkBlockByUser,
  blockController.blockAProfile
);

// -------------------- unblock a profile -------------------- //

router.delete(
  "/:id",
  requiredAuth,
  fetchMe,
  fetchUser,
  blockController.unBlockAProfile
);

export default router;
