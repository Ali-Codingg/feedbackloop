import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import * as votesController from "../controllers/votes.controller.js";
import * as statusUpdatesController from "../controllers/statusUpdates.controller.js";
import * as analyticsController from "../controllers/analytics.controller.js";
import * as requestsController from "../controllers/requests.controller.js";
import * as adminRequestsController from "../controllers/adminRequests.controller.js";

const router = Router();

// Public board
router.get("/requests", requestsController.listPublished);
router.get("/requests/:id", requestsController.getPublishedById);

// Logged-in user
router.post("/requests", requireAuth, requestsController.create);

// Voting
router.post("/requests/:id/vote", requireAuth, votesController.vote);
router.delete("/requests/:id/vote", requireAuth, votesController.unvote);
router.get("/requests/:id/vote-summary", requireAuth, votesController.summary);

// Status updates / changelog
router.get("/requests/:id/updates", statusUpdatesController.listForPublishedRequest);

router.post(
  "/admin/requests/:id/updates",
  requireAuth,
  requireRole("ADMIN"),
  statusUpdatesController.create
);

// Admin moderation
router.get("/admin/requests", requireAuth, requireRole("ADMIN"), adminRequestsController.listAll);
router.patch("/admin/requests/:id/status", requireAuth, requireRole("ADMIN"), adminRequestsController.updateStatus);
router.delete("/admin/requests/:id", requireAuth, requireRole("ADMIN"), adminRequestsController.remove);
router.get(
  "/admin/analytics",
  requireAuth,
  requireRole("ADMIN"),
  analyticsController.adminAnalytics
);
export default router;