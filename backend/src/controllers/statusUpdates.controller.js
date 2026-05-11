import * as statusUpdatesService from "../services/statusUpdates.service.js";

export async function create(req, res) {
  try {
    const result = await statusUpdatesService.createStatusUpdate({
      requestId: req.params.id,
      adminUserId: req.user.id,
      message: req.body.message,
    });

    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: String(err?.message || err) });
  }
}

export async function listForPublishedRequest(req, res) {
  try {
    const result = await statusUpdatesService.listStatusUpdatesForPublishedRequest(
      req.params.id
    );

    if (!result) {
      return res.status(404).json({ error: "Request not found" });
    }

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: String(err?.message || err) });
  }
}