import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { prisma } from "../config/prisma.js";

const router = Router();

// Logged-in user info
router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  res.json({ user });
});

// Admin-only test
router.get("/admin/ping", requireAuth, requireRole("ADMIN"), (req, res) => {
  res.json({ ok: true, message: "admin access confirmed" });
});

export default router;
