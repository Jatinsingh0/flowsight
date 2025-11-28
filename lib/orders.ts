import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDataWorkspace } from "@/lib/workspace-data";

const DEFAULT_RANGE_DAYS = 30;

function getDateNDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getOrderStats() {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    paidOrders,
    refundedOrders,
    revenueThisMonthAggregate,
  ] = await Promise.all([
    prisma.order.count({ where: { workspaceId } }),
    prisma.order.count({
      where: {
        status: OrderStatus.COMPLETED,
        workspaceId,
      },
    }),
    prisma.order.count({
      where: {
        status: OrderStatus.CANCELLED,
        workspaceId,
      },
    }),
    prisma.order.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startOfMonth,
        },
        workspaceId,
      },
    }),
  ]);

  return {
    totalOrders,
    paidOrders,
    refundedOrders,
    revenueThisMonth: revenueThisMonthAggregate._sum.amount ?? 0,
  };
}

export async function getOrders({
  status,
  search,
  days = DEFAULT_RANGE_DAYS,
}: {
  status?: OrderStatus | "ALL";
  search?: string;
  days?: number;
}) {
  const workspace = await getDataWorkspace();
  const workspaceId = workspace.id;
  const startDate = getDateNDaysAgo(days);

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      workspaceId,
      createdAt: {
        gte: startDate,
      },
      ...(status && status !== "ALL"
        ? {
            status,
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                user: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
              {
                user: {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
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

  return orders;
}

