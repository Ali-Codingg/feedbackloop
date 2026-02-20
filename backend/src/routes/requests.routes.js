import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

import * as requestsController from "../controllers/requests.controller.js";
import * as adminRequestsController from "../controllers/adminRequests.controller.js";

const router = Router();

// Public board
router.get("/requests", requestsController.listPublished);
router.get("/requests/:id", requestsController.getPublishedById);

// Logged-in user
router.post("/requests", requireAuth, requestsController.create);

// Admin moderation
router.get("/admin/requests", requireAuth, requireRole("ADMIN"), adminRequestsController.listAll);
router.patch("/admin/requests/:id/status", requireAuth, requireRole("ADMIN"), adminRequestsController.updateStatus);
router.delete("/admin/requests/:id", requireAuth, requireRole("ADMIN"), adminRequestsController.remove);

export default router;