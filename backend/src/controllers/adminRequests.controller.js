import * as adminService from "../services/adminRequests.service.js";

export async function listAll(req, res) {
  try {
    const items = await adminService.listAllRequests();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}

export async function updateStatus(req, res) {
  try {
    const { status, isPublished } = req.body;

    const updated = await adminService.updateRequestStatus({
      adminUserId: req.user.id,
      requestId: req.params.id,
      status,
      isPublished,
    });

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: String(err?.message || err) });
  }
}

export async function remove(req, res) {
  try {
    const result = await adminService.deleteRequest(req.params.id);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: String(err?.message || err) });
  }
}