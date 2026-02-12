import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "feedbackloop-api" });
});

router.get("/db-health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    res.status(500).json({
      ok: false,
      db: "not_connected",
      error: String(err?.message || err),
    });
  }
});

export default router;
