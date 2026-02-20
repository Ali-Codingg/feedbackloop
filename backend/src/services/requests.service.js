import { prisma } from "../config/prisma.js";

export async function createRequest({ userId, title, description, category }) {
  if (!userId) throw new Error("Missing userId");
  if (!title || !description || !category) {
    throw new Error("title, description, category are required");
  }

  return prisma.featureRequest.create({
    data: {
      title,
      description,
      category,
      status: "PENDING",
      isPublished: false,
      createdById: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      status: true,
      isPublished: true,
      createdAt: true,
    },
  });
}

export async function listPublishedRequests() {
  return prisma.featureRequest.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      status: true,
      isPublished: true,
      createdAt: true,
      _count: { select: { votes: true } },
    },
  });
}

export async function getPublishedRequestById(id) {
  if (!id) throw new Error("Missing id");

  const item = await prisma.featureRequest.findFirst({
    where: { id, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      status: true,
      isPublished: true,
      createdAt: true,
      _count: { select: { votes: true } },
    },
  });

  return item; // can be null (controller handles 404)
}