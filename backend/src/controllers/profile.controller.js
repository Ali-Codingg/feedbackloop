import * as profileService from "../services/profile.service.js";

export async function getProfile(req, res) {
  try {
    const data = await profileService.getUserProfile(req.user.id);
    return res.json(data);
  } catch (err) {
    return res.status(400).json({
      error: String(err?.message || err),
    });
  }
}