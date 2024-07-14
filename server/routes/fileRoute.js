import express from "express";
import fileController from "../controllers/fileController.js";
import requiredAuth from "../middlewares/requiredAuth.js";
import fetchMe from "../middlewares/fetchMe.js";
import mongoUpload from "../middlewares/mongoUpload.js";
import checkFileLimit from "../middlewares/checkFileLimit.js";
import env from "../config/env.js";

const router = express.Router();

// -------------------- upload an image -------------------- //

router.post(
  "/img",
  mongoUpload.single("img"),
  checkFileLimit(env.IMAGE_FILE_SIZE_LIMIT),
  fileController.upLoadAnImg
);

// -------------------- upload an avatar -------------------- //

router.post(
  "/avatar",
  mongoUpload.single("avatar"),
  checkFileLimit(env.AVATAR_FILE_SIZE_LIMIT),
  fileController.upLoadAnAvatar
);

// -------------------- get an image -------------------- //

router.get("/:filename", fileController.getAnImg);

// -------------------- delete an image -------------------- //

router.delete("/:filename", requiredAuth, fetchMe, fileController.deleteAnImg);

export default router;
