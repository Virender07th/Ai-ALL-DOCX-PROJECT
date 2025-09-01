import express from "express";
import { getUserActivity, getUserStats, recordActivity } from "../Controllers/Dashboard.js";
import authMiddleware from "../Middleware/auth.middlewares.js";

const router = express.Router();

// secure routes with auth
router.get("/activity", authMiddleware, getUserActivity);
router.get("/stats", authMiddleware, getUserStats);
router.post("/activity", authMiddleware, recordActivity);

export default router;
