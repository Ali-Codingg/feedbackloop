import { prisma } from "../config/prisma.js";

export async function getUserProfile(userId) {
  if (!userId) throw new Error("Missing userId");

  const [user, submittedRequestsCount, votesCount, recentRequests] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),

      prisma.featureRequest.count({
        where: { createdById: userId },
      }),

      prisma.vote.count({
        where: { userId },
      }),

      prisma.featureRequest.findMany({
        where: { createdById: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          isPublished: true,
          createdAt: true,
          _count: {
            select: { votes: true },
          },
        },
      }),
    ]);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    user,
    stats: {
      submittedRequestsCount,
      votesCount,
    },
    recentRequests,
  };
}