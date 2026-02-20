import { prisma } from "../config/prisma.js";

const allowedStatuses = [
  "PENDING",
  "UNDER_REVIEW",
  "PLANNED",
  "IN_PROGRESS",
  "DONE",
  "REJECTED",
];

export async function listAllRequests() {
  return prisma.featureRequest.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      createdBy: { select: { id: true, name: true, email: true } },
      publishedBy: { select: { id: true, name: true, email: true } },
      _count: { select: { votes: true } },
    },
  });
}

export async function updateRequestStatus({ adminUserId, requestId, status, isPublished }) {
  if (!adminUserId) throw new Error("Missing adminUserId");
  if (!requestId) throw new Error("Missing requestId");

  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
  }

  // Decide whether to set publishedById
  const publishFlagProvided = typeof isPublished === "boolean";
  const shouldSetPublisher = publishFlagProvided && isPublished === true;

  return prisma.featureRequest.update({
    where: { id: requestId },
    data: {
      status,
      isPublished: publishFlagProvided ? isPublished : undefined,
      publishedById: shouldSetPublisher ? adminUserId : undefined,
    },
    select: {
      id: true,
      title: true,
      status: true,
      isPublished: true,
      updatedAt: true,
    },
  });
}

export async function deleteRequest(requestId) {
  if (!requestId) throw new Error("Missing requestId");
  await prisma.featureRequest.delete({ where: { id: requestId } });
  return { ok: true };
}

export { allowedStatuses };