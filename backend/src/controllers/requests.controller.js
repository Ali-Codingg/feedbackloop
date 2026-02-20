import * as requestsService from "../services/requests.service.js";

export async function create(req, res) {
  try {
    const { title, description, category } = req.body;

    const created = await requestsService.createRequest({
      userId: req.user.id,
      title,
      description,
      category,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ error: String(err?.message || err) });
  }
}

export async function listPublished(req, res) {
  try {
    const items = await requestsService.listPublishedRequests();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}

export async function getPublishedById(req, res) {
  try {
    const item = await requestsService.getPublishedRequestById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  } catch (err) {
    return res.status(400).json({ error: String(err?.message || err) });
  }
}