import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/profile", requireAuth, getProfile);

export default router;