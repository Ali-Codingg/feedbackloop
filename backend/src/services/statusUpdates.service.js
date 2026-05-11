import { prisma } from "../config/prisma.js";

export async function createStatusUpdate({ requestId, adminUserId, message }) {
  if (!requestId) throw new Error("Missing requestId");
  if (!adminUserId) throw new Error("Missing adminUserId");
  if (!message || !message.trim()) throw new Error("message is required");

  const request = await prisma.featureRequest.findUnique({
    where: { id: requestId },
    select: { id: true },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  return prisma.statusUpdate.create({
    data: {
      requestId,
      createdById: adminUserId,
      message: message.trim(),
    },
    select: {
      id: true,
      requestId: true,
      message: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function listStatusUpdatesForPublishedRequest(requestId) {
  if (!requestId) throw new Error("Missing requestId");

  const request = await prisma.featureRequest.findFirst({
    where: {
      id: requestId,
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      isPublished: true,
    },
  });

  if (!request) {
    return null;
  }

  const updates = await prisma.statusUpdate.findMany({
    where: { requestId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      message: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return {
    request,
    updates,
  };
}