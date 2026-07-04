import * as analyticsService from "../services/analytics.service.js";

export async function adminAnalytics(req, res) {
  try {
    const data = await analyticsService.getAdminAnalytics();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({
      error: String(err?.message || err),
    });
  }
}