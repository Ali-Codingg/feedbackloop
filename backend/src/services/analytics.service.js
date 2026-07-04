import { prisma } from "../config/prisma.js";

export async function getAdminAnalytics() {
  const [
    totalRequests,
    publishedRequests,
    unpublishedRequests,
    totalVotes,
    totalUsers,
    requestsByStatus,
    requestsByCategory,
    publishedWithVotes,
  ] = await Promise.all([
    prisma.featureRequest.count(),

    prisma.featureRequest.count({
      where: { isPublished: true },
    }),

    prisma.featureRequest.count({
      where: { isPublished: false },
    }),

    prisma.vote.count(),

    prisma.user.count(),

    prisma.featureRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),

    prisma.featureRequest.groupBy({
      by: ["category"],
      _count: { _all: true },
    }),

    prisma.featureRequest.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        _count: {
          select: { votes: true },
        },
      },
    }),
  ]);

  const pendingRequests = requestsByStatus.find(
    (item) => item.status === "PENDING"
  )?._count?._all || 0;

  const topRequests = publishedWithVotes
    .sort((a, b) => b._count.votes - a._count.votes)
    .slice(0, 5);

  return {
    totals: {
      totalUsers,
      totalRequests,
      publishedRequests,
      unpublishedRequests,
      pendingRequests,
      totalVotes,
    },

    byStatus: requestsByStatus.map((item) => ({
      status: item.status,
      count: item._count._all,
    })),

    byCategory: requestsByCategory.map((item) => ({
      category: item.category,
      count: item._count._all,
    })),

    topRequests,
  };
}