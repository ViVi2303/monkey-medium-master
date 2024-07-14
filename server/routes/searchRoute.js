import express from "express";
import searchController from "../controllers/searchController.js";
import optinalAuth from "../middlewares/optionalAuth.js";
import fetchMe from "../middlewares/fetchMe.js";

const router = express.Router();

// -------------------- search -------------------- //

router.get("/", optinalAuth, fetchMe, searchController.search);

export default router;
