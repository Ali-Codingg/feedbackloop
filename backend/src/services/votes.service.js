import { prisma } from "../config/prisma.js";

export async function addVote({ userId, requestId }) {
  if (!userId) throw new Error("Missing userId");
  if (!requestId) throw new Error("Missing requestId");

  const request = await prisma.featureRequest.findUnique({
    where: { id: requestId },
    select: { id: true, isPublished: true },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (!request.isPublished) {
    throw new Error("Cannot vote on unpublished request");
  }

  const existingVote = await prisma.vote.findUnique({
    where: {
      requestId_userId: {
        requestId,
        userId,
      },
    },
  });

  if (existingVote) {
    return {
      alreadyVoted: true,
      vote: existingVote,
    };
  }

  const vote = await prisma.vote.create({
    data: {
      requestId,
      userId,
      value: 1,
    },
    select: {
      id: true,
      requestId: true,
      userId: true,
      value: true,
      createdAt: true,
    },
  });

  return {
    alreadyVoted: false,
    vote,
  };
}

export async function removeVote({ userId, requestId }) {
  if (!userId) throw new Error("Missing userId");
  if (!requestId) throw new Error("Missing requestId");

  const existingVote = await prisma.vote.findUnique({
    where: {
      requestId_userId: {
        requestId,
        userId,
      },
    },
  });

  if (!existingVote) {
    return { removed: false, message: "No vote found to remove" };
  }

  await prisma.vote.delete({
    where: {
      requestId_userId: {
        requestId,
        userId,
      },
    },
  });

  return { removed: true };
}

export async function getVoteSummary({ requestId, userId }) {
  if (!requestId) throw new Error("Missing requestId");

  const voteCount = await prisma.vote.count({
    where: { requestId },
  });

  let hasVoted = false;

  if (userId) {
    const vote = await prisma.vote.findUnique({
      where: {
        requestId_userId: {
          requestId,
          userId,
        },
      },
    });

    hasVoted = Boolean(vote);
  }

  return {
    requestId,
    voteCount,
    hasVoted,
  };
}