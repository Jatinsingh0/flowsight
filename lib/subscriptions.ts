import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDataWorkspace } from "@/lib/workspace-data";

const DEFAULT_RANGE_DAYS = 30;

function getDateNDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getSubscriptionStats() {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  const thirtyDaysAgo = getDateNDaysAgo(30);

  const [
    activeCount,
    canceledCount,
    expiredCount,
    distinctPlans,
  ] = await Promise.all([
    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.ACTIVE,
        workspaceId,
      },
    }),
    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.CANCELLED,
        workspaceId,
      },
    }),
    prisma.subscription.count({
      where: {
        status: SubscriptionStatus.EXPIRED,
        workspaceId,
      },
    }),
    prisma.subscription.findMany({
      where: { workspaceId },
      select: {
        plan: true,
      },
      distinct: ["plan"],
    }),
  ]);

  return {
    activeCount,
    canceledCount,
    expiredCount,
    planCount: distinctPlans.length,
  };
}

export async function getPlanBreakdown() {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  
  const subscriptions = await prisma.subscription.findMany({
    where: { workspaceId },
    select: {
      plan: true,
    },
  });

  const result = subscriptions.reduce<Record<string, number>>((acc, sub) => {
    const plan = sub.plan || "Unknown";
    acc[plan] = (acc[plan] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(result).map(([plan, count]) => ({
    plan,
    count,
  }));
}

export async function getSubscriptions({
  status,
  plan,
  days = DEFAULT_RANGE_DAYS,
  search,
}: {
  status?: SubscriptionStatus | "ALL";
  plan?: string | "ALL";
  days?: number;
  search?: string;
}) {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  const startDate = getDateNDaysAgo(days);

  const subscriptions = await prisma.subscription.findMany({
    orderBy: {
      startDate: "desc",
    },
    where: {
      workspaceId,
      startDate: {
        gte: startDate,
      },
      ...(status && status !== "ALL"
        ? {
            status,
          }
        : {}),
      ...(plan && plan !== "ALL"
        ? {
            plan,
          }
        : {}),
      ...(search
        ? {
            user: {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          }
        : {}),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return subscriptions;
}

