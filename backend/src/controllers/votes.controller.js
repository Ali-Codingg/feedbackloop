import * as votesService from "../services/votes.service.js";

export async function vote(req, res) {
  try {
    const result = await votesService.addVote({
      userId: req.user.id,
      requestId: req.params.id,
    });

    return res.status(result.alreadyVoted ? 200 : 201).json(result);
  } catch (err) {
    return res.status(400).json({ error: String(err?.message || err) });
  }
}

export async function unvote(req, res) {
  try {
    const result = await votesService.removeVote({
      userId: req.user.id,
      requestId: req.params.id,
    });

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: String(err?.message || err) });
  }
}

export async function summary(req, res) {
  try {
    const result = await votesService.getVoteSummary({
      requestId: req.params.id,
      userId: req.user?.id,
    });

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: String(err?.message || err) });
  }
}